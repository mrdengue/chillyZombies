"""Objetos del escenario, armas, iconos y elementos de interfaz con el look
"torcido" de los fondos de LucasArts (nada es del todo recto)."""
import math
import random
import numpy as np
from pixart import Sprite, P, C, mix, hexc, OUTLINE


# ---------------------------------------------------------------------------
# Bloques de ladrillo (con nieve encima) y de hielo
# ---------------------------------------------------------------------------
def brick_block(w, h, seed=0):
    rnd = random.Random(seed)
    s = Sprite(w, h)
    cells = []
    for cy in range(0, h, 20):
        for cx in range(0, w, 20):
            cells.append((cx, cy))
    brick = P['red']
    brick = [mix(c, hexc('#6a2a4a'), 0.35) for c in brick]
    base = s.part(brick, line=False, gain=0.6, vgrad=0.05)
    s.rect(base, 1, 2, w - 2, h - 2)
    mortar = mix(brick[0], OUTLINE, 0.35)
    # hileras de ladrillos ligeramente torcidas
    rows = list(range(2, h - 1, 5))
    for i, y in enumerate(rows):
        yy = y + (1 if rnd.random() < 0.2 else 0)
        s.d_line(mortar, [(1, yy), (w - 2, yy + rnd.choice((-1, 0, 0, 1)))])
        off = 0 if i % 2 == 0 else 5
        for x in range(off + 1, w - 1, 10):
            s.d_line(mortar, [(x, yy + 1), (x + rnd.choice((0, 0, 1)), yy + 4)])
            # brillo del ladrillo
            if x + 2 < w - 2:
                s.d_px(brick[3], x + 2, yy + 2)
    # gorro de nieve irregular
    snow = s.part(P['snow'], gain=1.2)
    pts = [(0, 6)]
    x = 0
    while x < w:
        pts.append((x, rnd.choice((2, 3, 4))))
        x += rnd.choice((3, 4, 5))
    pts += [(w - 1, 3), (w - 1, 5)]
    x = w - 1
    while x > 0:
        pts.append((x, rnd.choice((4, 5, 6, 7))))
        x -= rnd.choice((2, 3, 4))
    s.poly(snow, pts)
    # carambanos
    for x in range(3, w - 2, 7):
        if rnd.random() < 0.7:
            L = rnd.choice((2, 3, 4))
            s.d_line(P['ice'][2], [(x, 6), (x, 6 + L)])
            s.d_px(P['ice'][3], x, 6)
    return s.render()


def ice_block(w, h, seed=0):
    rnd = random.Random(seed + 7)
    s = Sprite(w, h)
    ice = s.part(P['ice'], gain=0.9, vgrad=0.35, line=False)
    s.rect(ice, 1, 1, w - 2, h - 2)
    # brillos diagonales y bisel por celda
    for cy in range(0, h, 20):
        for cx in range(0, w, 20):
            s.d_line(P['ice'][3], [(cx + 2, cy + 2), (cx + 17, cy + 2)])
            s.d_line(P['ice'][3], [(cx + 2, cy + 2), (cx + 2, cy + 17)])
            s.d_line(P['ice'][1], [(cx + 17, cy + 3), (cx + 17, cy + 17), (cx + 3, cy + 17)])
            s.d_line(P['ice'][3], [(cx + 5, cy + 12), (cx + 12, cy + 5)])
            s.d_line(P['ice'][3], [(cx + 7, cy + 14), (cx + 9, cy + 12)])
            # grieta
            x0, y0 = cx + rnd.randint(9, 14), cy + rnd.randint(9, 14)
            s.d_line(P['ice'][0], [(x0, y0), (x0 + 2, y0 + 2), (x0 + 1, y0 + 4)])
            if cx > 0:
                s.d_line(P['ice'][0], [(cx, cy + 1), (cx, cy + 18)])
            if cy > 0:
                s.d_line(P['ice'][0], [(cx + 1, cy), (cx + 18, cy)])
    return s.render(outline=hexc('#08204a'))


