"""Jugadores y zombis humanoides en estilo cartoon LucasArts (cabezon, nariz grande,
ojos saltones, piernas flacas y zapatones)."""
from pixart import Sprite, P, C, hexc, mix

# Poses: desplazamientos de esqueleto ------------------------------------
# lf / rf: (dx, dy) de pie izquierdo / derecho;  bob: rebote del cuerpo
# la / ra: punta de la mano relativa al hombro
WALK = [
    dict(bob=0, lf=(-1, 0), rf=(1, -2), la=(1, 5), ra=(-2, 4)),
    dict(bob=-1, lf=(0, 0), rf=(0, -1), la=(-1, 5), ra=(1, 5)),
    dict(bob=0, lf=(-1, -2), rf=(1, 0), la=(-2, 4), ra=(1, 5)),
    dict(bob=-1, lf=(0, -1), rf=(0, 0), la=(-1, 5), ra=(1, 5)),
]
IDLE = dict(bob=0, lf=(0, 0), rf=(0, 0), la=(-2, 5), ra=(2, 5))


# ---------------------------------------------------------------------------
# JUGADORES (24x32)
# ---------------------------------------------------------------------------
PLAYERS = {
    'player':  dict(name='Aiden', coat='blue', pants='brown', shoes='red', scarf='red',
                    hat='beanie', hatc='blue', pom='white', hair='hair_br', nose=2.2),
    'player2': dict(name='Carlo', coat='red', pants='navy', shoes='black', scarf='yellow',
                    hat='beanie', hatc='red', pom='yellow', hair='hair_bk', nose=2.6, brows=True),
    'player3': dict(name='Blair', coat='lime', pants='purple', shoes='brown', scarf='orange',
                    hat='earmuffs', hatc='purple', hair='hair_bl', pigtails=True, nose=1.7),
    'player4': dict(name='Red Scout', coat='orange', pants='brown', shoes='black', scarf='green',
                    hat='cap', hatc='red', hair='hair_rd', nose=2.0, freckles=True),
    'player5': dict(name='Teal Ranger', coat='teal', pants='brown', shoes='brown', scarf='yellow',
                    hat='ranger', hatc='wood', hair='hair_bk', nose=2.4, skin='skin2'),
    'player6': dict(name='Purple Knight', coat='purple', pants='grey', shoes='grey', scarf='gold',
                    hat='helmet', hatc='steel', plume='pink', hair=None, nose=2.0),
    'player7': dict(name='Gold Captain', coat='gold', pants='navy', shoes='black', scarf='red',
                    hat='tricorn', hatc='black', trim='yellow', hair='hair_br', nose=2.8, beard=True),
    'player8': dict(name='Lime Sniper', coat='green', pants='moss', shoes='black', scarf='lime',
                    hat='hood', hatc='lime', goggles=True, hair=None, nose=1.9, skin='skin2'),
    'player9': dict(name='Pink Mage', coat='pink', pants='purple', shoes='purple', scarf='teal',
                    hat='wizard', hatc='pink', stars='yellow', hair='hair_bl', nose=1.8, long_hair=True),
}


