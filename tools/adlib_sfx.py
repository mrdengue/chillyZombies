#!/usr/bin/env python3
"""
adlib_sfx.py - Regenerate Chilly Zombies sound effects with a tiny
OPL2-style (AdLib / Sound Blaster) 2-operator FM synthesizer.

Requirements: Python 3, numpy, and ffmpeg (with libmp3lame) on PATH.

Usage (from the repo root):
    python3 tools/adlib_sfx.py            # writes all *.mp3 into the repo root
    python3 tools/adlib_sfx.py --wav DIR  # also keep the intermediate WAVs in DIR

Synth model (loosely after the Yamaha YM3812):
  * every voice = modulator operator -> carrier operator (phase modulation)
  * the modulator can feed back into itself (OPL "FB" parameter)
  * each operator has its own ADSR envelope and one of the four OPL2
    waveforms: sine, half-sine, abs-sine, quarter-sine (pulse-sine)
  * optional pitch sweeps / vibrato per voice
  * a noise "channel" approximates OPL rhythm mode (snare / hat / cymbal)
  * output is low-passed (~10 kHz) and lightly quantized (11-bit) so it has
    a subtle Sound Blaster grit, then normalized and encoded with LAME.

All sounds are original.
"""

import math
import os
import shutil
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 44100
RNG = np.random.default_rng(1993)

# ---------------------------------------------------------------- basics


def secs(t):
    return int(round(t * SR))


def midi(n):
    return 440.0 * 2.0 ** ((n - 69) / 12.0)


NOTE_IDX = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def note(name):
    """'C4', 'F#3', 'Bb2' -> Hz"""
    letter = name[0]
    rest = name[1:]
    acc = 0
    while rest and rest[0] in "#b":
        acc += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    octave = int(rest)
    return midi(12 * (octave + 1) + NOTE_IDX[letter] + acc)


def wavefn(phase_cycles, kind):
    """OPL2 waveforms on a phase given in cycles (numpy array)."""
    s = np.sin(2.0 * np.pi * phase_cycles)
    if kind == "sine":
        return s
    if kind == "half":  # OPL wave 1
        return np.maximum(s, 0.0)
    if kind == "abs":  # OPL wave 2
        return np.abs(s)
    if kind == "quarter":  # OPL wave 3 ("pulse sine")
        frac = np.mod(phase_cycles, 0.5)
        return np.where(frac < 0.25, np.abs(s), 0.0)
    raise ValueError(kind)


def _wave_scalar(ph, kind):
    s = math.sin(2.0 * math.pi * ph)
    if kind == "sine":
        return s
    if kind == "half":
        return s if s > 0 else 0.0
    if kind == "abs":
        return abs(s)
    frac = ph % 0.5
    return abs(s) if frac < 0.25 else 0.0


def adsr(n, a=0.005, d=0.1, s=0.7, r=0.1, hold=None):
    """Envelope of n samples. Attack linear, decay/release exponential-ish.
    `hold` = key-on time in seconds (default: whole length minus release)."""
    t = np.arange(n) / SR
    if hold is None:
        hold = max(n / SR - r, a)
    env = np.empty(n)
    # attack
    att = t < a
    env[att] = t[att] / max(a, 1e-6)
    # decay towards sustain
    dec = ~att
    td = t[dec] - a
    env[dec] = s + (1.0 - s) * np.exp(-td / max(d, 1e-6) * 3.0)
    # release after key-off
    rel = t >= hold
    if np.any(rel):
        idx = np.argmax(rel)
        level = env[idx]
        tr = t[rel] - hold
        env[rel] = level * np.exp(-tr / max(r, 1e-6) * 4.0)
    return env


def as_array(x, n):
    if np.isscalar(x):
        return np.full(n, float(x))
    x = np.asarray(x, dtype=float)
    if len(x) != n:
        x = np.interp(np.linspace(0, 1, n), np.linspace(0, 1, len(x)), x)
    return x