# ---------------------------------------------------------------------------
# Arbol torcido de navidad = ShootingSpot 66x96
# ---------------------------------------------------------------------------
def shooting_spot():
    s = Sprite(66, 96)
    rnd = random.Random(3)
    mound = s.part(P['snow'], vgrad=0.3)
    s.ell(mound, 33, 88, 30, 6.5)
    trunk = s.part(P['wood'])
    s.poly(trunk, [(29, 88), (37, 88), (36, 70), (38, 50), (35, 50), (31, 70)])
    tiers = [(34, 72, 26, 12), (36, 58, 22, 11), (34, 45, 18, 10), (38, 32, 14, 10), (35, 20, 10, 9)]
    for i, (cx, by, half, ht) in enumerate(tiers):
        lean = (i % 2) * 3 - 1
        t = s.part(P['dgreen'], gain=1.3)
        s.poly(t, [(cx - half, by), (cx + lean - 2, by - ht - 6), (cx + lean + 2, by - ht - 6), (cx + half, by + 2)])
        # nieve encima de cada piso
        sn = s.part(P['snow'], line=False, gain=1.0, light=0.15)
        s.poly(sn, [(cx - half + 3, by - 3), (cx + lean - 1, by - ht - 4), (cx + lean + 2, by - ht - 4),
                    (cx + half - 4, by - 1), (cx + half - 8, by - 3), (cx + 2, by - 6), (cx - 5, by - 2)])
        # luces de colores
        for k in range(4):
            lx = cx - half + 4 + k * (2 * half - 8) / 3.0
            ly = by - 1 + rnd.choice((0, 1, -1))
            col = [P['red'][3], P['yellow'][3], P['teal'][3], P['pink'][3]][(k + i) % 4]
            s.d_px(col, int(lx), int(ly))
            s.d_px(mix(col, (255, 255, 255), 0.6), int(lx), int(ly) - 1)
    # estrella torcida
    st = s.part(P['yellow'], gain=2.0)
    cx, cy = 37, 7
    pts = []
    for k in range(10):
        a = -math.pi / 2 + k * math.pi / 5 + 0.25
        r = 6 if k % 2 == 0 else 2.6
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    s.poly(st, pts)
    # escalera apoyada (para "subir a disparar")
    lad = s.part(P['wood'], line=False)
    s.line(lad, [(12, 90), (20, 56)], 1)
    s.line(lad, [(17, 90), (25, 57)], 1)
    for k in range(6):
        y = 86 - k * 6
        x0 = 12 + (90 - y) * 8 / 34.0
        s.line(lad, [(x0, y), (x0 + 5, y)], 1)
    return s.render()


# ---------------------------------------------------------------------------
# Chatarreria = Material 60x60
# ---------------------------------------------------------------------------
def material():
    s = Sprite(60, 60)
    mound = s.part(P['snow'], vgrad=0.35)
    s.ell(mound, 30, 52, 28, 7)
    # neumatico
    tire = s.part(P['black'], gain=1.4)
    s.ell(tire, 14, 44, 10, 7)
    s.ell(0, 14, 44, 4, 2.5)
    # tablones cruzados
    for (a, b, w) in (((8, 20), (40, 46), 4), ((26, 12), (34, 50), 5), ((40, 14), (22, 48), 4)):
        pl = s.part(P['wood'])
        s.line(pl, [a, b], w)
    # caja de regalo aplastada
    bx = s.part(P['teal'])
    s.poly(bx, [(36, 30), (52, 28), (54, 44), (38, 46)])
    rb = s.part(P['yellow'], line=False)
    s.poly(rb, [(43, 29), (46, 29), (48, 45), (45, 45)])
    # buzon rojo torcido
    mb = s.part(P['red'])
    s.poly(mb, [(44, 10), (54, 8), (56, 16), (46, 18)])
    s.ell(mb, 49.5, 9.5, 5, 3)
    post = s.part(P['steel'])
    s.line(post, [(50, 17), (48, 30)], 2)
    flag = s.part(P['yellow'])
    s.rect(flag, 55, 6, 57, 11)
    # cubo (balde)
    bk = s.part(P['steel'], gain=2.0)
    s.poly(bk, [(4, 26), (14, 26), (12, 36), (6, 36)])
    s.d_line(P['steel'][3], [(5, 27), (13, 27)])
    # nieve encima de la pila
    sn = s.part(P['snow'], line=False, light=0.15)
    s.ell(sn, 30, 18, 9, 2.5)
    s.ell(sn, 12, 37, 5, 1.5)
    # lucecitas sueltas
    for (x, y, c) in ((22, 50, 'red'), (26, 52, 'yellow'), (30, 51, 'teal'), (34, 53, 'pink'), (38, 52, 'lime')):
        s.d_px(P[c][3], x, y)
    s.d_line(P['dgreen'][2], [(20, 50), (40, 53)])
    return s.render()


