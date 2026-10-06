"""Fondos pintados (suelo nevado, pantalla de titulo), logo, power-ups y
pantallas de interfaz en estilo LucasArts VGA."""
import math
import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pixart import Sprite, P, C, mix, hexc, ramp, OUTLINE, BAYER4, compose, upscale

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_PIX = os.path.join(ROOT, 'fonts', 'PixelifySans-Regular.ttf')
FONT_PIXB = os.path.join(ROOT, 'fonts', 'PixelifySans-Bold.ttf')
FONT_LOGO = os.path.join(ROOT, 'fonts', 'LuckiestGuy-Regular.ttf')


def _dither_ramp(val, R, xs, ys, amt=0.9):
    """val en [0,1] -> colores de la rampa R con dithering Bayer."""
    n = len(R)
    v = val * (n - 1) + (BAYER4[ys % 4, xs % 4] - 0.5) * amt
    idx = np.clip(np.round(v), 0, n - 1).astype(int)
    return np.array(R, np.uint8)[idx]


def _periodic_noise(w, h, seed, octaves=((3, 2, 1.0), (6, 4, 0.5), (12, 8, 0.25))):
    """Ruido suave que se repite exactamente cada w x h (para tiles)."""
    rnd = np.random.RandomState(seed)
    ys, xs = np.mgrid[0:h, 0:w]
    out = np.zeros((h, w))
    for fx, fy, amp in octaves:
        for _ in range(3):
            kx = rnd.randint(1, fx + 1)
            ky = rnd.randint(0, fy + 1)
            ph = rnd.rand() * 2 * math.pi
            out += amp * np.sin(2 * math.pi * (kx * xs / w + ky * ys / h) + ph)
    out -= out.min()
    out /= max(1e-6, out.max())
    return out


# ---------------------------------------------------------------------------
# Suelo nevado (tile 480x260 que se repite sin costuras)
# ---------------------------------------------------------------------------
def ground_tile(w=480, h=260):
    ys, xs = np.mgrid[0:h, 0:w]
    n = _periodic_noise(w, h, 11)
    snow = ramp('#a6a2e0', '#bebcf0', '#d6d4fa', '#ebeaff', '#fafaff')
    img = _dither_ramp(0.25 + 0.6 * n, snow, xs, ys, amt=1.0)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = img
    out[..., 3] = 255
    rnd = random.Random(5)
    im = Image.fromarray(out, 'RGBA')
    d = ImageDraw.Draw(im)

    def wrap_pts(fn):
        # dibuja la figura en las 4 posiciones envolventes para que el tile sea continuo
        for ox in (-w, 0, w):
            for oy in (-h, 0, h):
                fn(ox, oy)
    # surcos de viento (curvas suaves lavanda)
    for _ in range(26):
        x, y = rnd.randrange(w), rnd.randrange(h)
        L = rnd.randint(14, 40)
        col = hexc('#b4b0ea') if rnd.random() < 0.6 else hexc('#ffffff')
        def f(ox, oy, x=x, y=y, L=L, col=col):
            pts = [(x + ox + i, y + oy + int(2 * math.sin(i / 6.0))) for i in range(L)]
            d.line(pts, fill=col)
        wrap_pts(f)
    # huellas de pasos
    for _ in range(5):
        x, y = rnd.randrange(w), rnd.randrange(h)
        dx = rnd.choice((-1, 1))
        for k in range(6):
            def f(ox, oy, k=k, x=x, y=y):
                px_, py_ = x + ox + k * 7 * dx, y + oy + (3 if k % 2 else 0) + k
                d.ellipse([px_, py_, px_ + 2, py_ + 3], fill=hexc('#9c98d8'))
            wrap_pts(f)
    # piedritas y matas
    for _ in range(18):
        x, y = rnd.randrange(w), rnd.randrange(h)
        kind = rnd.random()
        def f(ox, oy, x=x, y=y, kind=kind):
            X, Y = x + ox, y + oy
            if kind < 0.5:
                d.ellipse([X, Y, X + 3, Y + 2], fill=hexc('#5a5478'))
                d.point((X + 1, Y), fill=hexc('#9a94c0'))
                d.line([(X - 1, Y + 3), (X + 4, Y + 3)], fill=hexc('#ffffff'))
            else:
                d.line([(X, Y), (X - 1, Y - 3)], fill=hexc('#5a7a2a'))
                d.line([(X + 1, Y), (X + 2, Y - 4)], fill=hexc('#344a18'))
                d.line([(X + 2, Y), (X + 4, Y - 2)], fill=hexc('#5a7a2a'))
        wrap_pts(f)
    # destellos
    for _ in range(90):
        x, y = rnd.randrange(w), rnd.randrange(h)
        d.point((x, y), fill=(255, 255, 255))
    return np.array(im)