def sweep(n, points, curve="exp"):
    """Pitch / value curve through [(t_sec, value), ...]."""
    t = np.arange(n) / SR
    ts = np.array([p[0] for p in points])
    vs = np.array([p[1] for p in points], dtype=float)
    if curve == "exp":
        return np.exp(np.interp(t, ts, np.log(vs)))
    return np.interp(t, ts, vs)


def vibrato(n, rate, depth, delay=0.0):
    """Multiplicative pitch factor: depth in fraction (0.01 = 1%)."""
    t = np.arange(n) / SR
    ramp = np.clip((t - delay) / 0.15, 0, 1) if delay > 0 else 1.0
    return 1.0 + depth * ramp * np.sin(2 * np.pi * rate * t)


def operator(freq, wave_kind, env, pm=None, feedback=0.0):
    """One OPL operator. freq: Hz array; env: amplitude array;
    pm: phase modulation input in cycles; feedback: 0..1 (self-modulation)."""
    n = len(freq)
    phase = np.cumsum(freq) / SR
    if feedback <= 0.0:
        ph = phase if pm is None else phase + pm
        return wavefn(ph, wave_kind) * env
    # feedback needs a sample loop (averages the last two outputs like the OPL)
    out = np.empty(n)
    y1 = y2 = 0.0
    fbk = feedback * 0.5
    pmv = pm if pm is not None else np.zeros(n)
    for i in range(n):
        ph = phase[i] + pmv[i] + fbk * (y1 + y2) * 0.5
        y = _wave_scalar(ph, wave_kind) * env[i]
        out[i] = y
        y2, y1 = y1, y
    return out


def fm_voice(dur, freq, mult_m=1.0, mult_c=1.0, index=1.0, feedback=0.0,
             wave_m="sine", wave_c="sine",
             env_m=(0.005, 0.2, 0.6, 0.1), env_c=(0.005, 0.2, 0.7, 0.1),
             hold=None, amp=1.0):
    """2-op FM voice. index = peak modulation depth in cycles (OPL TL-ish)."""
    n = secs(dur)
    f = as_array(freq, n)
    em = adsr(n, *env_m, hold=hold) * index
    ec = adsr(n, *env_c, hold=hold) * amp
    mod = operator(f * mult_m, wave_m, em, feedback=feedback)
    return operator(f * mult_c, wave_c, ec, pm=mod)


# ---------------------------------------------------------------- noise / filters


def fft_filter(x, lo=None, hi=None, slope=1.0):
    """Zero-phase spectral band filter with soft (Butterworth-ish) skirts."""
    n = len(x)
    if n == 0:
        return x
    N = 1 << int(math.ceil(math.log2(n * 2)))
    X = np.fft.rfft(x, N)
    f = np.fft.rfftfreq(N, 1.0 / SR)
    g = np.ones_like(f)
    if hi is not None:
        g *= 1.0 / np.sqrt(1.0 + (f / hi) ** (4 * slope))
    if lo is not None:
        ff = np.maximum(f, 1e-3)
        g *= 1.0 / np.sqrt(1.0 + (lo / ff) ** (4 * slope))
    return np.fft.irfft(X * g, N)[:n]


def noise(dur, lo=None, hi=None, env=None, amp=1.0):
    n = secs(dur)
    x = RNG.uniform(-1, 1, n)
    x = fft_filter(x, lo, hi)
    x /= max(1e-9, np.max(np.abs(x)))
    if env is not None:
        x *= as_array(env, n) if not callable(env) else env(n)
    return x * amp


def perc_env(n, attack=0.001, decay=0.08):
    t = np.arange(n) / SR
    e = np.exp(-np.maximum(t - attack, 0) / decay)
    e[t < attack] = t[t < attack] / attack
    return e


# ---------------------------------------------------------------- mixing