def _hat(s, cfg, hx, hy, back=False):
    """Sombrero sobre la cabeza centrada en (hx, hy) (centro de la cabeza)."""
    t = cfg.get('hat')
    hc = P[cfg.get('hatc', 'blue')]
    top = hy - 5.5
    if t == 'beanie':
        h = s.part(hc)
        s.ell(h, hx, top + 2.5, 6.5, 4)
        s.rect(h, hx - 6.5, top + 2.5, hx + 6.5, top + 4.5)
        band = s.part([mix(c, (0, 0, 0), 0.25) for c in hc])
        s.rect(band, hx - 7, top + 4, hx + 7, top + 5.5)
        pm = s.part(P[cfg.get('pom', 'white')])
        s.ell(pm, hx + 2, top - 0.5, 2, 2)
    elif t == 'cap':
        h = s.part(hc)
        s.ell(h, hx, top + 3, 6.5, 3.5)
        s.rect(h, hx - 6.5, top + 3, hx + 6.5, top + 5)
        v = s.part([mix(c, (0, 0, 0), 0.3) for c in hc])
        s.poly(v, [(hx - 1, top + 5), (hx + 9, top + 5), (hx + 8, top + 7), (hx - 1, top + 6.5)])
        s.d_px(P['yellow'][3], hx - 1, top + 3)
        s.d_px(P['yellow'][2], hx, top + 3)
    elif t == 'earmuffs':
        band = s.part(hc)
        s.line(band, [(hx - 6, hy - 1), (hx - 4, top + 0.5), (hx + 4, top + 0.5), (hx + 6, hy - 1)], 2)
        m1 = s.part(P['pink'])
        s.ell(m1, hx - 6.5, hy - 0.5, 2, 2.5)
        m2 = s.part(P['pink'])
        s.ell(m2, hx + 6.5, hy - 0.5, 2, 2.5)
    elif t == 'ranger':
        h = s.part(hc)
        s.poly(h, [(hx - 4, top + 3), (hx - 3, top - 1), (hx + 3, top - 1), (hx + 4, top + 3)])
        b = s.part([mix(c, (0, 0, 0), 0.2) for c in hc])
        s.ell(b, hx, top + 3.8, 10, 1.8)
        band = s.part(P['red'], line=False)
        s.rect(band, hx - 4, top + 1.5, hx + 4, top + 2.5)
    elif t == 'helmet':
        h = s.part(hc, gain=2.2)
        s.ell(h, hx, top + 4, 7, 5.5)
        s.rect(h, hx - 7, top + 4, hx + 7, hy + 1)
        s.ell(0, hx, hy + 2.5, 5.5, 4.5)  # hueco para la cara
        pl = s.part(P[cfg.get('plume', 'pink')])
        s.poly(pl, [(hx - 1, top - 1), (hx + 1, top - 3), (hx + 7, top - 2), (hx + 5, top + 1), (hx + 1, top + 1)])
    elif t == 'tricorn':
        h = s.part(hc)
        s.poly(h, [(hx - 10, top + 4), (hx - 4, top - 1), (hx, top + 1), (hx + 4, top - 1), (hx + 10, top + 4), (hx, top + 5)])
        tr = cfg.get('trim', 'yellow')
        s.d_line(P[tr][2], [(hx - 9, top + 4), (hx, top + 5), (hx + 9, top + 4)])
        s.d_px(P['white'][3], hx, top + 2)
    elif t == 'hood':
        h = s.part(hc)
        s.ell(h, hx, hy - 1, 8, 7.5)
        s.rect(h, hx - 8, hy, hx + 8, hy + 6)
        s.ell(0, hx, hy + 1.5, 5.5, 5)
    elif t == 'wizard':
        h = s.part(hc)
        s.poly(h, [(hx - 8, top + 4), (hx + 8, top + 4), (hx + 3, top - 4), (hx + 6, top - 6), (hx - 1, top - 5)])
        s.poly(h, [(hx - 8, top + 4), (hx + 8, top + 4), (hx + 2, top - 3)])
        st = P[cfg.get('stars', 'yellow')][3]
        s.d_px(st, hx - 2, top + 1)
        s.d_px(st, hx + 2, top - 1)
        s.d_px(st, hx + 4, top + 2)


