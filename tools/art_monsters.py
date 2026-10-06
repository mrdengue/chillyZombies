"""Monstruos: zombi larguirucho (Zombiess), muneco de nieve malvado, oveja zombi
y dinosaurios zombi (Dinosaur + Boss1..8)."""
from pixart import Sprite, P, C, mix, hexc


# ---------------------------------------------------------------------------
# ZOMBIESS 30x55 - estirado, con galera y levita (proporciones DOTT)
# ---------------------------------------------------------------------------
def zombiess_sprite(state, frame=0):
    s = Sprite(30, 55)
    skin = P['zlav']
    coat = P['purple']
    if state == 'dead':
        c = s.part([mix(x, (80, 80, 110), 0.4) for x in coat])
        s.poly(c, [(4, 50), (24, 46), (27, 51), (6, 53)])
        hd = s.part([mix(x, (80, 80, 110), 0.4) for x in skin])
        s.ell(hd, 6, 46, 4.5, 4)
        s.d_line(C['pupil'], [(4, 44), (6, 46)])
        s.d_line(C['pupil'], [(4, 46), (6, 44)])
        hat = s.part(P['black'])
        s.rect(hat, 19, 37, 25, 45)
        s.rect(hat, 17, 44, 27, 46)
        sp = s.part(P['white'], line=False, light=0.3)
        s.ell(sp, 13, 22, 5, 6)
        s.poly(sp, [(9, 24), (17, 24), (15, 34), (12, 31)])
        s.d_px(C['pupil'], 11, 21)
        s.d_px(C['pupil'], 15, 21)
        s.d_line(C['pupil'], [(12, 25), (14, 25)])
        return s.render()
    walk = [(0, -2, 1, 0), (-1, -1, 0, 0), (0, 0, 1, -2), (-1, 0, 0, -1)]
    if state == 'idle':
        bob, lfx, lfy, rfx, rfy = 0, -1, 0, 1, 0
    else:
        a, b, c_, d = walk[frame]
        bob = -1 if frame % 2 else 0
        lfx, lfy, rfx, rfy = a, b, c_, d
    cx = 14
    # piernas largas
    for side, fx, fy in ((-1, lfx, lfy), (1, rfx, rfy)):
        lg = s.part(P['black'])
        s.line(lg, [(cx + side * 2, 42 + bob), (cx + side * 2 + fx, 51 + fy)], 2)
        sh = s.part(P['brown'])
        s.ell(sh, cx + side * 2 + fx + 1.5, 52 + fy, 3, 1.5)
    # levita
    ct = s.part(coat)
    s.poly(ct, [(cx - 4, 17 + bob), (cx + 4, 17 + bob), (cx + 7, 44 + bob), (cx + 4, 42 + bob),
                (cx + 2, 45 + bob), (cx - 1, 42 + bob), (cx - 4, 45 + bob), (cx - 7, 43 + bob)])
    s.d_line(coat[0], [(cx, 19 + bob), (cx, 40 + bob)])
    tie = s.part(P['teal'])
    s.poly(tie, [(cx - 1, 17 + bob), (cx + 1, 17 + bob), (cx + 1.5, 26 + bob), (cx, 28 + bob), (cx - 1.5, 26 + bob)])
    # brazos larguisimos hacia adelante
    reach = [0, 1, 0, -1][frame] if state == 'walk' else 0
    a1 = s.part([mix(x, (0, 0, 0), 0.15) for x in coat])
    s.line(a1, [(cx - 3, 19 + bob), (cx + 10, 25 + bob + reach)], 2)
    a2 = s.part(coat)
    s.line(a2, [(cx + 3, 19 + bob), (cx + 13, 22 + bob - reach)], 2)
    for (hx, hy) in ((cx + 12, 25 + bob + reach), (cx + 14.5, 22 + bob - reach)):
        h = s.part(skin)
        s.ell(h, hx, hy, 1.6, 1.4)
        s.d_px(P['tooth'][2], hx + 2, hy + 1)
    # cabeza alargada
    hx, hy = cx, 10 + bob
    hd = s.part(skin, light=0.08)
    s.ell(hd, hx, hy, 5.5, 7)
    s.poly(hd, [(hx - 4, hy + 3), (hx + 4, hy + 3), (hx + 2, hy + 9), (hx - 2, hy + 9)])
    s.d_ell(P['yellow'][3], hx - 2.3, hy - 1, 1.6, 2)
    s.d_ell(P['yellow'][3], hx + 2.3, hy - 1, 1.6, 2)
    s.d_px(C['red_eye'], hx - 2, hy - 1)
    s.d_px(C['red_eye'], hx + 3, hy - 1)
    s.d_line(skin[0], [(hx - 4, hy - 4), (hx - 1, hy - 3)])
    s.d_line(skin[0], [(hx + 1, hy - 3), (hx + 4, hy - 4)])
    nose = s.part(skin, light=0.15)
    s.poly(nose, [(hx, hy), (hx + 3, hy + 4), (hx, hy + 4)])
    s.d_poly(C['mouth'], [(hx - 2, hy + 5), (hx + 2, hy + 5), (hx + 1, hy + 8), (hx - 1, hy + 8)])
    s.d_px(P['tooth'][2], hx - 1, hy + 5)
    s.d_px(P['tooth'][2], hx + 1, hy + 5)
    # galera
    hat = s.part(P['black'])
    s.poly(hat, [(hx - 4, hy - 5), (hx - 3, hy - 9 - 0), (hx + 4, hy - 10), (hx + 4, hy - 5)])
    s.rect(hat, hx - 7, hy - 6, hx + 7, hy - 5)
    band = s.part(P['red'], line=False)
    s.rect(band, hx - 4, hy - 7, hx + 4, hy - 6)
    return s.render()