class Mix:
    def __init__(self, dur):
        self.buf = np.zeros(secs(dur))

    def add(self, sig, at=0.0, gain=1.0):
        i = secs(at)
        if i >= len(self.buf):
            return
        j = min(len(self.buf), i + len(sig))
        self.buf[i:j] += sig[: j - i] * gain


def sound_blaster(x, peak_db, fade_out=0.03, fade_in=0.002):
    """Band-limit, normalize, light quantization, fades."""
    x = fft_filter(x, lo=30, hi=10000)
    # trim any leading near-silence so the sound starts immediately
    thr = np.max(np.abs(x)) * 0.01
    start = int(np.argmax(np.abs(x) > thr)) if np.any(np.abs(x) > thr) else 0
    x = x[max(0, start - 8):]
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * (10 ** (peak_db / 20.0))
    # subtle "11-bit DAC" quantization, then fades (fades last = no clicks)
    q = 1024.0
    x = np.round(x * q) / q
    n_in, n_out = secs(fade_in), secs(fade_out)
    if n_in > 0:
        x[:n_in] *= np.linspace(0, 1, n_in)
    if n_out > 0:
        x[-n_out:] *= np.linspace(1, 0, n_out) ** 2
    x[-1] = 0.0
    return x


def write_wav(path, x):
    pcm = np.clip(x, -1, 1)
    pcm = (pcm * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def encode_mp3(wav_path, mp3_path, bitrate="112k"):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
         "-codec:a", "libmp3lame", "-b:a", bitrate, "-ac", "1", "-ar", str(SR),
         mp3_path],
        check=True,
    )


# ---------------------------------------------------------------- instruments
# (shared by the jingles)


def brass(dur, f, amp=1.0, wah=0.0, vib=0.0, fb=0.45):
    n = secs(dur)
    ff = as_array(f, n) * vibrato(n, 5.5, vib, delay=0.12)
    idx = adsr(n, 0.06, 0.25, 0.75, 0.08) * 1.6
    if wah:
        t = np.arange(n) / SR
        idx = idx * (1.0 + wah * np.sin(2 * np.pi * 4.0 * t - np.pi / 2))
    mod = operator(ff, "sine", idx, feedback=fb)
    ec = adsr(n, 0.025, 0.2, 0.8, 0.08) * amp
    return operator(ff, "sine", ec, pm=mod)


def tuba(dur, f, amp=1.0):
    return fm_voice(dur, f, 1.0, 1.0, index=1.3, feedback=0.35,
                    env_m=(0.02, 0.12, 0.5, 0.06), env_c=(0.012, 0.15, 0.7, 0.06),
                    wave_c="half", amp=amp)


def clarinet(dur, f, amp=1.0):
    n = secs(dur)
    ff = as_array(f, n) * vibrato(n, 5.0, 0.004, delay=0.15)
    return fm_voice(dur, ff, 3.0, 1.0, index=0.55,
                    env_m=(0.01, 0.2, 0.7, 0.05), env_c=(0.015, 0.2, 0.85, 0.05),
                    wave_m="sine", wave_c="half", amp=amp)


def marimba(dur, f, amp=1.0):
    return fm_voice(dur, f, 4.0, 1.0, index=0.9,
                    env_m=(0.001, 0.04, 0.0, 0.03), env_c=(0.001, 0.25, 0.0, 0.1),
                    amp=amp)


def cymbal(dur, amp=1.0):
    n = secs(dur)
    return noise(dur, lo=5000, hi=11000, env=lambda k: perc_env(k, 0.002, dur / 3)) * amp


# ---------------------------------------------------------------- the effects