def _face(s, cfg, hx, hy, kind='player', dead=False, look=0):
    skin = P[cfg.get('skin', 'skin')]
    head = s.part(skin, light=0.12)
    s.ell(head, hx, hy, 6.5, 5.8)
    # pelo
    hair = cfg.get('hair')
    if hair and not cfg.get('hat') in ('hood', 'helmet'):
        hp = s.part(P[hair])
        if cfg.get('long_hair'):
            s.rect(hp, hx - 7, hy - 3, hx - 5, hy + 6)
            s.rect(hp, hx + 5, hy - 3, hx + 7, hy + 6)
        s.poly(hp, [(hx - 6, hy - 2), (hx - 4, hy - 5), (hx + 1, hy - 6), (hx + 6, hy - 3), (hx + 3, hy - 3), (hx, hy - 2), (hx - 3, hy - 3)])
        if cfg.get('pigtails'):
            s.ell(hp, hx - 8, hy + 1, 1.8, 2.5)
            s.ell(hp, hx + 8, hy + 1, 1.8, 2.5)
    _hat(s, cfg, hx, hy)
    # ojos saltones
    ex = (hx - 2.5, hx + 2.5)
    ey = hy - 0.5
    if cfg.get('goggles'):
        g = s.part(P['steel'])
        s.ell(g, ex[0], ey, 2.3, 2.3)
        s.ell(g, ex[1], ey, 2.3, 2.3)
    for x in ex:
        if dead:
            s.d_line(C['pupil'], [(x - 1, ey - 1), (x + 1, ey + 1)])
            s.d_line(C['pupil'], [(x - 1, ey + 1), (x + 1, ey - 1)])
        else:
            s.d_ell(P['eye'][2], x, ey, 1.6, 2.1)
            s.d_px(P['eye'][3], x - 1, ey - 1)
            s.d_rect(C['pupil'], x + look, ey, x + look, ey + 1)
    if cfg.get('brows'):
        s.d_line(C['pupil'], [(ex[0] - 2, ey - 3), (ex[0] + 1, ey - 2)])
        s.d_line(C['pupil'], [(ex[1] - 1, ey - 2), (ex[1] + 2, ey - 3)])
    # narizota (DOTT)
    nr = cfg.get('nose', 2.0)
    nose = s.part(skin, light=0.18)
    s.ell(nose, hx + 0.8, hy + 2.6, nr, nr * 0.75)
    if cfg.get('freckles'):
        s.d_px(skin[0], hx - 4, hy + 2)
        s.d_px(skin[0], hx + 4, hy + 2)
    # boca
    if dead:
        s.d_line(C['mouth'], [(hx - 2, hy + 5), (hx + 2, hy + 5)])
    elif cfg.get('beard'):
        b = s.part(P['hair_br'])
        s.poly(b, [(hx - 5, hy + 2), (hx + 5, hy + 2), (hx + 3, hy + 7), (hx - 3, hy + 7)])
        s.ell(nose, hx + 0.8, hy + 2.6, nr, nr * 0.75)
        s.d_line(C['mouth'], [(hx - 1, hy + 4), (hx + 2, hy + 4)])
    else:
        s.d_line(C['mouth'], [(hx - 2, hy + 4.5), (hx, hy + 5), (hx + 2, hy + 4.5)])


def _body(s, cfg, cx, top, pose, legs_len=5):
    coat = P[cfg['coat']]
    pants = P[cfg['pants']]
    shoes = P[cfg['shoes']]
    bob = pose.get('bob', 0)
    ty = top + bob
    hip = ty + 8
    lf, rf = pose['lf'], pose['rf']
    # piernas
    leg = s.part(pants)
    fy = hip + legs_len
    s.line(leg, [(cx - 2, hip), (cx - 2 + lf[0], fy + lf[1] - bob)], 2)
    leg2 = s.part(pants)
    s.line(leg2, [(cx + 2, hip), (cx + 2 + rf[0], fy + rf[1] - bob)], 2)
    # zapatones
    sh = s.part(shoes)
    s.ell(sh, cx - 3 + lf[0], fy + 1.5 + lf[1] - bob, 2.6, 1.5)
    sh2 = s.part(shoes)
    s.ell(sh2, cx + 3 + rf[0], fy + 1.5 + rf[1] - bob, 2.6, 1.5)
    # abrigo (trapecio)
    if cfg.get('hat') == 'wizard':
        c = s.part(coat)
        s.poly(c, [(cx - 4, ty), (cx + 4, ty), (cx + 6, hip + 2), (cx - 6, hip + 2)])
    else:
        c = s.part(coat)
        s.poly(c, [(cx - 4, ty), (cx + 4, ty), (cx + 5, hip), (cx - 5, hip)])
        s.d_line(mix(coat[0], (0, 0, 0), 0.3), [(cx, ty + 2), (cx, hip - 1)])
        s.d_px(P['yellow'][2], cx - 1, ty + 4)
        s.d_px(P['yellow'][2], cx - 1, ty + 6)
    # brazos
    sk = P[cfg.get('skin', 'skin')]
    for side, (dx, dy) in ((-1, pose['la']), (1, pose['ra'])):
        sx, sy = cx + side * 4, ty + 1
        a = s.part(coat)
        ex, ey = sx + side * 1 + dx, sy + dy
        s.line(a, [(sx, sy), (ex, ey)], 2)
        mit = s.part(P[cfg['scarf']])
        s.ell(mit, ex, ey + 0.5, 1.4, 1.4)
    # bufanda
    sc = s.part(P[cfg['scarf']])
    s.rect(sc, cx - 4, ty - 1, cx + 4, ty + 1)
    s.poly(sc, [(cx + 2, ty), (cx + 5, ty + 4), (cx + 3, ty + 5), (cx + 1, ty + 1)])
    return ty