# ---------------------------------------------------------------------------
# Pantalla de titulo 320x200 - mansion torcida en la nieve, de noche
# ---------------------------------------------------------------------------
def title_scene(w=320, h=200, with_mansion=True):
    ys, xs = np.mgrid[0:h, 0:w]
    sky = ramp('#0c0420', '#1c0a3c', '#34125c', '#561c76', '#7a2a86', '#a44a8e')
    t = np.clip(ys / (h * 0.75), 0, 1)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = _dither_ramp(t, sky, xs, ys)
    out[..., 3] = 255
    im = Image.fromarray(out, 'RGBA')
    d = ImageDraw.Draw(im)
    rnd = random.Random(42)
    # estrellas
    for _ in range(70):
        x, y = rnd.randrange(w), rnd.randrange(int(h * 0.55))
        c = rnd.choice([(255, 255, 255), (255, 240, 160), (190, 200, 255)])
        d.point((x, y), fill=c)
        if rnd.random() < 0.12:
            d.point((x + 1, y), fill=c); d.point((x - 1, y), fill=c)
            d.point((x, y + 1), fill=c); d.point((x, y - 1), fill=c)
    # luna gigante
    mx, my, mr = 250, 46, 30
    moon = ramp('#c8a860', '#e8d088', '#fff0b4', '#fffbe0')
    arr = np.array(im)
    m = (xs - mx) ** 2 + (ys - my) ** 2 <= mr * mr
    shade = 0.35 + 0.65 * np.clip(1 - ((xs - mx + 10) ** 2 + (ys - my + 10) ** 2) / (mr * mr * 2.2), 0, 1)
    arr[m, :3] = _dither_ramp(shade, moon, xs, ys)[m]
    for (cx, cy, r) in ((240, 40, 5), (258, 56, 4), (262, 34, 3), (236, 60, 3)):
        cm = (xs - cx) ** 2 + (ys - cy) ** 2 <= r * r
        arr[cm & m, :3] = hexc('#d8bc78')
    # halo
    halo = ((xs - mx) ** 2 + (ys - my) ** 2 <= (mr + 6) ** 2) & ~m
    hv = (BAYER4[ys % 4, xs % 4] > 0.55) & halo
    arr[hv, :3] = hexc('#a45a96')
    im = Image.fromarray(arr, 'RGBA')
    d = ImageDraw.Draw(im)
    # colinas lejanas
    def hill(base, amp, freq, ph, colr, seed):
        pts = [(0, h)]
        for x in range(0, w + 1, 2):
            y = base + amp * math.sin(x * freq + ph) + 4 * math.sin(x * freq * 3.1 + seed)
            pts.append((x, y))
        pts.append((w, h))
        d.polygon(pts, fill=colr)
    hill(128, 8, 0.02, 1.0, hexc('#3a2a6a'), 1)
    hill(140, 6, 0.03, 2.5, hexc('#4e3c8a'), 2)

    if with_mansion:
        _mansion(d, 70, 140)
    # nieve en primer plano con sombreado dithered
    arr = np.array(im)
    fg = ys > (156 + 6 * np.sin(xs * 0.025) + 3 * np.sin(xs * 0.09))
    snow = ramp('#6a62b4', '#8e88d4', '#b4b0ec', '#dcdaff', '#ffffff')
    sh = np.clip(1.0 - (ys - 150) / 60.0, 0, 1) * 0.8 + 0.15 * np.sin(xs * 0.05)
    arr[fg, :3] = _dither_ramp(np.clip(sh, 0, 1), snow, xs, ys)[fg]
    im = Image.fromarray(arr, 'RGBA')
    d = ImageDraw.Draw(im)
    # cerca torcida
    for i, x in enumerate(range(150, 316, 12)):
        lean = ((i * 37) % 7 - 3) * 0.7
        top = 150 + ((i * 13) % 5)
        d.polygon([(x, 170), (x + 4, 170), (x + 4 + lean, top), (x + 2 + lean, top - 3), (x + lean, top)], fill=hexc('#3a2010'), outline=hexc('#12081c'))
        d.line([(x + 1, 170), (x + 1 + lean, top + 1)], fill=hexc('#6a4020'))
        d.line([(x + lean, top - 1), (x + 4 + lean, top - 1)], fill=(255, 255, 255))
    d.line([(150, 158), (316, 155)], fill=hexc('#3a2010'), width=2)
    d.line([(150, 164), (316, 162)], fill=hexc('#3a2010'), width=2)
    # arbol muerto torcido a la izquierda
    def branch(x, y, ang, L, wdt, depth):
        if depth == 0 or L < 3:
            return
        x2 = x + L * math.cos(ang)
        y2 = y + L * math.sin(ang)
        d.line([(x, y), (x2, y2)], fill=hexc('#1a0e22'), width=max(1, int(wdt)))
        branch(x2, y2, ang - 0.5 + rnd.random() * 0.2, L * 0.72, wdt * 0.65, depth - 1)
        branch(x2, y2, ang + 0.45 + rnd.random() * 0.2, L * 0.62, wdt * 0.6, depth - 1)
    branch(22, 178, -1.45, 34, 6, 6)
    # manos de zombi saliendo de la nieve
    for (x, y) in ((118, 182), (204, 188), (290, 180)):
        d.polygon([(x, y), (x + 5, y), (x + 5, y - 9), (x + 7, y - 13), (x + 6, y - 15), (x + 4, y - 12), (x + 4, y - 16), (x + 2, y - 16), (x + 1, y - 12), (x - 1, y - 14), (x - 2, y - 12), (x, y - 9)],
                  fill=hexc('#6ea444'), outline=hexc('#12081c'))
        d.line([(x - 3, y + 1), (x + 8, y + 1)], fill=(255, 255, 255))
    # copos
    for _ in range(80):
        x, y = rnd.randrange(w), rnd.randrange(h)
        d.point((x, y), fill=(255, 255, 255) if rnd.random() < 0.7 else hexc('#c8c4ff'))
    return np.array(im)