def sfx_zombiehit():
    d = 0.2
    m = Mix(d)
    n = secs(d)
    f = sweep(n, [(0, 520), (0.03, 260), (d, 170)])
    bonk = fm_voice(d, f, 3.47, 1.0, index=2.2, feedback=0.3,
                    env_m=(0.001, 0.025, 0.0, 0.02), env_c=(0.001, 0.07, 0.0, 0.04))
    m.add(bonk)
    m.add(noise(0.05, lo=900, hi=4500, env=lambda k: perc_env(k, 0.0005, 0.012)), gain=0.6)
    # low body "thwack"
    body = fm_voice(0.12, sweep(secs(0.12), [(0, 160), (0.12, 70)]), 1.0, 1.0, index=0.4,
                    env_m=(0.001, 0.05, 0, 0.02), env_c=(0.001, 0.05, 0.0, 0.03))
    m.add(body, gain=0.7)
    return m.buf


def sfx_zombiedead():
    d = 0.62
    m = Mix(d)
    n = secs(0.5)
    f = sweep(n, [(0, 640), (0.08, 560), (0.5, 70)])
    f = f * vibrato(n, 11.0, 0.03)
    bw = fm_voice(0.5, f, 1.0, 1.0, index=1.8, feedback=0.5, wave_c="half",
                  env_m=(0.01, 0.35, 0.3, 0.08), env_c=(0.01, 0.3, 0.8, 0.08))
    m.add(bw)
    poof = noise(0.27, lo=200, hi=1600,
                 env=lambda k: perc_env(k, 0.02, 0.07))
    m.add(poof, at=0.34, gain=0.75)
    # tiny "pop" on the poof
    m.add(marimba(0.15, 880, 0.5), at=0.34)
    return m.buf


def sfx_weaponlaunched():
    d = 0.26
    m = Mix(d)
    n = secs(d)
    f = sweep(n, [(0, 480), (0.2, 1350), (d, 1450)]) * vibrato(n, 18, 0.01)
    whistle = fm_voice(d, f, 1.0, 1.0, index=0.25,
                       env_m=(0.01, 0.1, 0.8, 0.05), env_c=(0.012, 0.12, 0.75, 0.06))
    m.add(whistle, gain=0.8)
    t = np.arange(n) / SR
    swell = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    m.add(noise(d, lo=1200, hi=5000, env=swell), gain=0.45)
    return m.buf


def sfx_spawned_zombie():
    d = 0.82
    m = Mix(d)
    n = secs(d)
    f = sweep(n, [(0, 98), (0.25, 118), (d, 82)]) * vibrato(n, 4.5, 0.025, delay=0.1)
    e = (0.12, 0.3, 0.85, 0.2)
    v1 = fm_voice(d, f, 1.0, 2.0, index=1.6, feedback=0.75, wave_c="half",
                  env_m=(0.15, 0.3, 0.6, 0.2), env_c=e)
    v2 = fm_voice(d, f * 1.012, 1.0, 1.0, index=1.0, feedback=0.4,
                  env_m=(0.1, 0.3, 0.7, 0.2), env_c=e)
    m.add(v1, gain=0.6)
    m.add(v2, gain=0.6)
    m.add(noise(d, lo=300, hi=1200, env=adsr(n, 0.1, 0.3, 0.6, 0.2)), gain=0.12)
    return m.buf


def sfx_spawned_zombiess():
    d = 1.0
    n = secs(d)
    f = sweep(n, [(0, 420), (0.3, 720), (0.65, 600), (d, 470)])
    f = f * vibrato(n, 6.2, 0.035)
    t = np.arange(n) / SR
    trem = 0.8 + 0.2 * np.sin(2 * np.pi * 3.1 * t)
    v = fm_voice(d, f, 2.0, 1.0, index=0.22,
                 env_m=(0.2, 0.3, 0.8, 0.25), env_c=(0.12, 0.3, 0.9, 0.25))
    v2 = fm_voice(d, f * 0.5, 1.0, 1.0, index=0.1,
                  env_m=(0.2, 0.3, 0.8, 0.25), env_c=(0.2, 0.3, 0.9, 0.25))
    return (v + 0.25 * v2) * trem