def player_sprite(cfg, state, frame=0):
    s = Sprite(24, 32)
    cx = 12
    if state == 'dead':
        # tirado en el suelo con aureola
        coat = P[cfg['coat']]
        b = s.part(P[cfg['pants']])
        s.line(b, [(13, 27), (21, 27)], 3)
        sh = s.part(P[cfg['shoes']])
        s.ell(sh, 21.5, 25.5, 1.5, 2.5)
        c = s.part(coat)
        s.ell(c, 11, 26.5, 5, 3.5)
        _face(s, dict(cfg, hat=None if cfg.get('hat') in ('wizard', 'tricorn', 'ranger') else cfg.get('hat')), 5.5, 24, dead=True)
        halo = s.part(P['yellow'], line=False, flat=True)
        s.ell(halo, 6, 13.5, 4.5, 1.6)
        s.ell(0, 6, 13.5, 2.8, 0.6)
        return s.render()
    if state == 'idle':
        pose = IDLE
    elif state == 'walk':
        pose = WALK[frame]
    elif state == 'gather':
        pose = dict(bob=3, lf=(-2, 0), rf=(2, 0), la=(2, 7), ra=(-2, 7))
    elif state == 'build':
        pose = dict(bob=0, lf=(-1, 0), rf=(1, 0), la=(-1, 5), ra=(1, -7))
    ty = _body(s, cfg, cx, 16 if state != 'gather' else 15, pose, legs_len=5 if state != 'gather' else 3)
    hy = ty - 6
    _face(s, cfg, cx, hy, look=(1 if frame % 2 else 0))
    if state == 'gather':
        sb = s.part(P['snow'])
        s.ell(sb, cx, ty + 10, 3.5, 2.5)
    if state == 'build':
        hnd = s.part(P['wood'])
        hx, hy2 = cx + 5 + 1, ty + 1 - 7
        s.line(hnd, [(hx, hy2 + 1), (hx + 3, hy2 - 4)], 1)
        hd = s.part(P['steel'])
        s.rect(hd, hx + 1, hy2 - 7, hx + 6, hy2 - 4)
        s.d_px(P['yellow'][3], hx - 3, hy2 - 3)
        s.d_px(P['yellow'][3], hx + 8, hy2 - 1)
    return s.render()


# ---------------------------------------------------------------------------
# ZOMBIS (24x30)
# ---------------------------------------------------------------------------
ZOMBIES = {
    'zombie':      dict(skin='zgreen', shirt='steel', pants='brown', hair='hair_bk', extra=None),
    'SnowZombie1': dict(skin='zice', shirt='navy', pants='grey', hair=None, scarf='red', frost=True),
    'SnowZombie2': dict(skin='zpurple', shirt='brown', pants='black', hair=None, helmet='ice', frost=True, brute=True),
    'SnowZombie3': dict(skin='zteal', shirt='grey', pants='navy', hair=None, beanie='purple', frost=True),
    'SnowZombie4': dict(skin='zgrey', shirt='teal', pants='brown', hair='hair_rd', muffs='yellow', frost=True),
    'SnowZombie5': dict(skin='zlav', shirt='purple', pants='moss', hair=None, hood='green', frost=True),
}

