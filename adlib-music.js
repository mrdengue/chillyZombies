/*
 * adlib-music.js - Chilly Zombies background music.
 *
 * A tiny real-time OPL2-style (AdLib / Sound Blaster) 2-operator FM player on
 * the Web Audio API, plus two original looping compositions ("menu", "level").
 * Self-contained: no dependencies, no external files, no game globals used.
 *
 * Public API:
 *   AdlibMusic.play('menu' | 'level')   AdlibMusic.stop()
 *   AdlibMusic.setMuted(bool)  .isMuted()  .toggleMute()  .setVolume(0..1)
 *
 * It also watches the game's screens (div_shown / div_hidden) and picks the
 * right track by itself, and binds the 'M' key to mute/unmute.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') { return; }
  if (window.AdlibMusic) { return; } // already loaded

  var STORAGE_KEY = 'cz_music_muted';
  var DEFAULT_VOLUME = 0.35;
  var DUCK_LEVEL = 0.3;
  var LOOKAHEAD_MS = 25;
  var SCHEDULE_AHEAD = 0.15;      // seconds
  var SCHEDULE_AHEAD_HIDDEN = 1.2; // background tabs throttle timers to ~1 s

  // ------------------------------------------------------------------ storage

  function lsGet(key) {
    try { return window.localStorage ? window.localStorage.getItem(key) : null; } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { if (window.localStorage) { window.localStorage.setItem(key, val); } } catch (e) { /* ignore */ }
  }

  // ------------------------------------------------------------------ state

  var AC = window.AudioContext || window.webkitAudioContext || null;
  var ctx = null;
  var masterGain = null;
  var noiseBuffer = null;
  var waves = {};
  var muted = lsGet(STORAGE_KEY) === '1';
  var volume = DEFAULT_VOLUME;
  var ducked = false;
  var unlocked = false;   // a user gesture has happened
  var wanted = null;      // track that should be playing (if not muted)
  var current = null;     // currently running Track object

  // ------------------------------------------------------------------ instruments
  //
  // FM voice: modulator osc -> gain (deviation in Hz = index * modFreq) ->
  // carrier.frequency.  Envelopes: carrier a/d/s/r (seconds, s = level),
  // modulator index goes 0 -> idx (mA) then decays towards idxS (mD).
  // Waves: 'sine', 'half', 'abs', 'quarter' (the four OPL2 waveforms).

  var INSTRUMENTS = {
    clarinet: { type: 'fm', mR: 2, cR: 1, idx: 1.3, idxS: 0.8, mA: 0.03, mD: 0.25, mWave: 'sine', cWave: 'sine',
                a: 0.02, d: 0.2, s: 0.8, r: 0.08, gate: 0.9, vol: 0.22, vib: 0.004, vibRate: 5.2 },
    bassoon:  { type: 'fm', mR: 1, cR: 1, idx: 2.2, idxS: 1.2, mA: 0.02, mD: 0.15, mWave: 'half', cWave: 'sine',
                a: 0.015, d: 0.15, s: 0.7, r: 0.06, gate: 0.7, vol: 0.3 },
    tuba:     { type: 'fm', mR: 1, cR: 1, idx: 1.6, idxS: 0.6, mA: 0.03, mD: 0.12, mWave: 'sine', cWave: 'half',
                a: 0.02, d: 0.15, s: 0.6, r: 0.07, gate: 0.7, vol: 0.38 },
    pizz:     { type: 'fm', mR: 1, cR: 1, idx: 2.5, idxS: 0.0, mA: 0.002, mD: 0.06, mWave: 'sine', cWave: 'sine',
                a: 0.002, d: 0.25, s: 0.0, r: 0.08, gate: 1.0, vol: 0.2 },
    harpsi:   { type: 'fm', mR: 1, cR: 1, idx: 3.2, idxS: 0.4, mA: 0.001, mD: 0.12, mWave: 'quarter', cWave: 'half',
                a: 0.002, d: 0.35, s: 0.1, r: 0.08, gate: 0.9, vol: 0.2 },
    marimba:  { type: 'fm', mR: 4, cR: 1, idx: 1.6, idxS: 0.0, mA: 0.001, mD: 0.04, mWave: 'sine', cWave: 'sine',
                a: 0.001, d: 0.3, s: 0.0, r: 0.1, gate: 1.0, vol: 0.24 },
    organ:    { type: 'fm', mR: 2, cR: 1, idx: 0.55, idxS: 0.5, mA: 0.04, mD: 0.3, mWave: 'sine', cWave: 'abs',
                a: 0.04, d: 0.3, s: 0.85, r: 0.15, gate: 0.95, vol: 0.12 },
    flute:    { type: 'fm', mR: 1, cR: 1, idx: 0.3, idxS: 0.2, mA: 0.05, mD: 0.2, mWave: 'sine', cWave: 'sine',
                a: 0.04, d: 0.2, s: 0.8, r: 0.1, gate: 0.9, vol: 0.18, vib: 0.006, vibRate: 5 },
    kick:     { type: 'kick', f0: 130, f1: 45, sweep: 0.07, decay: 0.16, vol: 0.55 },
    snare:    { type: 'noise', filter: 'bandpass', freq: 1900, q: 0.8, decay: 0.11, vol: 0.32, tone: 185, toneVol: 0.2 },
    hat:      { type: 'noise', filter: 'highpass', freq: 7000, q: 0.7, decay: 0.035, vol: 0.13 },
    tick:     { type: 'noise', filter: 'bandpass', freq: 4200, q: 3, decay: 0.03, vol: 0.12 }
  };

  // ------------------------------------------------------------------ scores
  //
  // Token syntax (unit = one eighth note):
  //   D4 / F#3 / Bb2       note (octave optional: reuses the last one)
  //   D4-2  r-3  x-0.5     length in eighths (default 1)
  //   F3+A3+D4             chord
  //   r                    rest      x   percussion hit
  //   |                    bar line (checked: every bar must be 8 eighths)

  function rep(s, n) { var out = []; for (var i = 0; i < n; i++) { out.push(s); } return out.join(' | '); }
  // off-beat eighth chords: "r C r C r C r C" per bar
  function offbeat(chords) {
    var bars = [];
    for (var i = 0; i < chords.length; i++) { var c = chords[i]; bars.push('r ' + c + ' r ' + c + ' r ' + c + ' r ' + c); }
    return bars.join(' | ');
  }
  // "pah" on beats 2 and 4
  function pah(chords) {
    var bars = [];
    for (var i = 0; i < chords.length; i++) { bars.push('r-2 ' + chords[i] + '-2 r-2 ' + chords[i] + '-2'); }
    return bars.join(' | ');
  }
  function held(chords) {
    var bars = [];
    for (var i = 0; i < chords.length; i++) { bars.push(chords[i] + '-8'); }
    return bars.join(' | ');
  }

  // ---- MENU: "Mansion in the Snow" - D minor, 100 bpm, sneaky staccato bassoon,
  //      clarinet tune with chromatic turns, harpsichord off-beats; B section in
  //      Bb major with a bassoon tune over oom-pah tuba and plucked arpeggios.

  var MENU_A_LEAD = 'r-2 A4 Bb4 A4 G#4 A4-2 | F5-2 E5 D5 C#5-2 r-2 | r-2 D5 F5 Bb5-2 A5 G5 | F5 E5 F5 G5 E5-3 r | ' +
                    'r-2 A4 Bb4 A4 G#4 A4-2 | G5-2 F5 E5 D5-2 Bb4-2 | E5 G5 Bb5 G5 E5 C#5 A4 G4 | F4 E4 D4-3 r-3';
  var MENU_A_BASS = 'D2 r A2 r D3 r A2 r | D2 r A2 r D3 r C#3 r | Bb1 r F2 r Bb2 r F2 r | A1 r E2 r A2 r G2 F2 | ' +
                    'D2 r A2 r D3 r A2 r | G1 r D2 r G2 r Bb2 r | E2 r Bb2 r A1 r C#3 r | D2 r A1 r D2 A2 D3 r';
  var MENU_A_CHORDS = ['F3+A3+D4', 'F3+A3+D4', 'F3+Bb3+D4', 'E3+G3+C#4', 'F3+A3+D4', 'G3+Bb3+D4', 'E3+G3+Bb3', 'F3+A3+D4'];
  var MENU_B_LEAD = 'D3-2 F3 D3 Bb2-2 r-2 | C3-2 F3 C3 A2-2 r-2 | Bb2 D3 G3-2 F3 E3 D3-2 | C#3-3 E3 A3-3 r | ' +
                    'D3-2 F3 D3 Bb3-2 A3 G3 | F3-2 Db3 F3 Bb3-3 r | A3 G3 F3 E3 G3 F3 E3 D3 | C#3-2 E3-2 A2-2 r-2';
  var MENU_B_BASS = 'Bb1-2 r-2 F2-2 r-2 | A1-2 r-2 F2-2 r-2 | G1-2 r-2 D2-2 r-2 | A1-2 r-2 E2-2 r-2 | ' +
                    'Bb1-2 r-2 F2-2 r-2 | Bb1-2 r-2 Db2-2 r-2 | A1-2 r-2 C#2-2 r-2 | A1 r A1 Bb1 B1 C2 C#2 r';
  var MENU_B_ARP = 'D4 F4 Bb4 F4 D4 F4 Bb4 F4 | C4 F4 A4 F4 C4 F4 A4 F4 | D4 G4 Bb4 G4 D4 G4 Bb4 G4 | C#4 E4 G4 E4 C#4 E4 G4 E4 | ' +
                   'D4 F4 Bb4 F4 D4 F4 Bb4 F4 | Db4 F4 Bb4 F4 Db4 F4 Bb4 F4 | E4 G4 A4 C#5 A4 G4 E4 C#4 | E4 A4 C#5 E5 r-4';

  var MENU = {
    bpm: 100,
    gain: 1.0,
    order: ['A', 'A2', 'B', 'A3'],
    sections: {
      A: [
        { inst: 'clarinet', score: MENU_A_LEAD },
        { inst: 'bassoon', score: MENU_A_BASS },
        { inst: 'harpsi', score: offbeat(MENU_A_CHORDS), vol: 0.45 },
        { inst: 'kick', score: rep('x-4 x-4', 8), vol: 0.6 },
        { inst: 'tick', score: rep('r-2 x-2 r-2 x-2', 8) }
      ],
      A2: [
        { inst: 'marimba', score: MENU_A_LEAD },
        { inst: 'flute', score: MENU_A_LEAD, tr: 12, vol: 0.35 },
        { inst: 'bassoon', score: MENU_A_BASS },
        { inst: 'organ', score: held(MENU_A_CHORDS), vol: 0.8 },
        { inst: 'kick', score: rep('x-4 x-4', 8), vol: 0.6 },
        { inst: 'tick', score: rep('r x r x r x r x', 8), vol: 0.8 }
      ],
      B: [
        { inst: 'bassoon', score: MENU_B_LEAD, tr: 12, vol: 1.1 },
        { inst: 'pizz', score: MENU_B_ARP, tr: 12, vol: 0.8 },
        { inst: 'tuba', score: MENU_B_BASS, tr: 12 },
        { inst: 'kick', score: rep('x-2 r-2 x-2 r-2', 8), vol: 0.6 },
        { inst: 'hat', score: rep('r-2 x-2 r-2 x-2', 8) }
      ],
      A3: [
        { inst: 'clarinet', score: MENU_A_LEAD },
        { inst: 'bassoon', score: MENU_A_BASS },
        { inst: 'harpsi', score: offbeat(MENU_A_CHORDS), vol: 0.4 },
        { inst: 'organ', score: held(MENU_A_CHORDS), vol: 0.6 },
        { inst: 'kick', score: rep('x-4 x-4', 8), vol: 0.6 },
        { inst: 'tick', score: rep('r-2 x-2 r-2 x-2', 8) }
      ]
    }
  };

  // ---- LEVEL: "Snowball Skirmish" - G minor, 124 bpm, oom-pah march: tuba +
  //      organ "pah" chords, harpsichord / clarinet tune; B in Bb major led by
  //      bassoon with pizzicato plinks; C is a chromatic, more urgent bridge
  //      over driving bassoon octaves ending in a snare roll.

  var LVL_A_LEAD = 'D5 r D5 Eb5 D5 r Bb4 r | G4 A4 Bb4 C5 D5-2 r-2 | Eb5 r Eb5 F5 Eb5 r C5 r | A4 Bb4 C5 D5 C5-2 r-2 | ' +
                   'D5 r D5 Eb5 D5 r Bb4 r | G5 r G5 F5 Eb5 D5 Eb5 G5 | F#5-2 Eb5 C5 A4-2 F#4-2 | G4-2 D5-2 G4-2 r-2';
  var LVL_A_BASS = 'G1-2 r-2 D2-2 r-2 | G1-2 r-2 D2-2 r B1 | C2-2 r-2 G1-2 r-2 | D2-2 r-2 A1-2 F#1 A1 | ' +
                   'G1-2 r-2 D2-2 r-2 | Eb2-2 r-2 Bb1-2 r-2 | A1-2 r-2 D2-2 r-2 | G1-2 r-2 D2 C2 Bb1 A1';
  var LVL_A_CHORDS = ['G3+Bb3+D4', 'G3+Bb3+D4', 'G3+C4+Eb4', 'F#3+A3+C4', 'G3+Bb3+D4', 'G3+Bb3+Eb4', 'F#3+A3+C4', 'G3+Bb3+D4'];
  var LVL_B_LEAD = 'F3 Bb3 D4 F4 D4-2 Bb3-2 | C4 D4 C4 Bb3 A3-2 F3-2 | G3 Bb3 Eb4 G4 F4-2 Eb4-2 | D4 C4 A3 C4 F3-3 r | ' +
                   'F3 Bb3 D4 F4 D4-2 Bb3-2 | B3 D4 F4 G4 F4-2 D4-2 | Eb4 D4 C4 G3 C4-2 Eb4-2 | D4 r A3 r F#3 r D3 r';
  var LVL_B_BASS = 'Bb1-2 r-2 F2-2 r-2 | Bb1-2 r-2 F2-2 D2-2 | Eb2-2 r-2 Bb1-2 r-2 | F2-2 r-2 C2-2 A1-2 | ' +
                   'Bb1-2 r-2 F2-2 r-2 | G1-2 r-2 D2-2 B1-2 | C2-2 r-2 G1-2 Eb2-2 | D2 r A1 r D2 C2 Bb1 A1';
  var LVL_B_PLINK = 'r D5 r F5 r D5 r Bb4 | r D5 r F5 r D5 r Bb4 | r Eb5 r G5 r Eb5 r Bb4 | r Eb5 r F5 r C5 r A4 | ' +
                    'r D5 r F5 r D5 r Bb4 | r D5 r F5 r B4 r G4 | r Eb5 r G5 r C5 r G4 | r C5 r A4 r F#4 r D4';
  var LVL_B_CHORDS = ['F3+Bb3+D4', 'F3+Bb3+D4', 'G3+Bb3+Eb4', 'F3+A3+Eb4', 'F3+Bb3+D4', 'G3+B3+F4', 'G3+C4+Eb4', 'F#3+A3+C4'];
  var LVL_C_LEAD = 'G4-3 Ab4 G4-2 Eb4-2 | C5-3 B4 C5-2 G4-2 | D5-3 Eb5 D5-2 Bb4-2 | G5-4 F#5-2 F5-2 | ' +
                   'Eb5-3 F5 G5-2 Bb5-2 | Bb5-3 A5 Gb5-2 Eb5-2 | D5 Eb5 D5 C#5 D5 F#5 A5 C6 | D6-2 C6 A5 F#5 Eb5 D5 C5';
  var LVL_C_BASS = 'C2 r C3 r Eb2 r G2 r | C2 r C3 r G2 r Eb2 r | G1 r G2 r Bb1 r D2 r | G1 r G2 r D2 r Bb1 r | ' +
                   'Eb2 r Eb3 r Bb2 r G2 r | Eb2 r Eb3 r Gb2 r Bb2 r | D2 r D3 r D2 r D3 r | D2 D3 D2 D3 D2 D3 C3 A2';
  var LVL_C_ARP = 'Eb4 G4 C5 G4 Eb4 G4 C5 G4 | Eb4 G4 C5 G4 Eb4 G4 C5 G4 | D4 G4 Bb4 G4 D4 G4 Bb4 G4 | D4 G4 Bb4 G4 D4 G4 Bb4 G4 | ' +
                  'Eb4 G4 Bb4 G4 Eb4 G4 Bb4 G4 | Eb4 Gb4 Bb4 Gb4 Eb4 Gb4 Bb4 Gb4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 | D4 F#4 A4 F#4 D4 F#4 A4 C5';

  var MARCH_KICK = rep('x-2 r-2 x-2 r-2', 8);
  var MARCH_SNARE = rep('r-2 x-2 r-2 x-2', 8);
  var MARCH_HAT = rep('x x x x x x x x', 8);

  var LEVEL = {
    bpm: 124,
    gain: 0.8,
    order: ['A', 'B', 'A2', 'C'],
    sections: {
      A: [
        { inst: 'harpsi', score: LVL_A_LEAD, vol: 1.1 },
        { inst: 'tuba', score: LVL_A_BASS, tr: 12 },
        { inst: 'organ', score: pah(LVL_A_CHORDS), vol: 0.9 },
        { inst: 'kick', score: MARCH_KICK },
        { inst: 'snare', score: MARCH_SNARE, vol: 0.8 },
        { inst: 'hat', score: MARCH_HAT, vol: 0.7 }
      ],
      B: [
        { inst: 'bassoon', score: LVL_B_LEAD, tr: 12 },
        { inst: 'pizz', score: LVL_B_PLINK },
        { inst: 'tuba', score: LVL_B_BASS, tr: 12 },
        { inst: 'organ', score: pah(LVL_B_CHORDS), vol: 0.7 },
        { inst: 'kick', score: MARCH_KICK },
        { inst: 'snare', score: MARCH_SNARE, vol: 0.6 },
        { inst: 'hat', score: rep('r x r x r x r x', 8), vol: 0.7 }
      ],
      A2: [
        { inst: 'clarinet', score: LVL_A_LEAD },
        { inst: 'marimba', score: LVL_A_LEAD, tr: 12, vol: 0.4 },
        { inst: 'tuba', score: LVL_A_BASS, tr: 12 },
        { inst: 'organ', score: pah(LVL_A_CHORDS), vol: 0.9 },
        { inst: 'kick', score: MARCH_KICK },
        { inst: 'snare', score: MARCH_SNARE, vol: 0.8 },
        { inst: 'hat', score: MARCH_HAT, vol: 0.7 }
      ],
      C: [
        { inst: 'organ', score: LVL_C_LEAD, vol: 1.6 },
        { inst: 'bassoon', score: LVL_C_BASS, tr: 12, vol: 0.9 },
        { inst: 'marimba', score: LVL_C_ARP, vol: 0.6 },
        { inst: 'kick', score: rep('x-4 x-4', 7) + ' | x-2 x-2 x-2 x-2' },
        { inst: 'snare', score: rep('r-2 x-2 r-2 x-2', 7) + ' | r-2 x-2 x x x-0.5 x-0.5 x-0.5 x-0.5', vol: 0.8 },
        { inst: 'hat', score: MARCH_HAT, vol: 0.6 }
      ]
    }
  };

  var SONGS = { menu: MENU, level: LEVEL };

  // ------------------------------------------------------------------ score compiler

  var NOTE_IDX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var TOKEN_RE = /^([A-Gxr](?:[#b]?\d?)?(?:\+[A-G][#b]?\d?)*)(?:-(\d+(?:\.\d+)?))?$/;
  var PITCH_RE = /^([A-G])([#b]?)(\d?)$/;

  function parseScore(score, warnings, label) {
    var events = [];
    var pos = 0;
    var barStart = 0;
    var lastOct = 4;
    var tokens = score.split(/\s+/);
    for (var i = 0; i < tokens.length; i++) {
      var tok = tokens[i];
      if (!tok) { continue; }
      if (tok === '|') {
        if (Math.abs(pos - barStart - 8) > 1e-6 && warnings) { warnings.push(label + ': bar at ' + barStart + ' has ' + (pos - barStart) + ' eighths'); }
        barStart = pos;
        continue;
      }
      var m = TOKEN_RE.exec(tok);
      if (!m) { if (warnings) { warnings.push(label + ': bad token ' + tok); } continue; }
      var len = m[2] ? parseFloat(m[2]) : 1;
      var body = m[1];
      if (body === 'x') {
        events.push({ t: pos, d: len, notes: [0] });
      } else if (body !== 'r') {
        var parts = body.split('+');
        var notes = [];
        for (var j = 0; j < parts.length; j++) {
          var p = PITCH_RE.exec(parts[j]);
          if (!p) { if (warnings) { warnings.push(label + ': bad pitch ' + parts[j]); } continue; }
          if (p[3] !== '') { lastOct = parseInt(p[3], 10); }
          var acc = p[2] === '#' ? 1 : (p[2] === 'b' ? -1 : 0);
          notes.push(12 * (lastOct + 1) + NOTE_IDX[p[1]] + acc);
        }
        events.push({ t: pos, d: len, notes: notes });
      }
      pos += len;
    }
    if (Math.abs(pos - barStart - 8) > 1e-6 && warnings) { warnings.push(label + ': last bar has ' + (pos - barStart) + ' eighths'); }
    return { events: events, length: pos };
  }

  var compiled = {};
  function compileSong(name, warnings) {
    if (compiled[name] && !warnings) { return compiled[name]; }
    var song = SONGS[name];
    var events = [];
    var offset = 0;
    for (var s = 0; s < song.order.length; s++) {
      var secName = song.order[s];
      var parts = song.sections[secName];
      var secLen = 0;
      for (var p = 0; p < parts.length; p++) {
        var part = parts[p];
        var parsed = parseScore(part.score, warnings, name + '.' + secName + '.' + part.inst);
        if (parsed.length > secLen) { secLen = parsed.length; }
        for (var e = 0; e < parsed.events.length; e++) {
          var ev = parsed.events[e];
          var notes = [];
          for (var k = 0; k < ev.notes.length; k++) { notes.push(ev.notes[k] + (part.tr || 0)); }
          events.push({ t: offset + ev.t, d: ev.d, notes: notes, inst: part.inst, vol: (part.vol === undefined ? 1 : part.vol) });
        }
      }
      for (var q = 0; q < parts.length; q++) {
        var l = parseScore(parts[q].score, null, '').length;
        if (warnings && l !== secLen) { warnings.push(name + '.' + secName + '.' + parts[q].inst + ' length ' + l + ' != ' + secLen); }
      }
      offset += secLen;
    }
    events.sort(function (a, b) { return a.t - b.t; });
    var result = { events: events, length: offset, bpm: song.bpm, gain: song.gain, secPerEighth: 30 / song.bpm };
    compiled[name] = result;
    return result;
  }

  // ------------------------------------------------------------------ audio graph

  function makeWave(fn) {
    var N = 2048, H = 48;
    var real = new Float32Array(H + 1), imag = new Float32Array(H + 1);
    var samples = new Float32Array(N), k, n;
    for (n = 0; n < N; n++) { samples[n] = fn(n / N); }
    for (k = 1; k <= H; k++) {
      var re = 0, im = 0;
      for (n = 0; n < N; n++) {
        var ang = 2 * Math.PI * k * n / N;
        re += samples[n] * Math.cos(ang);
        im += samples[n] * Math.sin(ang);
      }
      real[k] = 2 * re / N;
      imag[k] = 2 * im / N;
    }
    return ctx.createPeriodicWave(real, imag);
  }

  function buildWaves() {
    try {
      waves.half = makeWave(function (p) { var s = Math.sin(2 * Math.PI * p); return s > 0 ? s : 0; });
      waves.abs = makeWave(function (p) { return Math.abs(Math.sin(2 * Math.PI * p)); });
      waves.quarter = makeWave(function (p) { return (p % 0.5) < 0.25 ? Math.abs(Math.sin(2 * Math.PI * p)) : 0; });
    } catch (e) { waves = {}; }
  }

  function setWave(osc, kind) {
    if (kind && kind !== 'sine' && waves[kind]) { osc.setPeriodicWave(waves[kind]); } else { osc.type = 'sine'; }
  }

  function ensureContext() {
    if (ctx || !AC) { return ctx; }
    try { ctx = new AC(); } catch (e) { ctx = null; return null; }
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    var len = ctx.sampleRate; // 1 s of white noise
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = noiseBuffer.getChannelData(0);
    for (var i = 0; i < len; i++) { data[i] = Math.random() * 2 - 1; }
    buildWaves();
    applyMasterGain(true);
    return ctx;
  }

  function applyMasterGain(immediate) {
    if (!ctx || !masterGain) { return; }
    var target = muted ? 0 : volume * (ducked ? DUCK_LEVEL : 1);
    var g = masterGain.gain;
    try {
      g.cancelScheduledValues(ctx.currentTime);
      if (immediate) { g.setValueAtTime(target, ctx.currentTime); } else { g.setTargetAtTime(target, ctx.currentTime, 0.12); }
    } catch (e) { g.value = target; }
  }

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function cleanup(nodes) {
    return function () { for (var i = 0; i < nodes.length; i++) { try { nodes[i].disconnect(); } catch (e) { /* ignore */ } } };
  }

  function playFM(ins, midiNote, t, dur, vol, dest) {
    var f = mtof(midiNote);
    var car = ctx.createOscillator();
    var mod = ctx.createOscillator();
    var modGain = ctx.createGain();
    var amp = ctx.createGain();
    setWave(car, ins.cWave);
    setWave(mod, ins.mWave);
    car.frequency.setValueAtTime(f * ins.cR, t);
    mod.frequency.setValueAtTime(f * ins.mR, t);
    var nodes = [car, mod, modGain, amp];
    var lfo = null, lfoGain = null;
    if (ins.vib) {
      lfo = ctx.createOscillator();
      lfoGain = ctx.createGain();
      lfo.frequency.value = ins.vibRate || 5;
      lfoGain.gain.setValueAtTime(0, t);
      lfoGain.gain.linearRampToValueAtTime(f * ins.cR * ins.vib, t + 0.25);
      lfo.connect(lfoGain);
      lfoGain.connect(car.frequency);
      nodes.push(lfo, lfoGain);
    }
    // modulator envelope (index in units of modulator frequency)
    var dev = f * ins.mR;
    var mg = modGain.gain;
    mg.setValueAtTime(0, t);
    mg.linearRampToValueAtTime(ins.idx * dev, t + ins.mA);
    mg.setTargetAtTime(ins.idxS * dev, t + ins.mA, ins.mD / 3);
    // carrier envelope
    var peak = ins.vol * vol;
    var off = t + Math.max(0.03, dur * ins.gate);
    var ag = amp.gain;
    ag.setValueAtTime(0, t);
    ag.linearRampToValueAtTime(peak, t + ins.a);
    ag.setTargetAtTime(peak * ins.s, t + ins.a, ins.d / 3);
    ag.setTargetAtTime(0, off, ins.r / 4);
    mg.setTargetAtTime(0, off, ins.r / 4);
    var end = off + ins.r * 1.6 + 0.02;
    mod.connect(modGain);
    modGain.connect(car.frequency);
    car.connect(amp);
    amp.connect(dest);
    mod.start(t); car.start(t);
    mod.stop(end); car.stop(end);
    if (lfo) { lfo.start(t); lfo.stop(end); }
    car.onended = cleanup(nodes);
  }

  function playNoise(ins, t, vol, dest) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    var filt = ctx.createBiquadFilter();
    filt.type = ins.filter;
    filt.frequency.value = ins.freq;
    filt.Q.value = ins.q;
    var amp = ctx.createGain();
    var peak = ins.vol * vol;
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(peak, t + 0.001);
    amp.gain.setTargetAtTime(0, t + 0.002, ins.decay / 2.5);
    src.connect(filt); filt.connect(amp); amp.connect(dest);
    var end = t + ins.decay * 3 + 0.02;
    src.start(t, Math.random() * 0.8);
    src.stop(end);
    var nodes = [src, filt, amp];
    if (ins.tone) { // OPL snare = noise + tone
      var o = ctx.createOscillator();
      var og = ctx.createGain();
      o.frequency.setValueAtTime(ins.tone, t);
      o.frequency.exponentialRampToValueAtTime(ins.tone * 0.7, t + 0.08);
      og.gain.setValueAtTime(0, t);
      og.gain.linearRampToValueAtTime(ins.toneVol * vol, t + 0.001);
      og.gain.setTargetAtTime(0, t + 0.002, 0.03);
      o.connect(og); og.connect(dest);
      o.start(t); o.stop(end);
      nodes.push(o, og);
    }
    src.onended = cleanup(nodes);
  }

  function playKick(ins, t, vol, dest) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.frequency.setValueAtTime(ins.f0, t);
    o.frequency.exponentialRampToValueAtTime(ins.f1, t + ins.sweep);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(ins.vol * vol, t + 0.002);
    g.gain.setTargetAtTime(0, t + 0.003, ins.decay / 3);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + ins.decay * 2 + 0.02);
    o.onended = cleanup([o, g]);
  }

  function playEvent(ev, t, dur, dest) {
    var ins = INSTRUMENTS[ev.inst];
    if (!ins) { return; }
    try {
      if (ins.type === 'fm') {
        var chordScale = ev.notes.length > 1 ? 1 / Math.sqrt(ev.notes.length) : 1;
        for (var i = 0; i < ev.notes.length; i++) { playFM(ins, ev.notes[i], t, dur, ev.vol * chordScale, dest); }
      } else if (ins.type === 'noise') {
        playNoise(ins, t, ev.vol, dest);
      } else if (ins.type === 'kick') {
        playKick(ins, t, ev.vol, dest);
      }
    } catch (e) { /* never let one note break the scheduler */ }
  }

  // ------------------------------------------------------------------ tracks / scheduler

  function Track(name) {
    this.name = name;
    this.song = compileSong(name);
    this.out = ctx.createGain();
    this.out.gain.setValueAtTime(0, ctx.currentTime);
    this.out.gain.linearRampToValueAtTime(this.song.gain, ctx.currentTime + 0.4);
    this.out.connect(masterGain);
    this.loopStart = ctx.currentTime + 0.12;
    this.index = 0;
    this.stopped = false;
    var self = this;
    this.timer = setInterval(function () { self.tick(); }, LOOKAHEAD_MS);
    this.tick();
  }

  Track.prototype.tick = function () {
    if (this.stopped || !ctx) { return; }
    var now = ctx.currentTime;
    var hidden = typeof document !== 'undefined' && document.hidden;
    var horizon = now + (hidden ? SCHEDULE_AHEAD_HIDDEN : SCHEDULE_AHEAD);
    var song = this.song;
    var spe = song.secPerEighth;
    var loopSec = song.length * spe;
    // if we fell far behind (suspended context, sleeping tab), jump ahead
    if (now - this.loopStart > loopSec * 2) {
      this.loopStart += Math.floor((now - this.loopStart) / loopSec - 1) * loopSec;
    }
    var guard = 0;
    while (guard++ < 2000) {
      var ev = song.events[this.index];
      var t = this.loopStart + ev.t * spe;
      if (t >= horizon) { break; }
      if (t >= now - 0.02) { playEvent(ev, Math.max(t, now), ev.d * spe, this.out); }
      this.index++;
      if (this.index >= song.events.length) {
        this.index = 0;
        this.loopStart += loopSec;
      }
    }
  };

  Track.prototype.stop = function (fade) {
    if (this.stopped) { return; }
    this.stopped = true;
    clearInterval(this.timer);
    var out = this.out;
    try {
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
      out.gain.setTargetAtTime(0, ctx.currentTime, (fade || 0.5) / 4);
    } catch (e) { /* ignore */ }
    setTimeout(function () { try { out.disconnect(); } catch (e) { /* ignore */ } }, ((fade || 0.5) + 0.6) * 1000);
  };

  function startWanted() {
    if (!wanted || muted || !unlocked) { return; }
    if (!ensureContext()) { return; }
    if (current && current.name === wanted) { return; }
    if (current) { current.stop(0.8); current = null; }
    current = new Track(wanted);
  }

  // ------------------------------------------------------------------ public API

  function play(name) {
    if (!SONGS[name]) { return; }
    wanted = name;
    if (current && current.name === name) { return; }
    startWanted();
  }

  function stop() {
    wanted = null;
    if (current) { current.stop(0.6); current = null; }
  }

  function setMuted(b) {
    muted = !!b;
    lsSet(STORAGE_KEY, muted ? '1' : '0');
    if (muted) {
      if (current) { current.stop(0.3); current = null; }
      applyMasterGain(false);
    } else {
      applyMasterGain(false);
      startWanted();
    }
  }

  function setVolume(v) {
    v = parseFloat(v);
    if (isNaN(v)) { return; }
    volume = Math.max(0, Math.min(1, v));
    applyMasterGain(false);
  }

  function setDucked(b) {
    b = !!b;
    if (b === ducked) { return; }
    ducked = b;
    applyMasterGain(false);
  }

  window.AdlibMusic = {
    play: play,
    stop: stop,
    setMuted: setMuted,
    isMuted: function () { return muted; },
    toggleMute: function () { setMuted(!muted); return muted; },
    setVolume: setVolume,
    // diagnostics (used by tests; harmless)
    _state: function () {
      return { contextState: ctx ? ctx.state : 'none', playing: current ? current.name : null,
               wanted: wanted, muted: muted, ducked: ducked, unlocked: unlocked };
    },
    _validate: function () {
      var w = [], info = {};
      for (var k in SONGS) {
        if (SONGS.hasOwnProperty(k)) {
          var c = compileSong(k, w);
          info[k] = { events: c.events.length, eighths: c.length, seconds: c.length * c.secPerEighth };
        }
      }
      return { warnings: w, info: info };
    }
  };

  // ------------------------------------------------------------------ user gesture unlock

  function onGesture() {
    unlocked = true;
    if (!AC) { return; }
    if (!ctx && (!wanted || muted)) { return; } // create lazily, only when needed
    ensureContext();
    if (ctx && ctx.state !== 'running' && ctx.resume) {
      try {
        var pr = ctx.resume();
        if (pr && pr.then) { pr.then(function () {}, function () {}); }
      } catch (e) { /* ignore */ }
    }
    startWanted();
  }

  function addListener(target, type, fn) {
    try { target.addEventListener(type, fn, { capture: true, passive: true }); } catch (e) {
      try { target.addEventListener(type, fn, true); } catch (e2) { /* ignore */ }
    }
  }

  if (typeof document !== 'undefined') {
    addListener(document, 'mousedown', onGesture);
    addListener(document, 'touchstart', onGesture);
    addListener(document, 'touchend', onGesture);
    addListener(document, 'keydown', onGesture);
    addListener(document, 'pointerdown', onGesture);

    // 'M' toggles music
    document.addEventListener('keydown', function (e) {
      var key = e.key || '';
      if (!(key === 'm' || key === 'M' || (!key && e.keyCode === 77))) { return; }
      if (e.ctrlKey || e.metaKey || e.altKey) { return; }
      var el = e.target || document.activeElement;
      var tag = el && el.tagName ? el.tagName.toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) { return; }
      window.AdlibMusic.toggleMute();
    }, false);
  }

  // ------------------------------------------------------------------ screen watcher

  function shown(id) {
    var el = document.getElementById(id);
    return !!(el && /(^|\s)div_shown(\s|$)/.test(el.className || ''));
  }

  function watchScreens() {
    if (typeof document === 'undefined') { return; }
    try {
      if (shown('id_div_gameover') || shown('id_div_gameend')) {
        setDucked(false);
        if (wanted || current) { stop(); }
      } else if (shown('id_div_mainmenu') || shown('id_div_selectlevel') || shown('id_div_about') || shown('id_div_tutorial')) {
        setDucked(false);
        play('menu');
      } else if (shown('id_div_container')) {
        play('level');
        setDucked(shown('id_div_pauselevelscreen'));
      }
      // id_div_loading (or nothing recognised) -> leave things as they are
    } catch (e) { /* ignore */ }
  }

  setInterval(watchScreens, 400);
})();
