"""
pixart.py - Mini motor de pixel art estilo LucasArts (VGA, 1993).

Cada sprite se arma con "partes" (formas rellenas con una rampa de color).
Al renderizar se aplica:
  * sombreado con luz desde arriba-izquierda, cuantizado a la rampa con
    dithering ordenado (Bayer 4x4), como en los fondos y sprites VGA;
  * lineas interiores selectivas entre partes (la parte de delante se
    perfila sobre la de atras);
  * detalles a mano (ojos, bocas, brillos) pintados encima;
  * contorno exterior oscuro de 1 px.

El tamano de cada sprite debe coincidir con el original porque el motor
del juego usa el tamano natural de la imagen para las colisiones.
"""
import numpy as np
from PIL import Image, ImageDraw

BAYER4 = np.array([[0, 8, 2, 10],
                   [12, 4, 14, 6],
                   [3, 11, 1, 9],
                   [15, 7, 13, 5]], dtype=float) / 16.0


def hexc(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def ramp(*hs):
    return [hexc(h) for h in hs]


def mix(a, b, t):
    return tuple(int(round(a[i] * (1 - t) + b[i] * t)) for i in range(3))


OUTLINE = hexc('#12081c')

# ---------------------------------------------------------------------------
# Paleta (rampas de oscuro a claro) inspirada en la VGA de 1993
# ---------------------------------------------------------------------------
P = {
    'skin':    ramp('#6a2c1c', '#b25e3a', '#e89a6a', '#ffd2a6'),
    'skin2':   ramp('#3a1a10', '#7a4022', '#b07040', '#e0a870'),
    'zgreen':  ramp('#1c3418', '#3c6a2a', '#6ea444', '#b4e07a'),
    'zgrey':   ramp('#2a2a40', '#545474', '#8a8aac', '#c6c6e0'),
    'zice':    ramp('#1a3058', '#3a6aa0', '#76aad8', '#c4e6ff'),
    'zpurple': ramp('#2a1640', '#5a3480', '#8e62b8', '#c8a0e8'),
    'zteal':   ramp('#0e3434', '#1e6a64', '#40a49a', '#90dccc'),
    'zlav':    ramp('#2e2448', '#5a4c84', '#8a7cbc', '#c4b8ec'),
    'red':     ramp('#4a0816', '#9a1626', '#de3434', '#ff8a6e'),
    'orange':  ramp('#5a2208', '#b45210', '#f08a20', '#ffcc5a'),
    'yellow':  ramp('#5a3e08', '#b08a10', '#ecd030', '#fff48a'),
    'gold':    ramp('#4a2e06', '#946010', '#d8a020', '#ffe070'),
    'green':   ramp('#08341a', '#167028', '#3eac30', '#9cf060'),
    'lime':    ramp('#2a4008', '#5a8a10', '#9ad020', '#e0ff70'),
    'teal':    ramp('#082a34', '#0e6a7a', '#1eaab0', '#7aeee0'),
    'blue':    ramp('#0e0a48', '#1e2ea0', '#3a6ce0', '#8ab8ff'),
    'navy':    ramp('#080828', '#141a5a', '#283a94', '#5070c8'),
    'purple':  ramp('#24083a', '#561a7e', '#9638c0', '#d27ef2'),
    'pink':    ramp('#4e0834', '#9a1e68', '#e04ca0', '#ffa0d2'),
    'brown':   ramp('#28120a', '#562c10', '#8a5426', '#c48c4c'),
    'wood':    ramp('#2c140a', '#62341a', '#9a5e2e', '#d29a5a'),
    'grey':    ramp('#18182a', '#46465a', '#86869c', '#c4c4d6'),
    'steel':   ramp('#1a2030', '#465468', '#8094ac', '#d0e0f0'),
    'black':   ramp('#08060e', '#1a1626', '#2e2a42', '#4a4664'),
    'snow':    ramp('#5450a0', '#8e8cd2', '#cccaf6', '#ffffff'),
    'ice':     ramp('#0c3c70', '#2a86c0', '#7ad2f0', '#e6ffff'),
    'white':   ramp('#7a74b0', '#b4b0dc', '#e4e2fa', '#ffffff'),
    'carrot':  ramp('#5a1e04', '#b44a0a', '#f08018', '#ffc060'),
    'coal':    ramp('#060408', '#16121e', '#2c2638', '#4a4258'),
    'hair_br': ramp('#200c04', '#4a240c', '#7a4418', '#b0743a'),
    'hair_bk': ramp('#06040c', '#16121e', '#2a2438', '#463e5a'),
    'hair_bl': ramp('#5a3a06', '#a87a14', '#e4c040', '#fff090'),
    'hair_rd': ramp('#40100a', '#8a2a10', '#c45a20', '#f09048'),
    'eye':     ramp('#8a8ab0', '#c8c8e4', '#f4f4ff', '#ffffff'),
    'tooth':   ramp('#8a8060', '#c8c09a', '#f0ecd0', '#ffffff'),
    'flame':   ramp('#8a1a04', '#e04a08', '#ffa020', '#fff070'),
    'moss':    ramp('#18240c', '#344a18', '#5a7a2a', '#90b050'),
    'dgreen':  ramp('#041a0c', '#0c3a1a', '#1a6430', '#3a9a48'),
}

C = {k: v for k, v in {
    'outline': OUTLINE,
    'pupil': hexc('#0a0610'),
    'mouth': hexc('#3a0a14'),
    'white': hexc('#ffffff'),
    'red_eye': hexc('#ff2a2a'),
    'yellow_eye': hexc('#fff050'),
    'blush': hexc('#f07a8a'),
}.items()}


def _blur(a):
    """Desenfoque 3x3 aplicado dos veces (aprox. gaussiano) con bordes en 0."""
    for _ in range(2):
        p = np.pad(a, 1)
        a = (p[:-2, :-2] + p[:-2, 1:-1] + p[:-2, 2:] +
             p[1:-1, :-2] + p[1:-1, 1:-1] + p[1:-1, 2:] +
             p[2:, :-2] + p[2:, 1:-1] + p[2:, 2:]) / 9.0
    return a


class Sprite:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.pid = np.zeros((h, w), np.int32)
        self.parts = [None]
        self.details = []  # (mask, rgb)

    # -- partes --------------------------------------------------------
    def part(self, rmp, line=True, flat=False, light=0.0, vgrad=0.18, gain=1.6):
        self.parts.append(dict(ramp=rmp, line=line, flat=flat, light=light,
                               vgrad=vgrad, gain=gain))
        return len(self.parts) - 1

    def _mask(self, fn):
        im = Image.new('L', (self.w, self.h), 0)
        fn(ImageDraw.Draw(im))
        return np.array(im) > 0

    def _apply(self, p, m):
        if p == 0:
            self.pid[m] = 0
        else:
            self.pid[m] = p

    def ell(self, p, cx, cy, rx, ry):
        self._apply(p, self._mask(lambda d: d.ellipse(
            [cx - rx, cy - ry, cx + rx, cy + ry], fill=255)))

    def rect(self, p, x0, y0, x1, y1):
        self._apply(p, self._mask(lambda d: d.rectangle([x0, y0, x1, y1], fill=255)))

    def poly(self, p, pts):
        self._apply(p, self._mask(lambda d: d.polygon([tuple(q) for q in pts], fill=255)))

    def line(self, p, pts, w=1):
        def f(d):
            d.line([tuple(q) for q in pts], fill=255, width=w, joint='curve')
            if w >= 3:  # extremos redondeados
                r = w / 2.0 - 0.5
                for (x, y) in (pts[0], pts[-1]):
                    d.ellipse([x - r, y - r, x + r, y + r], fill=255)
        self._apply(p, self._mask(f))

    def px(self, p, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.pid[int(y), int(x)] = p

    def mask_of(self, p):
        return self.pid == p

    # -- detalles (color plano, encima del sombreado) -------------------
    def d_px(self, col, x, y):
        m = np.zeros((self.h, self.w), bool)
        if 0 <= x < self.w and 0 <= y < self.h:
            m[int(y), int(x)] = True
        self.details.append((m, col))

    def d_line(self, col, pts, w=1):
        self.details.append((self._mask(lambda d: d.line([tuple(q) for q in pts], fill=255, width=w)), col))

    def d_ell(self, col, cx, cy, rx, ry):
        self.details.append((self._mask(lambda d: d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)), col))

    def d_rect(self, col, x0, y0, x1, y1):
        self.details.append((self._mask(lambda d: d.rectangle([x0, y0, x1, y1], fill=255)), col))

    def d_poly(self, col, pts):
        self.details.append((self._mask(lambda d: d.polygon([tuple(q) for q in pts], fill=255)), col))

    # -- render ---------------------------------------------------------
    def render(self, outline=OUTLINE, inner=True, dither=True):
        h, w = self.h, self.w
        out = np.zeros((h, w, 4), np.uint8)
        ys, xs = np.mgrid[0:h, 0:w]
        ids = [i for i in np.unique(self.pid) if i > 0]
        for p in ids:
            M = self.pid == p
            prt = self.parts[p]
            R = prt['ramp']
            n = len(R)
            if prt['flat']:
                idx = np.full((h, w), n - 2)
            else:
                B = _blur(M.astype(float))
                gx = np.roll(B, -1, 1) - np.roll(B, 1, 1)
                gy = np.roll(B, -1, 0) - np.roll(B, 1, 0)
                shade = 0.55 + prt['gain'] * (gx * 0.6 + gy * 0.8) * 0.5
                yy = ys[M]
                y0, y1 = yy.min(), yy.max()
                rel = (ys - y0) / max(1, (y1 - y0))
                shade = shade + prt['vgrad'] * (0.5 - rel) + prt['light']
                thr = (BAYER4[ys % 4, xs % 4] - 0.5) * (0.85 if dither else 0.0)
                v = shade * (n - 1) + thr
                idx = np.clip(np.round(v), 0, n - 1).astype(int)
            cols = np.array(R, np.uint8)[idx]
            out[M, :3] = cols[M]
            out[M, 3] = 255

        if inner:
            pid = self.pid
            line = np.zeros((h, w), bool)
            for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                nb = np.roll(np.roll(pid, dy, 0), dx, 1)
                # evitar el wrap del roll
                if dy == 1: nb[0, :] = 0
                if dy == -1: nb[-1, :] = 0
                if dx == 1: nb[:, 0] = 0
                if dx == -1: nb[:, -1] = 0
                cand = (pid > 0) & (nb > pid)
                if cand.any():
                    for q in np.unique(nb[cand]):
                        if self.parts[q]['line']:
                            line |= cand & (nb == q)
            for p in ids:
                m = line & (self.pid == p)
                if m.any():
                    c = mix(self.parts[p]['ramp'][0], OUTLINE, 0.55)
                    out[m, :3] = c

        for m, col in self.details:
            out[m, :3] = col
            out[m, 3] = 255

        if outline is not None:
            a = out[..., 3] > 0
            nb = np.zeros_like(a)
            nb[1:, :] |= a[:-1, :]
            nb[:-1, :] |= a[1:, :]
            nb[:, 1:] |= a[:, :-1]
            nb[:, :-1] |= a[:, 1:]
            o = nb & ~a
            out[o, :3] = outline
            out[o, 3] = 255
        return out


# ---------------------------------------------------------------------------
# Guardado
# ---------------------------------------------------------------------------
def save_gif(rgba, path):
    """GIF de 1 cuadro con transparencia de 1 bit (indice 0)."""
    a = rgba[..., 3] > 127
    rgb = rgba[..., :3]
    cols = {}
    P8 = np.zeros(a.shape, np.uint8)
    flat = rgb.reshape(-1, 3)
    af = a.reshape(-1)
    pf = P8.reshape(-1)
    pal = [(255, 0, 255)]
    for i in range(flat.shape[0]):
        if not af[i]:
            continue
        c = tuple(int(v) for v in flat[i])
        if c not in cols:
            if len(pal) >= 256:
                # reduce: busca el mas parecido
                best = min(range(1, len(pal)), key=lambda j: sum((pal[j][k] - c[k]) ** 2 for k in range(3)))
                cols[c] = best
            else:
                cols[c] = len(pal)
                pal.append(c)
        pf[i] = cols[c]
    im = Image.fromarray(P8, 'P')
    flatpal = []
    for c in pal:
        flatpal += list(c)
    flatpal += [0] * (768 - len(flatpal))
    im.putpalette(flatpal)
    im.save(path, transparency=0, optimize=False)


def save_png(rgba, path):
    Image.fromarray(rgba, 'RGBA').save(path, optimize=True)


def compose(base, top, x, y):
    """Pega un RGBA (numpy) sobre otro respetando alfa binario."""
    h, w = top.shape[:2]
    H, W = base.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0:
        return base
    t = top[y0 - y:y1 - y, x0 - x:x1 - x]
    m = t[..., 3] > 127
    reg = base[y0:y1, x0:x1]
    reg[m] = t[m]
    return base


def upscale(rgba, k):
    return np.repeat(np.repeat(rgba, k, 0), k, 1)