# ---------------------------------------------------------------------------
# Taller = AmmoStation 39x34
# ---------------------------------------------------------------------------
def ammo_station():
    s = Sprite(39, 34)
    for (a, b) in (((5, 15), (3, 32)), ((33, 15), (36, 32)), ((10, 16), (11, 30)), ((28, 16), (27, 30))):
        lg = s.part(P['wood'])
        s.line(lg, [a, b], 2)
    top = s.part(P['wood'], gain=1.0)
    s.poly(top, [(1, 12), (37, 10), (38, 15), (2, 17)])
    s.d_line(P['wood'][0], [(3, 14), (36, 12)])
    shelf = s.part(P['brown'])
    s.poly(shelf, [(4, 25), (35, 24), (35, 26), (4, 27)])
    # tornillo de banco
    vs = s.part(P['steel'], gain=2.0)
    s.rect(vs, 3, 6, 10, 11)
    s.d_line(P['steel'][3], [(4, 7), (9, 7)])
    # frasco verde de "pegamento"
    jar = s.part(P['green'], gain=2.0)
    s.ell(jar, 26, 6, 3.5, 4.5)
    lid = s.part(P['red'])
    s.rect(lid, 23, 0, 29, 2)
    s.d_px(P['green'][3], 25, 4)
    # martillo
    hm = s.part(P['wood'], line=False)
    s.line(hm, [(13, 11), (20, 8)], 1)
    hh = s.part(P['steel'])
    s.rect(hh, 19, 5, 22, 9)
    # bola de nieve terminada
    sb = s.part(P['snow'])
    s.ell(sb, 33, 7, 3, 3)
    # calcetin colgando
    sk = s.part(P['red'])
    s.poly(sk, [(14, 17), (17, 17), (17, 22), (20, 22), (20, 24), (14, 24)])
    s.d_line(P['white'][3], [(14, 19), (17, 19)])
    return s.render()


# ---------------------------------------------------------------------------
# Pequenos props
# ---------------------------------------------------------------------------
def snowpile():
    s = Sprite(14, 12)
    p = s.part(P['snow'], vgrad=0.35)
    s.ell(p, 7, 8, 6, 3)
    s.ell(p, 6, 6, 3.5, 2.5)
    s.ell(p, 9, 7, 3, 2)
    return s.render(outline=hexc('#3a3478'))


def prop01():
    """Ventisquero con matas secas 57x12."""
    s = Sprite(57, 12)
    d = s.part(P['snow'], vgrad=0.4, gain=1.0)
    s.ell(d, 14, 9, 12, 2.5)
    s.ell(d, 38, 9, 16, 2.5)
    s.ell(d, 28, 8, 6, 2.5)
    for x in (8, 11, 30, 46, 49):
        s.d_line(P['moss'][1], [(x, 8), (x - 1, 3)])
        s.d_line(P['moss'][2], [(x + 1, 8), (x + 2, 4)])
    return s.render(outline=hexc('#3a3478'))


def prop02():
    """Ramita saliendo de la nieve 10x16."""
    s = Sprite(10, 16)
    b = s.part(P['brown'], line=False)
    s.line(b, [(5, 14), (5, 6), (3, 2)], 1)
    s.line(b, [(5, 8), (8, 4)], 1)
    s.line(b, [(5, 10), (2, 8)], 1)
    sn = s.part(P['snow'])
    s.ell(sn, 5, 14, 3.5, 1.4)
    s.d_px(P['red'][2], 8, 3)
    s.d_px(P['red'][3], 2, 7)
    return s.render(outline=hexc('#2a1e40'))