ZWALK = [
    dict(bob=0, lf=(-2, 0), rf=(1, -2)),
    dict(bob=-1, lf=(-1, 0), rf=(0, -1)),
    dict(bob=0, lf=(0, -2), rf=(-1, 0)),
    dict(bob=-1, lf=(-1, -1), rf=(0, 0)),
]


def zombie_sprite(cfg, state, frame=0):
    s = Sprite(24, 30)
    skin = P[cfg['skin']]
    shirt = P[cfg['shirt']]
    pants = P[cfg['pants']]
    if state == 'dead':
        g = [mix(c, (90, 90, 120), 0.45) for c in skin]
        b = s.part([mix(c, (90, 90, 120), 0.45) for c in shirt])
        s.ell(b, 13, 25.5, 7, 3)
        h = s.part(g)
        s.ell(h, 6, 23, 5, 4.5)
        s.d_line(C['pupil'], [(4, 21), (6, 23)])
        s.d_line(C['pupil'], [(4, 23), (6, 21)])
        s.d_line(C['mouth'], [(4, 26), (8, 25)])
        bone = s.part(P['tooth'])
        s.line(bone, [(17, 22), (21, 20)], 1)
        s.ell(bone, 21.5, 19.5, 1, 1)
        # alma saliendo
        sp = s.part(P['white'], line=False, light=0.3)
        s.ell(sp, 13, 12, 3.5, 4)
        s.poly(sp, [(10, 13), (16, 13), (14, 19), (12, 17)])
        s.d_px(C['pupil'], 12, 11)
        s.d_px(C['pupil'], 14, 11)
        return s.render()
    pose = dict(bob=0, lf=(0, 0), rf=(0, 0)) if state == 'idle' else ZWALK[frame]
    bob = pose['bob']
    cx = 11
    brute = cfg.get('brute')
    ty = 15 + bob
    hip = ty + 8
    # piernas arrastradas
    for i, (side, (dx, dy)) in enumerate(((-1, pose['lf']), (1, pose['rf']))):
        lp = s.part(pants)
        fy = 26 + dy
        s.line(lp, [(cx + side * 2, hip), (cx + side * 2 + dx, fy)], 2)
        ft = s.part(skin if i == 0 else P['black'])
        s.ell(ft, cx + side * 2 + dx + 1, fy + 1.3, 2.4, 1.3)
    # torso encorvado
    t = s.part(shirt)
    w = 6 if brute else 5
    s.poly(t, [(cx - w + 1, ty), (cx + w, ty - 1), (cx + w, hip), (cx - w, hip)])
    # camisa rota
    s.d_poly(skin[1], [(cx - 2, hip - 1), (cx, hip - 4), (cx + 2, hip - 1)])
    s.d_px(skin[2], cx + 3, ty + 2)
    # brazos estirados hacia adelante (clasico)
    reach = [0, 1, 0, -1][frame] if state == 'walk' else 0
    a1 = s.part(shirt)
    s.line(a1, [(cx + 2, ty + 1), (cx + 9, ty + 1 + reach)], 2)
    h1 = s.part(skin)
    s.ell(h1, cx + 11, ty + 1 + reach, 1.6, 1.3)
    a2 = s.part([mix(c, (0, 0, 0), 0.2) for c in shirt])
    s.line(a2, [(cx - 3, ty + 2), (cx + 8, ty + 4 - reach)], 2)
    h2 = s.part(skin)
    s.ell(h2, cx + 10, ty + 4 - reach, 1.6, 1.3)
    # cabeza ladeada
    hx, hy = cx + 1, ty - 7
    head = s.part(skin)
    s.ell(head, hx, hy, 6.5 if not brute else 7, 6)
    s.poly(head, [(hx - 4, hy + 3), (hx + 4, hy + 3), (hx + 3, hy + 7), (hx - 2, hy + 7)])
    # mandibula caida con dientes
    s.d_poly(C['mouth'], [(hx - 2, hy + 3), (hx + 3, hy + 3), (hx + 2, hy + 6), (hx - 1, hy + 6)])
    s.d_px(P['tooth'][2], hx - 1, hy + 3)
    s.d_px(P['tooth'][2], hx + 1, hy + 3)
    s.d_px(P['tooth'][2], hx, hy + 6)
    # ojo grande y ojo chico
    s.d_ell(P['yellow'][3], hx - 2.5, hy - 1, 2, 2.2)
    s.d_px(C['red_eye'], hx - 2, hy - 1)
    s.d_px(C['pupil'], hx - 2, hy)
    s.d_ell(P['yellow'][2], hx + 3, hy - 0.5, 1, 1)
    s.d_px(C['pupil'], hx + 3, hy - 0.5)
    s.d_line(skin[0], [(hx - 5, hy - 4), (hx - 1, hy - 3)])
    # costura
    s.d_line(skin[0], [(hx + 2, hy - 5), (hx + 5, hy - 2)])
    s.d_px(skin[3], hx + 3, hy - 5)
    s.d_px(skin[3], hx + 5, hy - 3)
    # accesorios
    if cfg.get('hair'):
        hp = s.part(P[cfg['hair']])
        s.poly(hp, [(hx - 6, hy - 2), (hx - 5, hy - 6), (hx - 2, hy - 5), (hx, hy - 7), (hx + 2, hy - 5), (hx + 5, hy - 6), (hx + 6, hy - 2), (hx + 3, hy - 4), (hx - 3, hy - 4)])
    if cfg.get('helmet'):
        hm = s.part(P['ice'], gain=2.4)
        s.ell(hm, hx, hy - 3.5, 7.5, 4)
        s.rect(0, hx - 8, hy - 1, hx + 8, hy + 1) if False else None
        s.d_px(P['ice'][3], hx - 3, hy - 5)
        s.d_px(P['ice'][3], hx - 2, hy - 6)
    if cfg.get('beanie'):
        bn = s.part(P[cfg['beanie']])
        s.ell(bn, hx, hy - 4, 6.5, 3.5)
        s.rect(bn, hx - 6.5, hy - 4, hx + 6.5, hy - 2.5)
        s.d_poly(skin[1], [(hx + 2, hy - 7), (hx + 4, hy - 4), (hx + 1, hy - 4)])  # agujero
    if cfg.get('muffs'):
        m = s.part(P[cfg['muffs']])
        s.ell(m, hx - 6.5, hy, 1.8, 2.3)
        s.ell(m, hx + 6.5, hy, 1.8, 2.3)
    if cfg.get('hood'):
        hd = s.part(P[cfg['hood']])
        s.ell(hd, hx, hy - 3, 7.5, 4.5)
        s.rect(hd, hx - 7.5, hy - 3, hx - 5.5, hy + 4)
        s.rect(hd, hx + 5.5, hy - 3, hx + 7.5, hy + 4)
    if cfg.get('scarf'):
        sc = s.part(P[cfg['scarf']])
        s.rect(sc, cx - 4, ty - 1, cx + 5, ty + 1)
        s.poly(sc, [(cx - 4, ty), (cx - 7, ty + 5), (cx - 5, ty + 6), (cx - 2, ty + 1)])
    if cfg.get('frost'):
        # escarcha y carambanos
        s.d_line(P['snow'][3], [(hx - 4, hy - 5), (hx + 2, hy - 6)])
        s.d_px(P['ice'][2], cx + 4, ty + 2)
        s.d_px(P['ice'][3], cx + 4, ty + 3)
        s.d_px(P['ice'][2], cx - 3, hip)
        s.d_px(P['ice'][3], cx - 3, hip + 1)
    return s.render()