def sfx_spawned_snowman():
    d = 0.72
    m = Mix(d)
    for at, nm, ln in ((0.0, "D2", 0.17), (0.24, "G#1", 0.46)):
        f = note(nm)
        m.add(brass(ln, f, 1.0, fb=0.6), at=at)
        m.add(brass(ln, f * 2, 0.45, fb=0.4), at=at)
        m.add(tuba(ln, f * 0.5, 0.6), at=at)
        m.add(noise(0.06, lo=80, hi=600, env=lambda k: perc_env(k, 0.001, 0.02)), at=at, gain=0.4)
    return m.buf


def sfx_spawned_sheep():
    d = 0.62
    n = secs(d)
    f = sweep(n, [(0, 330), (0.08, 370), (d, 300)])
    t = np.arange(n) / SR
    f = f * (1 + 0.05 * np.sin(2 * np.pi * 8.5 * t))
    trem = 0.7 + 0.3 * np.sin(2 * np.pi * 8.5 * t + 0.5)
    v = fm_voice(d, f, 1.0, 2.0, index=1.4, feedback=0.4, wave_m="sine", wave_c="half",
                 env_m=(0.03, 0.2, 0.6, 0.15), env_c=(0.03, 0.2, 0.85, 0.15))
    v2 = fm_voice(d, f, 1.0, 1.0, index=0.8,
                  env_m=(0.03, 0.2, 0.6, 0.15), env_c=(0.03, 0.2, 0.85, 0.15))
    return (v + 0.6 * v2) * trem


def sfx_spawned_dinosaur():
    d = 1.22
    m = Mix(d)
    n = secs(d)
    t = np.arange(n) / SR
    base = sweep(n, [(0, 52), (0.25, 78), (0.7, 70), (d, 42)])
    rumble = 1 + 0.03 * np.sin(2 * np.pi * 27 * t)
    e = (0.08, 0.4, 0.8, 0.3)
    v1 = fm_voice(d, base * rumble, 1.0, 1.0, index=2.6, feedback=0.95,
                  env_m=(0.1, 0.4, 0.7, 0.3), env_c=e)
    v2 = fm_voice(d, base * 1.03 * rumble, 1.5, 1.0, index=2.0, feedback=0.8, wave_c="half",
                  env_m=(0.1, 0.4, 0.7, 0.3), env_c=e)
    v3 = fm_voice(d, base * 2.01, 1.0, 1.0, index=1.5, feedback=0.6,
                  env_m=(0.1, 0.4, 0.7, 0.3), env_c=e)
    m.add(v1, gain=0.55)
    m.add(v2, gain=0.5)
    m.add(v3, gain=0.25)
    growl = noise(d, lo=120, hi=1400, env=adsr(n, 0.06, 0.4, 0.7, 0.35))
    growl *= 0.75 + 0.25 * np.sin(2 * np.pi * 31 * t)
    m.add(growl, gain=0.4)
    return m.buf


def sfx_gameover():
    # sad-comic descending brass: original contour, ends on a wobbly "waaah"
    d = 3.0
    m = Mix(d)
    seq = [("E4", 0.00, 0.30), ("C4", 0.36, 0.30), ("Eb4", 0.72, 0.30),
           ("B3", 1.08, 0.30)]
    for nm, at, ln in seq:
        f = note(nm)
        n = secs(ln)
        fs = sweep(n, [(0, f * 1.02), (0.05, f), (ln, f * 0.985)])
        m.add(brass(ln, fs, 0.9), at=at)
    # the long final note slides down a little and wah-wobbles
    ln = 1.25
    n = secs(ln)
    f0 = note("Bb3")
    fs = sweep(n, [(0, f0), (0.8, f0), (ln, f0 * 0.94)])
    m.add(brass(ln, fs, 1.0, wah=0.6, vib=0.012), at=1.44)
    # tuba underneath and a final "plonk plonk"
    for nm, at, ln2 in (("C2", 0.0, 0.3), ("Ab1", 0.72, 0.3), ("G1", 1.44, 1.0)):
        m.add(tuba(ln2, note(nm), 0.55), at=at)
    m.add(tuba(0.18, note("Eb2"), 0.7), at=2.62)
    m.add(tuba(0.22, note("Bb1"), 0.8), at=2.76)
    m.add(marimba(0.2, note("Bb4"), 0.25), at=2.76)
    return m.buf