def camera():
    s = Sprite(19, 15)
    b = s.part(P['black'], gain=1.6)
    s.rect(b, 2, 5, 13, 12)
    r1 = s.part(P['steel'])
    s.ell(r1, 5, 3, 2.5, 2.5)
    s.ell(r1, 11, 3, 2.5, 2.5)
    l = s.part(P['steel'])
    s.poly(l, [(13, 7), (17, 5), (17, 12), (13, 10)])
    s.d_px(C['red_eye'], 3, 6)
    return s.render()


def unknown():
    s = Sprite(5, 7)
    q = s.part(P['yellow'], flat=True)
    s.rect(q, 1, 1, 3, 1)
    s.px(q, 3, 2)
    s.px(q, 2, 3)
    s.px(q, 2, 5)
    return s.render()


# ---------------------------------------------------------------------------
# Armas (proyectiles)
# ---------------------------------------------------------------------------
def firesock(w=12, h=16, ox=0, oy=0, s=None):
    own = s is None
    if own:
        s = Sprite(w, h)
    # llamita
    f = s.part(P['flame'], line=False, light=0.1)
    s.poly(f, [(ox + 2, oy + 6), (ox + 3, oy + 2), (ox + 5, oy + 4), (ox + 6, oy + 0), (ox + 8, oy + 4), (ox + 9, oy + 2), (ox + 10, oy + 6)])
    sk = s.part(P['red'])
    s.poly(sk, [(ox + 2, oy + 5), (ox + 9, oy + 5), (ox + 9, oy + 11), (ox + 10, oy + 13), (ox + 8, oy + 15), (ox + 2, oy + 15), (ox + 2, oy + 12), (ox + 4, oy + 11)])
    s.d_line(P['white'][3], [(ox + 3, oy + 7), (ox + 8, oy + 7)])
    s.d_line(P['white'][2], [(ox + 4, oy + 10), (ox + 8, oy + 10)])
    s.d_line(P['white'][3], [(ox + 3, oy + 13), (ox + 7, oy + 13)])
    return s.render() if own else s


def snowball(w=18, h=18, ox=0, oy=0, s=None):
    own = s is None
    if own:
        s = Sprite(w, h)
    b = s.part(P['snow'], gain=2.0, light=0.05)
    s.ell(b, ox + 9, oy + 9, 7.5, 7)
    # cara asesina (Killer Snowball)
    s.d_line(P['coal'][0], [(ox + 5, oy + 6), (ox + 8, oy + 8)])
    s.d_line(P['coal'][0], [(ox + 13, oy + 6), (ox + 10, oy + 8)])
    s.d_px(C['red_eye'], ox + 7, oy + 9)
    s.d_px(C['red_eye'], ox + 11, oy + 9)
    s.d_line(P['coal'][1], [(ox + 7, oy + 12), (ox + 11, oy + 12)])
    s.d_px(P['white'][3], ox + 5, oy + 4)
    return s.render() if own else s


def firegift(w=30, h=30, ox=0, oy=0, s=None):
    own = s is None
    if own:
        s = Sprite(w, h)
    for k, x in enumerate((7, 12, 17, 22)):
        f = s.part(P['flame'], line=False, light=0.1)
        ht = 8 if k % 2 else 5
        s.poly(f, [(ox + x - 4, oy + 13), (ox + x, oy + 13 - ht - 3), (ox + x + 4, oy + 13)])
    bx = s.part(P['purple'])
    s.poly(bx, [(ox + 4, oy + 12), (ox + 25, oy + 10), (ox + 26, oy + 27), (ox + 5, oy + 28)])
    rb = s.part(P['yellow'], line=False, light=0.05)
    s.poly(rb, [(ox + 13, oy + 11), (ox + 17, oy + 11), (ox + 18, oy + 27), (ox + 14, oy + 28)])
    s.poly(rb, [(ox + 4, oy + 18), (ox + 26, oy + 16), (ox + 26, oy + 20), (ox + 4, oy + 22)])
    bow = s.part(P['yellow'])
    s.ell(bow, ox + 12, oy + 9, 3.5, 2.5)
    s.ell(bow, ox + 19, oy + 8, 3.5, 2.5)
    s.d_px(P['pink'][3], ox + 8, oy + 25)
    s.d_px(P['pink'][3], ox + 22, oy + 14)
    return s.render() if own else s