# ---------------------------------------------------------------------------
# MUNECO DE NIEVE MALVADO 28x40
# ---------------------------------------------------------------------------
def snowman_sprite(state, frame=0):
    s = Sprite(28, 40)
    snow = P['snow']
    if state == 'dead':
        pud = s.part(snow, vgrad=0.4)
        s.ell(pud, 14, 34, 12, 4.5)
        s.ell(pud, 10, 31, 5, 3)
        s.ell(pud, 18, 32, 4, 2.5)
        hat = s.part(P['black'])
        s.rect(hat, 5, 21, 11, 28)
        s.rect(hat, 3, 28, 13, 29)
        car = s.part(P['carrot'])
        s.poly(car, [(16, 30), (24, 28), (16, 32)])
        s.d_px(P['coal'][2], 12, 34)
        s.d_px(P['coal'][2], 20, 35)
        s.d_px(P['coal'][2], 8, 36)
        return s.render()
    tilt = 0 if state == 'idle' else (-1 if frame == 0 else 1)
    hop = 0 if state == 'idle' else -1
    cx = 14
    b = s.part(snow)
    s.ell(b, cx, 31 + hop, 10, 7.5)
    m = s.part(snow)
    s.ell(m, cx + tilt * 0.5, 21 + hop, 7.5, 6)
    h = s.part(snow, light=0.05)
    s.ell(h, cx + tilt, 11 + hop, 6, 5.5)
    hx, hy = cx + tilt, 11 + hop
    # brazos de palo levantados
    for side in (-1, 1):
        ar = s.part(P['wood'], line=False)
        bx = cx + side * 7
        by = 20 + hop
        s.line(ar, [(bx, by), (bx + side * 4, by - 5 - (tilt * side)), (bx + side * 5, by - 9 - (tilt * side))], 1)
        s.line(ar, [(bx + side * 4, by - 5 - tilt * side), (bx + side * 6, by - 6 - tilt * side)], 1)
    # bufanda roja
    sc = s.part(P['red'])
    s.rect(sc, cx - 5, 15 + hop, cx + 5, 17 + hop)
    s.poly(sc, [(cx + 2, 16 + hop), (cx + 5, 23 + hop), (cx + 3, 24 + hop), (cx, 17 + hop)])
    # galera
    hat = s.part(P['black'])
    s.rect(hat, hx - 4, hy - 11, hx + 4, hy - 5)
    s.rect(hat, hx - 6, hy - 5, hx + 6, hy - 4)
    band = s.part(P['purple'], line=False)
    s.rect(band, hx - 4, hy - 7, hx + 4, hy - 6)
    # cara: cejas furiosas, ojos rojos, nariz zanahoria, boca de carbon
    s.d_line(P['coal'][0], [(hx - 4, hy - 3), (hx - 1, hy - 1)])
    s.d_line(P['coal'][0], [(hx + 4, hy - 3), (hx + 1, hy - 1)])
    s.d_px(C['red_eye'], hx - 2, hy)
    s.d_px(C['red_eye'], hx + 2, hy)
    car = s.part(P['carrot'])
    s.poly(car, [(hx, hy + 1), (hx + 8, hy + 2.5), (hx, hy + 3)])
    for i, dx in enumerate((-3, -1, 1, 3)):
        s.d_px(P['coal'][1], hx + dx, hy + 4 + (i % 2))
    # botones
    for y in (19, 22, 28):
        s.d_px(P['coal'][1], cx + tilt * 0.5, y + hop)
    return s.render()