def sfx_levelachieved():
    d = 2.5
    m = Mix(d)
    beat = 0.14
    mel = [("C5", 0, 1), ("F5", 1, 1), ("A5", 2, 1), ("G5", 3, 1), ("A5", 4, 1),
           ("C6", 5, 2), ("Bb5", 7, 1), ("G5", 8, 1), ("A5", 9, 1), ("F5", 10, 6)]
    for nm, st, ln in mel:
        dur = ln * beat * 0.92 if ln < 6 else 1.05
        m.add(clarinet(dur, note(nm), 0.7), at=st * beat)
        m.add(brass(dur, note(nm) / 2, 0.45, vib=0.006 if ln >= 6 else 0.0), at=st * beat)
    # oom-pah tuba
    for nm, st in (("F2", 0), ("C2", 2), ("F2", 4), ("C2", 6), ("Bb1", 7), ("C2", 8), ("F1", 10)):
        ln = 0.9 if st == 10 else beat * 1.2
        m.add(tuba(ln, note(nm), 0.8), at=st * beat)
    # harpsichord-ish marimba arpeggio flourish under the final chord
    for i, nm in enumerate(("F4", "A4", "C5", "F5", "A5", "C6")):
        m.add(marimba(0.35, note(nm), 0.35), at=10 * beat + i * 0.045)
    # sustained final chord
    for nm in ("A3", "C4", "F4"):
        m.add(brass(1.05, note(nm), 0.28), at=10 * beat)
    m.add(cymbal(0.9, 0.18), at=10 * beat)
    # little snare pick-ups
    for st in (5, 7, 8, 9):
        m.add(noise(0.08, lo=1200, hi=7000, env=lambda k: perc_env(k, 0.001, 0.025)),
              at=st * beat, gain=0.15)
    return m.buf


def sfx_iceblockdown():
    d = 0.52
    m = Mix(d)
    # crack
    m.add(noise(0.09, lo=1800, hi=9500, env=lambda k: perc_env(k, 0.0005, 0.018)), gain=1.0)
    m.add(noise(0.05, lo=300, hi=2000, env=lambda k: perc_env(k, 0.0005, 0.01)), at=0.012, gain=0.6)
    # glassy tinkles (inharmonic FM bells)
    rng = np.random.default_rng(7)
    times = np.sort(rng.uniform(0.02, 0.3, 9))
    for at in times:
        f = rng.uniform(1700, 3600)
        ln = 0.18
        bell = fm_voice(ln, f, 3.53, 1.0, index=0.7,
                        env_m=(0.001, 0.06, 0.0, 0.05), env_c=(0.001, 0.12, 0.0, 0.06))
        m.add(bell, at=at, gain=rng.uniform(0.25, 0.45))
    m.add(noise(0.35, lo=4000, hi=10000, env=lambda k: perc_env(k, 0.01, 0.07)), at=0.04, gain=0.2)
    return m.buf


def sfx_playerkilled():
    d = 0.82
    m = Mix(d)
    # "oof": short vocal-ish FM formant blip
    n = secs(0.14)
    f = sweep(n, [(0, 230), (0.14, 165)])
    oof = fm_voice(0.14, f, 1.0, 3.0, index=1.2, feedback=0.3, wave_c="half",
                   env_m=(0.005, 0.08, 0.4, 0.04), env_c=(0.004, 0.06, 0.6, 0.04))
    oof2 = fm_voice(0.14, f, 1.0, 1.0, index=0.9,
                    env_m=(0.005, 0.08, 0.4, 0.04), env_c=(0.004, 0.06, 0.6, 0.04))
    m.add(oof, gain=0.6)
    m.add(oof2, gain=0.7)
    # slide-whistle fall
    ln = 0.62
    n = secs(ln)
    f = sweep(n, [(0, 980), (ln, 150)]) * vibrato(n, 9, 0.02)
    slide = fm_voice(ln, f, 1.0, 1.0, index=0.3,
                     env_m=(0.02, 0.2, 0.8, 0.1), env_c=(0.02, 0.3, 0.8, 0.12))
    m.add(slide, at=0.17, gain=0.75)
    return m.buf