# ---------------------------------------------------------------------------
# Iconos de inventario 30x30 (fondo morado SCUMM) y marco de seleccion
# ---------------------------------------------------------------------------
def _inv_bg():
    a = np.zeros((30, 30, 4), np.uint8)
    top = np.array(hexc('#3a1458'))
    bot = np.array(hexc('#1a0828'))
    for y in range(30):
        a[y, :, :3] = (top * (1 - y / 29.0) + bot * (y / 29.0)).astype(np.uint8)
    a[..., 3] = 255
    a[0, :, :3] = hexc('#8a50c0')
    a[:, 0, :3] = hexc('#8a50c0')
    a[-1, :, :3] = hexc('#0a0412')
    a[:, -1, :3] = hexc('#0a0412')
    return a


def inv_icon(kind):
    from pixart import compose
    bg = _inv_bg()
    if kind == 'firesock':
        ic = firesock(30, 30, ox=9, oy=7)
    elif kind == 'snowball':
        ic = snowball(30, 30, ox=6, oy=6)
    else:
        ic = firegift(30, 30, ox=0, oy=0)
    return compose(bg, ic, 0, 0)


def selected_frame():
    a = np.zeros((30, 30, 4), np.uint8)
    y = np.array(hexc('#ffe040'))
    o = np.array(hexc('#ff7a00'))
    for i in range(30):
        for (x, yy) in ((i, 0), (i, 29), (0, i), (29, i)):
            a[yy, x, :3] = y
            a[yy, x, 3] = 255
        for (x, yy) in ((i, 1), (i, 28), (1, i), (28, i)):
            a[yy, x, :3] = o
            a[yy, x, 3] = 255
    return a


def player_selector():
    """Marcas de esquina (26x36) que senalan al personaje elegido."""
    a = np.zeros((36, 26, 4), np.uint8)
    col = np.array(hexc('#ffe040'))
    dark = np.array(OUTLINE)
    L = 6
    def put(x, y, c):
        a[y, x, :3] = c
        a[y, x, 3] = 255
    for (cx, cy, sx, sy) in ((1, 1, 1, 1), (24, 1, -1, 1), (1, 34, 1, -1), (24, 34, -1, -1)):
        for i in range(L):
            put(cx + sx * i, cy, col)
            put(cx, cy + sy * i, col)
            put(cx + sx * i, cy + sy, dark) if i > 0 else None
            put(cx + sx, cy + sy * i, dark) if i > 0 else None
    return a


# ---------------------------------------------------------------------------
# Globo de texto y etiqueta (pergamino crema, contorno grueso)
# ---------------------------------------------------------------------------
def text_bubble(selected=False):
    s = Sprite(147, 99)
    b = s.part(ramp_cream(), gain=0.5, vgrad=0.25)
    s.ell(b, 73, 42, 70, 39)
    s.poly(b, [(60, 70), (78, 72), (52, 96)])
    out = s.render(outline=hexc('#ffe040') if selected else OUTLINE)
    return _thicken(out, hexc('#ffe040') if selected else OUTLINE)


def text_label(selected=False):
    s = Sprite(171, 68)
    b = s.part(ramp_cream(), gain=0.5, vgrad=0.25)
    s.rect(b, 6, 3, 164, 64)
    s.ell(b, 6, 9, 5, 6)
    s.ell(b, 164, 9, 5, 6)
    s.ell(b, 6, 58, 5, 6)
    s.ell(b, 164, 58, 5, 6)
    s.rect(b, 2, 9, 168, 58)
    out = s.render(outline=hexc('#ffe040') if selected else OUTLINE)
    return _thicken(out, hexc('#ffe040') if selected else OUTLINE)


def ramp_cream():
    from pixart import ramp
    return ramp('#c8a870', '#ecd8a8', '#fff2cc', '#fffae8')


def _thicken(rgba, col):
    a = rgba[..., 3] > 0
    nb = np.zeros_like(a)
    nb[1:, :] |= a[:-1, :]
    nb[:-1, :] |= a[1:, :]
    nb[:, 1:] |= a[:, :-1]
    nb[:, :-1] |= a[:, 1:]
    o = nb & ~a
    rgba[o, :3] = col
    rgba[o, 3] = 255
    return rgba