# ---------------------------------------------------------------------------
# OVEJA ZOMBI 28x24
# ---------------------------------------------------------------------------
def sheep_sprite(state, frame=0):
    s = Sprite(28, 24)
    wool = P['white']
    face = P['zgrey']
    if state == 'dead':
        w = s.part(wool)
        for (x, y, r) in ((12, 15, 5), (17, 14, 5), (21, 16, 4), (9, 17, 4), (15, 18, 5)):
            s.ell(w, x, y, r, r - 0.5)
        for x in (10, 14, 18, 22):
            lg = s.part(P['black'])
            s.line(lg, [(x, 11), (x + (1 if x % 4 else -1), 5)], 1)
        hd = s.part(face)
        s.ell(hd, 5, 18, 4, 3.2)
        s.d_line(C['pupil'], [(3, 16), (5, 18)])
        s.d_line(C['pupil'], [(3, 18), (5, 16)])
        s.d_line(C['mouth'], [(2, 20), (5, 21)])
        return s.render()
    legs = [(0, 0, 0, 0), (1, -1, -1, 0), (0, 0, 0, 0), (-1, 0, 1, -1)]
    l = legs[frame] if state == 'walk' else (0, 0, 0, 0)
    bob = -1 if (state == 'walk' and frame % 2) else 0
    for i, x in enumerate((9, 12, 18, 21)):
        lg = s.part(P['black'])
        dx = l[i]
        s.line(lg, [(x, 15 + bob), (x + dx, 21)], 1)
        s.d_px(P['grey'][2], x + dx, 22)
    w = s.part(wool, gain=2.0)
    for (x, y, r) in ((11, 11, 5), (16, 9, 5.5), (21, 11, 5), (14, 14, 5), (19, 14, 4.5), (24, 13, 3)):
        s.ell(w, x, y + bob, r, r - 0.5)
    hd = s.part(face, light=0.05)
    s.ell(hd, 5.5, 10 + bob, 4.2, 4)
    s.poly(hd, [(2, 11 + bob), (6, 11 + bob), (5, 16 + bob), (2, 15 + bob)])
    ear = s.part(face)
    s.ell(ear, 9, 7 + bob, 2, 1.2)
    s.d_ell(P['yellow'][3], 4, 9 + bob, 1.4, 1.6)
    s.d_px(C['red_eye'], 4, 9 + bob)
    s.d_px(P['yellow'][2], 7, 10 + bob)
    s.d_line(C['mouth'], [(2, 14 + bob), (5, 14 + bob)])
    s.d_px(P['tooth'][3], 3, 14 + bob)
    s.d_line(P['zgreen'][1], [(13, 7 + bob), (14, 10 + bob)])  # mancha podrida
    s.d_px(P['zgreen'][2], 19, 13 + bob)
    return s.render()