def sfx_bgowl():
    d = 1.2
    m = Mix(d)
    hoots = [(0.0, 0.34, 1.0), (0.48, 0.16, 0.8), (0.68, 0.36, 0.9)]
    for at, ln, g in hoots:
        n = secs(ln)
        f0 = 392.0
        f = sweep(n, [(0, f0 * 1.04), (0.06, f0), (ln, f0 * 0.93)]) * vibrato(n, 5.0, 0.006)
        flute = fm_voice(ln, f, 1.0, 1.0, index=0.18,
                         env_m=(0.04, 0.2, 0.7, 0.1), env_c=(0.035, 0.2, 0.75, 0.12))
        m.add(flute, at=at, gain=g)
        breath = noise(ln, lo=500, hi=2500, env=adsr(n, 0.03, 0.1, 0.4, 0.1))
        m.add(breath, at=at, gain=0.05 * g)
    return m.buf


EFFECTS = [
    ("zombiehit", sfx_zombiehit, -3.0),
    ("zombiedead", sfx_zombiedead, -3.0),
    ("weaponlaunched", sfx_weaponlaunched, -3.0),
    ("spawned_zombie", sfx_spawned_zombie, -3.0),
    ("spawned_zombiess", sfx_spawned_zombiess, -3.0),
    ("spawned_snowman", sfx_spawned_snowman, -3.0),
    ("spawned_sheep", sfx_spawned_sheep, -3.0),
    ("spawned_dinosaur", sfx_spawned_dinosaur, -3.0),
    ("gameover", sfx_gameover, -3.0),
    ("levelachieved", sfx_levelachieved, -3.0),
    ("iceblockdown", sfx_iceblockdown, -3.0),
    ("playerkilled", sfx_playerkilled, -3.0),
    ("bgowl", sfx_bgowl, -12.0),
]

FADES = {"bgowl": 0.12, "gameover": 0.15, "levelachieved": 0.2,
         "spawned_dinosaur": 0.12, "spawned_zombiess": 0.1}


def mp3_peak_db(mp3_path):
    """Measure the decoded peak of an MP3 with ffmpeg's volumedetect."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", mp3_path, "-af", "volumedetect",
                        "-f", "null", "-"], capture_output=True, text=True)
    for line in r.stderr.splitlines():
        if "max_volume:" in line:
            return float(line.split("max_volume:")[1].split("dB")[0])
    return None


def main():
    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not found on PATH")
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    keep_wav = None
    if "--wav" in sys.argv:
        keep_wav = sys.argv[sys.argv.index("--wav") + 1]
        os.makedirs(keep_wav, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="adlib_sfx_")
    try:
        for name, fn, peak_db in EFFECTS:
            # peak target slightly under spec to leave room for MP3 overshoot
            x = sound_blaster(fn(), peak_db, fade_out=FADES.get(name, 0.03))
            wav_path = os.path.join(keep_wav or tmp, name + ".wav")
            out = os.path.join(repo_root, name + ".mp3")
            # encode, measure the decoded MP3 peak, correct the gain, re-encode
            measured = None
            for _ in range(3):
                write_wav(wav_path, x)
                encode_mp3(wav_path, out)
                measured = mp3_peak_db(out)
                if measured is None or abs(measured - peak_db) <= 0.25:
                    break
                x = x * (10 ** ((peak_db - measured) / 20.0))
            print("%-18s %.2fs  peak %s dBFS -> %s" % (name, len(x) / SR, measured, out))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