def _mansion(d, x0, base):
    """Mansion torcida con ventanas encendidas (silueta + detalles)."""
    body = hexc('#2a1440')
    roof = hexc('#1a0a2a')
    lit = hexc('#ffd860')
    lit2 = hexc('#ff9a30')
    # cuerpo principal inclinado
    d.polygon([(x0, base), (x0 + 3, base - 52), (x0 + 70, base - 58), (x0 + 74, base)], fill=body, outline=OUTLINE)
    # torre torcida
    d.polygon([(x0 + 48, base - 50), (x0 + 50, base - 92), (x0 + 72, base - 96), (x0 + 70, base - 54)], fill=body, outline=OUTLINE)
    d.polygon([(x0 + 44, base - 90), (x0 + 66, base - 128), (x0 + 78, base - 94)], fill=roof, outline=OUTLINE)
    # tejado principal
    d.polygon([(x0 - 6, base - 50), (x0 + 22, base - 80), (x0 + 50, base - 84), (x0 + 52, base - 56)], fill=roof, outline=OUTLINE)
    # chimenea con humo
    d.polygon([(x0 + 10, base - 70), (x0 + 11, base - 86), (x0 + 18, base - 87), (x0 + 18, base - 74)], fill=body, outline=OUTLINE)
    for k, (sx, sy, r) in enumerate(((x0 + 16, base - 92, 4), (x0 + 20, base - 100, 5), (x0 + 27, base - 108, 6), (x0 + 36, base - 114, 5))):
        d.ellipse([sx - r, sy - r, sx + r, sy + r], fill=hexc('#6a5a8a'))
    # nieve en los tejados
    d.line([(x0 - 5, base - 51), (x0 + 22, base - 80), (x0 + 50, base - 84)], fill=(255, 255, 255), width=2)
    d.line([(x0 + 44, base - 90), (x0 + 66, base - 127)], fill=(255, 255, 255), width=2)
    # ventanas torcidas encendidas
    wins = [(x0 + 8, base - 44, 9, 11, -1), (x0 + 26, base - 46, 9, 12, 1), (x0 + 8, base - 22, 9, 11, 1),
            (x0 + 55, base - 82, 8, 11, -1), (x0 + 56, base - 66, 8, 9, 1), (x0 + 44, base - 22, 9, 12, -1)]
    for (wx, wy, ww, wh, sk) in wins:
        d.polygon([(wx, wy + wh), (wx + sk, wy), (wx + ww + sk, wy - sk), (wx + ww, wy + wh)], fill=lit, outline=OUTLINE)
        d.line([(wx + ww // 2, wy + wh), (wx + ww // 2 + sk, wy - sk // 2)], fill=OUTLINE)
        d.line([(wx, wy + wh // 2), (wx + ww, wy + wh // 2)], fill=OUTLINE)
        d.point((wx + 2, wy + wh - 2), fill=lit2)
    # puerta
    d.polygon([(x0 + 28, base), (x0 + 29, base - 20), (x0 + 38, base - 21), (x0 + 38, base)], fill=hexc('#5a2a14'), outline=OUTLINE)
    d.point((x0 + 36, base - 10), fill=lit)


# ---------------------------------------------------------------------------
# Logo "CHILLY ZOMBIES"
# ---------------------------------------------------------------------------
def logo(scale_w=300):
    def word(text, size, top_col, bot_col, wobble, seed, drips=False):
        f = ImageFont.truetype(FONT_LOGO, size)
        bb = f.getbbox(text)
        W, H = bb[2] - bb[0] + 16, bb[3] - bb[1] + 22
        m = Image.new('L', (W, H), 0)
        ImageDraw.Draw(m).text((8 - bb[0], 6 - bb[1]), text, font=f, fill=255)
        a = np.array(m) > 110
        # bamboleo por columna (letras "bailando" estilo DOTT)
        b = np.zeros_like(a)
        rnd = random.Random(seed)
        for x in range(W):
            dy = int(round(wobble * math.sin(x / 9.0 + seed) + wobble * 0.5 * math.sin(x / 3.7)))
            b[:, x] = np.roll(a[:, x], dy)
        a = b
        ys, xs = np.mgrid[0:H, 0:W]
        t = (ys - 4) / max(1, H - 14)
        rmp = [hexc(c) for c in top_col]
        cols = _dither_ramp(np.clip(1 - t, 0, 1), rmp, xs, ys)
        out = np.zeros((H, W, 4), np.uint8)
        out[a, :3] = cols[a]
        out[a, 3] = 255
        # brillo en el borde superior de cada letra
        topedge = a & ~np.roll(a, 1, 0)
        out[topedge, :3] = (255, 255, 255)
        if drips:
            bottom = a & ~np.roll(a, -1, 0)
            yb, xb = np.where(bottom)
            for i in range(0, len(xb), 1):
                if rnd.random() < 0.08:
                    L = rnd.randint(2, 6)
                    for k in range(1, L):
                        if yb[i] + k < H:
                            out[yb[i] + k, xb[i], :3] = hexc(bot_col)
                            out[yb[i] + k, xb[i], 3] = 255
        return out

    chilly = word('CHILLY', 44, ['#3a6ab0', '#5aa0e0', '#8ad8f8', '#d8f8ff'], '#8ad8f8', 2.2, 1)
    zomb = word('ZOMBIES', 50, ['#1c4a10', '#3a8a1c', '#6ac030', '#b8f060'], '#6ac030', 2.8, 2, drips=True)
    W = max(chilly.shape[1], zomb.shape[1]) + 20
    H = chilly.shape[0] + zomb.shape[0] - 6
    out = np.zeros((H, W, 4), np.uint8)
    compose(out, chilly, (W - chilly.shape[1]) // 2 - 10, 0)
    compose(out, zomb, (W - zomb.shape[1]) // 2 + 6, chilly.shape[0] - 10)
    # contorno grueso (2 px) + sombra paralela morada
    a = out[..., 3] > 0
    def dil(m):
        n = m.copy()
        n[1:, :] |= m[:-1, :]; n[:-1, :] |= m[1:, :]
        n[:, 1:] |= m[:, :-1]; n[:, :-1] |= m[:, 1:]
        return n
    o1 = dil(a) & ~a
    o2 = dil(dil(a)) & ~a & ~o1
    out[o1, :3] = OUTLINE; out[o1, 3] = 255
    out[o2, :3] = OUTLINE; out[o2, 3] = 255
    sh = np.zeros_like(a)
    full = out[..., 3] > 0
    sh[4:, 4:] = full[:-4, :-4]
    sh &= ~full
    out[sh, :3] = hexc('#5a1a7e'); out[sh, 3] = 255
    return out


# ---------------------------------------------------------------------------
# Power-ups 24x24
# ---------------------------------------------------------------------------
def powerup(kind):
    s = Sprite(24, 24)
    if kind == 'speed':
        b = s.part(P['red'])
        s.poly(b, [(6, 6), (12, 6), (12, 14), (18, 15), (19, 19), (6, 19)])
        so = s.part(P['white'])
        s.rect(so, 5, 18, 19, 20)
        wg = s.part(P['white'])
        s.poly(wg, [(4, 9), (0, 6), (1, 10), (0, 13), (4, 13)])
        s.d_line(P['yellow'][3], [(13, 8), (21, 8)])
        s.d_line(P['yellow'][3], [(14, 11), (22, 11)])
    elif kind == 'rapidfire':
        for (x, y) in ((6, 15), (12, 9), (18, 15)):
            b = s.part(P['snow'], gain=2.0)
            s.ell(b, x, y, 4, 4)
        s.d_line(P['orange'][3], [(2, 4), (6, 7)])
        s.d_line(P['orange'][3], [(20, 3), (17, 6)])
    elif kind == 'shield':
        sh = s.part(P['teal'], gain=2.0)
        s.poly(sh, [(4, 4), (12, 2), (20, 4), (19, 14), (12, 21), (5, 14)])
        cr = s.part(P['yellow'], line=False)
        s.rect(cr, 11, 6, 13, 16)
        s.rect(cr, 7, 9, 17, 11)
    elif kind == 'ammo':
        bk = s.part(P['steel'], gain=2.0)
        s.poly(bk, [(4, 10), (20, 10), (18, 21), (6, 21)])
        sn = s.part(P['snow'])
        s.ell(sn, 12, 9, 8, 4)
        s.ell(sn, 9, 6, 3, 3)
        s.ell(sn, 15, 6, 3, 3)
        s.d_line(P['steel'][3], [(5, 12), (19, 12)])
    elif kind == 'freeze':
        for a in range(3):
            ang = a * math.pi / 3
            dx, dy = 9 * math.cos(ang), 9 * math.sin(ang)
            s.d_line(P['ice'][3], [(12 - dx, 12 - dy), (12 + dx, 12 + dy)], 2)
        c = s.part(P['ice'], gain=2.0)
        s.ell(c, 12, 12, 3, 3)
        for a in range(6):
            ang = a * math.pi / 3
            s.d_px(P['white'][3], 12 + 9 * math.cos(ang), 12 + 9 * math.sin(ang))
    elif kind == 'damage':
        gl = s.part(P['red'], gain=2.0)
        s.ell(gl, 12, 10, 8, 7)
        s.ell(gl, 6, 13, 3, 3)
        cf = s.part(P['white'])
        s.rect(cf, 7, 16, 17, 21)
        s.d_line(P['red'][0], [(10, 6), (10, 12)])
        s.d_px(P['red'][3], 9, 5)
    elif kind == 'bomb':
        b = s.part(P['black'], gain=2.2)
        s.ell(b, 11, 14, 8, 8)
        cp = s.part(P['steel'])
        s.rect(cp, 13, 4, 17, 7)
        s.d_line(P['wood'][3], [(16, 4), (19, 1)])
        s.d_px(P['yellow'][3], 20, 1)
        s.d_px(P['orange'][3], 21, 0)
        s.d_px(P['orange'][3], 19, 0)
        s.d_px(P['white'][3], 8, 10)
    elif kind == 'magnet':
        m = s.part(P['red'], gain=1.8)
        s.line(m, [(6, 4), (6, 12)], 5)
        s.line(m, [(18, 4), (18, 12)], 5)
        s.poly(m, [(3, 12), (21, 12), (19, 19), (12, 22), (5, 19)])
        s.ell(0, 12, 12, 3.5, 4)
        s.rect(0, 9, 2, 15, 12)
        tp = s.part(P['steel'], line=False)
        s.rect(tp, 4, 2, 8, 5)
        s.rect(tp, 16, 2, 20, 5)
    return s.render()


# ---------------------------------------------------------------------------
# Texto pixelado con contorno (como los dialogos de SCUMM)
# ---------------------------------------------------------------------------
def draw_text(img, xy, text, size=10, col='#ffffff', bold=False, center=False, outline=True, shadow=False):
    f = ImageFont.truetype(FONT_PIXB if bold else FONT_PIX, size)
    d = ImageDraw.Draw(img)
    d.fontmode = '1'
    x, y = xy
    if center:
        bb = d.textbbox((0, 0), text, font=f)
        x = x - (bb[2] - bb[0]) // 2
    c = hexc(col) if isinstance(col, str) else col
    if outline:
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)):
            d.text((x + dx, y + dy), text, font=f, fill=OUTLINE)
    if shadow:
        d.text((x + 1, y + 1), text, font=f, fill=OUTLINE)
    d.text((x, y), text, font=f, fill=c)
    return img


def panel(w, h, fill='#2a0e40', light='#8a50c0', dark='#0a0412', border=OUTLINE):
    """Panel biselado estilo interfaz SCUMM."""
    a = np.zeros((h, w, 4), np.uint8)
    ys, xs = np.mgrid[0:h, 0:w]
    base = ramp('#1a0828', fill, '#3e1860')
    a[..., :3] = _dither_ramp(np.clip(1 - ys / max(1, h - 1), 0, 1) * 0.9, base, xs, ys)
    a[..., 3] = 255
    a[0, :, :3] = border; a[-1, :, :3] = border; a[:, 0, :3] = border; a[:, -1, :3] = border
    a[1, 1:-1, :3] = hexc(light); a[1:-1, 1, :3] = hexc(light)
    a[-2, 1:-1, :3] = hexc(dark); a[1:-1, -2, :3] = hexc(dark)
    return a


def button(w, h, label, col='#7af0a0'):
    a = panel(w, h)
    im = Image.fromarray(a, 'RGBA')
    draw_text(im, (w // 2, (h - 12) // 2 - 1), label, size=12, col=col, center=True)
    return np.array(im)