# ---------------------------------------------------------------------------
# DINOSAURIO ZOMBI 56x82 (mira a la izquierda) + 8 jefes
# ---------------------------------------------------------------------------
BOSSES = {
    'dinosaur': dict(skin='green', belly='yellow', acc=None),
    'Boss1': dict(skin='teal', belly='white', acc='santa'),
    'Boss2': dict(skin='blue', belly='ice', acc='viking'),
    'Boss3': dict(skin='purple', belly='pink', acc='crown'),
    'Boss4': dict(skin='red', belly='orange', acc='scarf'),
    'Boss5': dict(skin='orange', belly='yellow', acc='tophat'),
    'Boss6': dict(skin='gold', belly='white', acc='patch'),
    'Boss7': dict(skin='brown', belly='wood', acc='antlers'),
    'Boss8': dict(skin='black', belly='grey', acc='flames'),
}


def dino_sprite(cfg, state, frame=0):
    s = Sprite(56, 82)
    skin = P[cfg['skin']]
    belly = P[cfg['belly']]
    if state == 'dead':
        gs = [mix(x, (90, 90, 120), 0.35) for x in skin]
        tail = s.part(gs)
        s.poly(tail, [(36, 66), (54, 72), (52, 76), (36, 74)])
        for x in (22, 32):
            lg = s.part(gs)
            s.line(lg, [(x, 62), (x + 2, 50)], 4)
            ft = s.part(gs)
            s.ell(ft, x + 2, 48, 4, 2.5)
        b = s.part(gs)
        s.ell(b, 28, 69, 16, 9)
        bl = s.part([mix(x, (90, 90, 120), 0.35) for x in belly])
        s.ell(bl, 28, 65, 11, 4)
        hd = s.part(gs)
        s.ell(hd, 10, 70, 9, 7)
        s.d_line(C['pupil'], [(7, 65), (11, 69)])
        s.d_line(C['pupil'], [(7, 69), (11, 65)])
        s.d_line(C['pupil'], [(3, 74), (9, 75)])
        tg = s.part(P['pink'])
        s.ell(tg, 4, 77, 2.5, 1.5)
        sp = s.part(P['white'], line=False, light=0.3)
        s.ell(sp, 26, 34, 7, 8)
        s.poly(sp, [(21, 37), (31, 37), (29, 50), (25, 46)])
        s.d_px(C['pupil'], 23, 33)
        s.d_px(C['pupil'], 28, 33)
        s.d_ell(C['pupil'], 25.5, 38, 1.5, 1)
        return s.render()

    if state == 'idle':
        bob, lf, rf = 0, (0, 0), (0, 0)
    else:
        seq = [((-3, 0), (3, -3)), ((-1, -1), (1, 0)), ((3, -3), (-3, 0)), ((1, 0), (-1, -1))]
        lf, rf = seq[frame]
        bob = -1 if frame % 2 else 0
    # cola
    tail = s.part(skin)
    s.poly(tail, [(38, 46 + bob), (54, 66), (55, 72), (50, 72), (36, 62 + bob)])
    # pierna trasera
    for (lx, ly, f, dark) in ((36, 60, rf, 0.25), (24, 62, lf, 0.0)):
        sk = [mix(x, (0, 0, 0), dark) for x in skin]
        th = s.part(sk)
        s.ell(th, lx, ly + bob, 7, 8)
        sh = s.part(sk)
        s.line(sh, [(lx, ly + 4 + bob), (lx - 1 + f[0], 75 + f[1])], 4)
        ft = s.part(sk)
        s.ell(ft, lx - 3 + f[0], 77 + f[1], 6, 2.5)
        for k in range(3):
            s.d_px(P['tooth'][2], lx - 8 + f[0] + k * 2, 78 + f[1])
    # cuerpo
    bd = s.part(skin)
    s.ell(bd, 31, 46 + bob, 15, 19)
    bl = s.part(belly, line=False, light=0.05)
    s.ell(bl, 25, 50 + bob, 8, 13)
    for k in range(5):
        s.d_line(belly[0], [(19, 41 + k * 4 + bob), (30, 41 + k * 4 + bob)])
    # costillas expuestas (zombi)
    s.d_poly(skin[0], [(36, 40 + bob), (42, 38 + bob), (43, 47 + bob), (37, 48 + bob)])
    for k in range(3):
        s.d_line(P['tooth'][2], [(37, 41 + k * 2 + bob), (42, 40 + k * 2 + bob)])
    # bracitos ridiculos
    ar = s.part(skin)
    s.line(ar, [(20, 36 + bob), (14, 40 + bob), (13, 43 + bob)], 3)
    s.d_px(P['tooth'][3], 12, 44 + bob)
    s.d_px(P['tooth'][3], 14, 44 + bob)
    # cabezota con mandibula abierta
    hx, hy = 20, 19 + bob
    hd = s.part(skin, light=0.05)
    s.ell(hd, hx, hy, 15, 10)
    s.ell(hd, hx + 10, hy + 6, 7, 8)  # cuello
    jaw = s.part([mix(x, (0, 0, 0), 0.15) for x in skin])
    jo = [0, 2, 0, 1][frame] if state == 'walk' else 0
    s.poly(jaw, [(6, hy + 7 + jo), (26, hy + 6), (26, hy + 13), (10, hy + 13 + jo)])
    s.d_poly(C['mouth'], [(6, hy + 4), (25, hy + 4), (25, hy + 7), (7, hy + 7 + jo)])
    for k in range(7):
        x = 7 + k * 2.7
        s.d_poly(P['tooth'][2], [(x, hy + 4), (x + 2, hy + 4), (x + 1, hy + 6)])
        s.d_poly(P['tooth'][1], [(x + 1, hy + 7 + jo), (x + 2.5, hy + 7 + jo * 0.5), (x + 2, hy + 5 + jo)])
    s.d_ell(P['pink'][2], 15, hy + 6 + jo * 0.5, 3, 1)
    # ojo saltón
    s.d_ell(P['eye'][2], hx + 1, hy - 4, 3.5, 4)
    s.d_px(P['eye'][3], hx, hy - 6)
    s.d_rect(C['pupil'], hx - 1, hy - 4, hx, hy - 2)
    s.d_line(skin[0], [(hx - 4, hy - 8), (hx + 4, hy - 9)], 2)
    # fosas nasales y costura
    s.d_px(skin[0], 7, hy - 2)
    s.d_px(skin[0], 9, hy - 3)
    s.d_line(skin[0], [(hx + 7, hy - 6), (hx + 11, hy - 1)])
    for k in range(3):
        s.d_px(skin[3], hx + 7 + k * 2, hy - 4 + k * 1)
    # placas en el lomo
    for k, (px_, py_) in enumerate(((33, 10), (40, 18), (45, 28), (47, 39), (47, 50))):
        sp = s.part(P['zgreen'] if cfg['skin'] != 'green' else P['moss'])
        s.poly(sp, [(px_ - 3, py_ + 3 + bob), (px_ + 2, py_ - 2 + bob), (px_ + 3, py_ + 4 + bob)])
    # accesorios del jefe
    acc = cfg.get('acc')
    if acc == 'santa':
        h = s.part(P['red'])
        s.poly(h, [(10, hy - 7), (30, hy - 9), (36, hy - 17), (40, hy - 12), (32, hy - 6), (12, hy - 4)])
        w = s.part(P['white'])
        s.rect(w, 9, hy - 8, 31, hy - 5)
        s.ell(w, 40, hy - 12, 3, 3)
    elif acc == 'viking':
        h = s.part(P['steel'], gain=2.2)
        s.ell(h, 22, hy - 7, 10, 5)
        s.rect(0, 10, hy - 4, 34, hy - 2) if False else None
        hn = s.part(P['white'])
        s.poly(hn, [(13, hy - 9), (6, hy - 16), (5, hy - 22), (9, hy - 16), (16, hy - 11)])
        s.poly(hn, [(30, hy - 10), (37, hy - 17), (38, hy - 23), (34, hy - 16), (28, hy - 12)])
    elif acc == 'crown':
        cr = s.part(P['gold'], gain=2.2)
        s.poly(cr, [(13, hy - 7), (13, hy - 15), (17, hy - 11), (21, hy - 17), (25, hy - 11), (29, hy - 15), (29, hy - 7)])
        s.d_px(P['red'][2], 21, hy - 10)
        s.d_px(P['teal'][3], 16, hy - 9)
        s.d_px(P['teal'][3], 26, hy - 9)
    elif acc == 'scarf':
        sc = s.part(P['white'])
        s.rect(sc, 26, hy + 12, 42, hy + 16)
        s.poly(sc, [(38, hy + 14), (46, hy + 26), (42, hy + 27), (35, hy + 16)])
        for k in range(4):
            s.d_line(P['red'][2], [(27 + k * 4, hy + 12), (27 + k * 4, hy + 16)])
    elif acc == 'tophat':
        th = s.part(P['black'])
        s.rect(th, 15, hy - 22, 27, hy - 9)
        s.rect(th, 10, hy - 10, 32, hy - 8)
        b = s.part(P['green'], line=False)
        s.rect(b, 15, hy - 13, 27, hy - 11)
        mon = s.part(P['gold'], line=False)
        s.ell(mon, hx + 1, hy - 4, 4.5, 4.5)
        s.d_ell(P['eye'][2], hx + 1, hy - 4, 3.5, 3.5)
        s.d_rect(C['pupil'], hx - 1, hy - 4, hx, hy - 2)
    elif acc == 'patch':
        s.d_ell(C['pupil'], hx + 1, hy - 4, 4, 4)
        s.d_line(C['pupil'], [(hx - 10, hy - 9), (hx + 14, hy - 1)])
        s.d_line(C['pupil'], [(hx - 6, hy - 3), (hx + 1, hy - 4)])
        bd2 = s.part(P['red'])
        s.ell(bd2, 22, hy - 8, 10, 3)
    elif acc == 'antlers':
        an = s.part(P['wood'], line=True)
        s.line(an, [(18, hy - 8), (14, hy - 18), (9, hy - 22)], 2)
        s.line(an, [(14, hy - 16), (18, hy - 23)], 2)
        s.line(an, [(26, hy - 9), (30, hy - 19), (36, hy - 22)], 2)
        s.line(an, [(30, hy - 17), (28, hy - 24)], 2)
        n = s.part(P['red'], line=True, light=0.2)
        s.ell(n, 6, hy - 1, 3, 2.5)
    elif acc == 'flames':
        for k, x in enumerate((14, 22, 30, 38)):
            f = s.part(P['flame'], line=False, light=0.1)
            ht = 9 if k % 2 else 6
            s.poly(f, [(x - 4, hy - 7 + k * 2), (x - 1, hy - 7 - ht + k * 2 + (frame % 2)), (x + 1, hy - 10 + k * 2), (x + 3, hy - 12 - ht // 2 + k * 2), (x + 4, hy - 6 + k * 2)])
        s.d_ell(C['red_eye'], hx + 1, hy - 4, 2.5, 2.5)
        s.d_px(P['yellow'][3], hx + 1, hy - 4)
    return s.render()
