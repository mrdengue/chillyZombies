#!/usr/bin/env python3
"""
Regenera TODO el arte del juego en estilo LucasArts / VGA 1993.

    pip install pillow numpy
    python3 tools/build_art.py

Respeta nombre y tamano de cada imagen original (el motor usa el tamano
natural de la imagen para colisiones y posicionamiento), asi que la logica
del juego no cambia.
"""
import os
import sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixart import save_gif, save_png, compose, upscale, hexc, OUTLINE, P  # noqa: E402
from art_people import PLAYERS, ZOMBIES, player_sprite, zombie_sprite  # noqa: E402
from art_monsters import (zombiess_sprite, snowman_sprite, sheep_sprite,  # noqa: E402
                          dino_sprite, BOSSES)
import art_objects as ob  # noqa: E402
import art_scenes as sc  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
written = []


def out(name):
    return os.path.join(ROOT, name)


def gif(name, rgba, size=None):
    if size is not None:
        assert rgba.shape[1] == size[0] and rgba.shape[0] == size[1], (name, rgba.shape, size)
    save_gif(rgba, out(name))
    written.append(name)


def png(name, rgba):
    save_png(rgba, out(name))
    written.append(name)


def check_size(name, rgba):
    p = out(name)
    if os.path.exists(p):
        w, h = Image.open(p).size
        assert (rgba.shape[1], rgba.shape[0]) == (w, h), '%s: %sx%s != %sx%s' % (name, rgba.shape[1], rgba.shape[0], w, h)


def gif_keep(name, rgba):
    check_size(name, rgba)
    gif(name, rgba)


def png_keep(name, rgba):
    check_size(name, rgba)
    png(name, rgba)


# ---------------------------------------------------------------------------
def build_characters():
    for key, cfg in PLAYERS.items():
        gif_keep('anim_%s_idle.gif' % key, player_sprite(cfg, 'idle'))
        for f in range(4):
            gif_keep('anim_%s_walk_%02d.gif' % (key, f + 1), player_sprite(cfg, 'walk', f))
        gif_keep('anim_%s_gather.gif' % key, player_sprite(cfg, 'gather'))
        gif_keep('anim_%s_build.gif' % key, player_sprite(cfg, 'build'))
        gif_keep('anim_%s_dead.gif' % key, player_sprite(cfg, 'dead'))
    gif_keep('anim_player_selector.gif', ob.player_selector())

    for key, cfg in ZOMBIES.items():
        gif_keep('anim_%s_idle.gif' % key, zombie_sprite(cfg, 'idle'))
        for f in range(4):
            gif_keep('anim_%s_walk_%02d.gif' % (key, f + 1), zombie_sprite(cfg, 'walk', f))
        gif_keep('anim_%s_dead.gif' % key, zombie_sprite(cfg, 'dead'))

    gif_keep('anim_zombiess_idle.gif', zombiess_sprite('idle'))
    for f in range(4):
        gif_keep('anim_zombiess_walk_%02d.gif' % (f + 1), zombiess_sprite('walk', f))
    gif_keep('anim_zombiess_dead.gif', zombiess_sprite('dead'))

    gif_keep('anim_snowman_idle.gif', snowman_sprite('idle'))
    gif_keep('anim_snowman_walk_01.gif', snowman_sprite('walk', 0))
    gif_keep('anim_snowman_walk_02.gif', snowman_sprite('walk', 1))
    gif_keep('anim_snowman_dead.gif', snowman_sprite('dead'))

    gif_keep('anim_sheep_idle.gif', sheep_sprite('idle'))
    for f in range(4):
        gif_keep('anim_sheep_walk_%02d.gif' % (f + 1), sheep_sprite('walk', f))
    gif_keep('anim_sheep_dead.gif', sheep_sprite('dead'))

    for key, cfg in BOSSES.items():
        gif_keep('anim_%s_idle.gif' % key, dino_sprite(cfg, 'idle'))
        for f in range(4):
            gif_keep('anim_%s_walk_%02d.gif' % (key, f + 1), dino_sprite(cfg, 'walk', f))
        gif_keep('anim_%s_dead.gif' % key, dino_sprite(cfg, 'dead'))


def build_objects():
    gif_keep('anim_block_idle.gif', ob.brick_block(20, 20, 0))
    for n in (2, 3, 4):
        gif_keep('anim_blockx%dh_idle.gif' % n, ob.brick_block(20 * n, 20, n))
        gif_keep('anim_blockx%dv_idle.gif' % n, ob.brick_block(20, 20 * n, n + 10))
    gif_keep('anim_iceblock_idle.gif', ob.ice_block(20, 20, 0))
    for n in (2, 3, 4):
        gif_keep('anim_iceblockx%dh_idle.gif' % n, ob.ice_block(20 * n, 20, n))
        gif_keep('anim_iceblockx%dv_idle.gif' % n, ob.ice_block(20, 20 * n, n + 10))
    gif_keep('anim_shootingspot_idle.gif', ob.shooting_spot())
    gif_keep('anim_material_idle.gif', ob.material())
    gif_keep('anim_ammostation_idle.gif', ob.ammo_station())
    gif_keep('anim_snowpile_idle.gif', ob.snowpile())
    gif_keep('anim_prop_01_idle.gif', ob.prop01())
    gif_keep('anim_prop_02_idle.gif', ob.prop02())
    cam = ob.camera()
    gif_keep('anim_camera_idle.gif', cam)
    gif_keep('anim_camera_spritebar.gif', cam)
    gif_keep('anim_unknown.gif', ob.unknown())
    gif_keep('anim_weapon_firesock_idle.gif', ob.firesock())
    gif_keep('anim_weapon_snowball_idle.gif', ob.snowball())
    gif_keep('anim_weapon_firegift_idle.gif', ob.firegift())
    gif_keep('buttonaction_weapon_firesock.gif', ob.inv_icon('firesock'))
    gif_keep('buttonaction_weapon_snowball.gif', ob.inv_icon('snowball'))
    gif_keep('buttonaction_weapon_firegift.gif', ob.inv_icon('firegift'))
    gif_keep('control_action_selectedbutton.gif', ob.selected_frame())
    gif_keep('anim_textbubble_idle.gif', ob.text_bubble(False))
    gif_keep('anim_textbubble_selector.gif', ob.text_bubble(True))
    gif_keep('anim_textlabel_idle.gif', ob.text_label(False))
    gif_keep('anim_textlabel_selector.gif', ob.text_label(True))
    for k in ('speed', 'rapidfire', 'shield', 'ammo', 'freeze', 'damage', 'bomb', 'magnet'):
        png('sprites/powerup_%s.png' % k, sc.powerup(k))


# ---------------------------------------------------------------------------
# Escenas e interfaz
# ---------------------------------------------------------------------------
def _scene_small(w=240, h=160, seed_off=0):
    g = sc.ground_tile()
    return g[seed_off:seed_off + h, seed_off:seed_off + w].copy()


def _label(img, x, y, text, col='#ffffff'):
    sc.draw_text(img, (x, y), text, size=10, col=col, center=True)


def _tap(img, cx, cy, r=11):
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    d.ellipse([cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1], outline=OUTLINE)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=hexc('#ff4a4a'))
    d.ellipse([cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1], outline=OUTLINE)


def _dots(img, pts, col='#3a1458'):
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    (x0, y0), (x1, y1) = pts
    n = int(max(abs(x1 - x0), abs(y1 - y0)) / 3)
    for i in range(n + 1):
        t = i / max(1, n)
        d.point((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t), fill=hexc(col))


def build_tutorial():
    aiden = PLAYERS['player']
    tree = ob.shooting_spot()
    junk = ob.material()
    shop = ob.ammo_station()
    pages = [
        ("Meet Aiden. He fights zombies.", None),
        ("He can move between", "three stations."),
        ("To move, tap on him,", "then tap on any station."),
        ("From the Shooting Spot,", "tap anywhere to shoot."),
        ("Ammo running low?", "Make more at the workshop."),
        ("Workshop low on material?", "Get more at the junkyard."),
        ("Worry not! Aiden has", "friends to help him."),
    ]
    for i, (l1, l2) in enumerate(pages):
        base = _scene_small()
        compose(base, shop, 8, 34)
        compose(base, tree, 4, 62)
        compose(base, junk, 172, 72)
        im = Image.fromarray(base, 'RGBA')
        # banda de dialogo arriba (texto del color del personaje, como en SCUMM)
        arr = np.array(im)
        arr[:30, :, :3] = (arr[:30, :, :3] * 0.25 + np.array(hexc('#12081c')) * 0.75).astype(np.uint8)
        im = Image.fromarray(arr, 'RGBA')
        sc.draw_text(im, (120, 3), l1, size=11, col='#8ad8f8', center=True)
        if l2:
            sc.draw_text(im, (120, 15), l2, size=11, col='#8ad8f8', center=True)
        a = np.array(im)
        if i == 0:
            compose(a, player_sprite(aiden, 'idle'), 108, 82)
            im = Image.fromarray(a); _label(im, 120, 116, 'Aiden', '#8ab8ff')
        elif i == 1:
            compose(a, player_sprite(aiden, 'walk', 0), 120, 82)
            im = Image.fromarray(a)
            _label(im, 28, 52, 'Workshop', '#ffe070')
            _label(im, 36, 147, 'Shooting Spot', '#9cf060')
            _label(im, 202, 134, 'Junkyard', '#ff8a6e')
        elif i == 2:
            compose(a, player_sprite(aiden, 'idle'), 100, 82)
            compose(a, player_sprite(aiden, 'walk', 1), 140, 88)
            im = Image.fromarray(a)
            _tap(im, 112, 98)
            _tap(im, 202, 104, 16)
            _dots(im, [(124, 98), (186, 104)])
            _label(im, 112, 120, '1st tap', '#ff8a6e')
            _label(im, 202, 60, '2nd tap', '#ff8a6e')
        elif i == 3:
            compose(a, player_sprite(aiden, 'build'), 26, 116)
            compose(a, ob.snowball(), 96, 82)
            compose(a, snowman_sprite('idle'), 150, 70)
            im = Image.fromarray(a)
            _dots(im, [(48, 120), (100, 90)])
            _tap(im, 164, 90)
            _label(im, 164, 112, 'Tap!', '#ff8a6e')
            a = np.array(im)
            for k, ic in enumerate(('firesock', 'snowball', 'firegift')):
                compose(a, ob.inv_icon(ic), 82 + k * 32, 126)
            im = Image.fromarray(a)
            _label(im, 196, 134, 'Weapons', '#ffe070')
        elif i == 4:
            compose(a, player_sprite(aiden, 'build'), 20, 44)
            im = Image.fromarray(a)
            _tap(im, 32, 58, 14)
            _label(im, 70, 50, 'Tap!', '#ff8a6e')
        elif i == 5:
            compose(a, player_sprite(aiden, 'gather'), 196, 92)
            im = Image.fromarray(a)
            _dots(im, [(40, 110), (190, 104)])
            _tap(im, 205, 104, 18)
        elif i == 6:
            compose(a, player_sprite(aiden, 'idle'), 30, 116)
            compose(a, player_sprite(PLAYERS['player2'], 'idle'), 110, 56)
            compose(a, player_sprite(PLAYERS['player3'], 'idle'), 110, 100)
            im = Image.fromarray(a)
            _label(im, 122, 89, 'Carlo', '#ff8a6e')
            _label(im, 122, 133, 'Blair', '#e0ff70')
            sc.draw_text(im, (120, 146), 'Good luck!', size=12, col='#ffe070', center=True)
        big = upscale(np.array(im), 2)[:319, :479]
        png_keep('tutorial_screen_%02d.png' % (i + 1), big)


def build_ui():
    title = sc.title_scene()
    lg = sc.logo()
    png('title_bg.png', title)
    png('logo_dott.png', lg)
    png('ground_tile.png', sc.ground_tile())

    # Pantalla de carga / menu (480x320) = titulo + logo
    t2 = title.copy()
    small = lg[::1, ::1]
    scr = upscale(t2, 2)[40:360, 80:560].copy() if False else None
    full = Image.fromarray(title).resize((480, 300), Image.NEAREST)
    canvas = np.zeros((320, 480, 4), np.uint8)
    canvas[..., 3] = 255
    canvas[10:310] = np.array(full)
    compose(canvas, lg, (480 - lg.shape[1]) // 2, 14)
    png_keep('LoadingScreen.png', canvas)
    png_keep('MainMenu_Screen.png', canvas)

    def dimmed(header):
        bg = np.array(Image.fromarray(title).resize((480, 320), Image.NEAREST))
        bg[..., :3] = (bg[..., :3] * 0.45).astype(np.uint8)
        im = Image.fromarray(bg)
        sc.draw_text(im, (240, 10), header, size=24, col='#ffe070', center=True, bold=True)
        return np.array(im)

    png_keep('SelectLevel.png', dimmed('SELECT LEVEL'))
    png_keep('AboutScreen.png', dimmed('ABOUT'))

    def dialog(w, h, lines, col='#7af0a0'):
        a = sc.panel(w, h)
        im = Image.fromarray(a)
        y = 14
        for txt, size, c in lines:
            sc.draw_text(im, (w // 2, y), txt, size=size, col=c, center=True, bold=size > 16)
            y += size + 10
        return np.array(im)

    png_keep('CongratsDialog.png', dialog(300, 160, [('CONGRATS!', 28, '#ffe070'), ('You completed', 16, '#8ad8f8'), ('all the levels!', 16, '#8ad8f8')]))
    png_keep('GameOverSign.png', dialog(300, 160, [('GAME OVER', 30, '#ff6a5a')]))
    png_keep('PausedDialog.png', dialog(300, 160, [('PAUSED', 30, '#ffe070')]))
    png_keep('QuitConfirmDialog.png', dialog(300, 160, [('QUIT LEVEL?', 26, '#ffe070')]))
    png_keep('About_MainMenu.png', sc.button(143, 24, 'MAIN MENU'))
    png_keep('SelectLevel_MainMenu.png', sc.button(143, 24, 'MAIN MENU'))
    png_keep('CongratsDialogButton_Ok.png', sc.button(143, 24, 'OK'))
    png_keep('tutorial_button_back.png', sc.button(95, 24, '< BACK'))
    png_keep('tutorial_button_next.png', sc.button(95, 24, 'NEXT >'))
    png_keep('tutorial_button_mainmenu.png', sc.button(95, 24, 'MENU'))
    png_keep('GameOver_MainMenuButton.png', sc.button(72, 24, 'MENU'))
    png_keep('GameOver_RestartButton.png', sc.button(72, 24, 'RETRY'))
    png_keep('QuitConfirmDialog_No.png', sc.button(72, 24, 'NO'))
    png_keep('QuitConfirmDialog_Yes.png', sc.button(72, 24, 'YES', '#ff8a6e'))
    png_keep('PauseSign.png', sc.button(72, 24, 'PAUSE'))
    png_keep('QuitSign.png', sc.button(72, 24, 'QUIT'))
    png_keep('ScoreSign.png', sc.button(65, 16, 'SCORE'))
    png_keep('LevelSign.png', sc.button(65, 16, 'LEVEL'))
    png_keep('RalphGoodtimes_WebButton.png', sc.button(260, 32, 'www.ralphgoodtimes.com', '#8ad8f8'))
    strip = sc.panel(480, 24)
    png_keep('GameLevel_TopBackground.png', strip)

    act = sc.panel(45, 45, fill='#16602a', light='#7af0a0', dark='#06200c')
    png_keep('SelectLevel_Button_Active.png', act)
    ina = sc.panel(45, 45, fill='#2a2a3a', light='#6a6a80', dark='#0a0a12')
    from PIL import ImageDraw
    im = Image.fromarray(ina)
    d = ImageDraw.Draw(im)
    d.rectangle([17, 22, 28, 32], fill=hexc('#b08a10'), outline=OUTLINE)
    d.arc([18, 13, 27, 26], 180, 360, fill=hexc('#c8c8d8'), width=2)
    png_keep('SelectLevel_Button_Inactive.png', np.array(im))

    # snowstock (48x16): montoncito de nieve con bolas
    from pixart import Sprite
    s = Sprite(48, 16)
    p = s.part(P['snow'], vgrad=0.3)
    s.ell(p, 14, 11, 12, 4)
    s.ell(p, 11, 8, 6, 4)
    for x in (30, 38, 34):
        b = s.part(P['snow'], gain=2.0)
        s.ell(b, x, 10 if x != 34 else 6, 4, 4)
    png_keep('snowstock.png', s.render())

    # cursor de cruz estilo SCUMM (4 colores que ciclan, ver dott-fx.js)
    for i, col in enumerate(('#ffffff', '#ffe040', '#ff8a30', '#ffe040')):
        cur = np.zeros((31, 31, 4), np.uint8)
        c = np.array(hexc(col))
        for k in list(range(1, 12)) + list(range(19, 30)):
            for (x, y) in ((k, 15), (15, k)):
                for (dx, dy) in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    if cur[y + dy, x + dx, 3] == 0:
                        cur[y + dy, x + dx, :3] = OUTLINE
                        cur[y + dy, x + dx, 3] = 255
        for k in list(range(1, 12)) + list(range(19, 30)):
            for (x, y) in ((k, 15), (15, k)):
                cur[y, x, :3] = c
                cur[y, x, 3] = 255
        png('cursor_%d.png' % i, cur)

    # icono de la app 57x57
    ic = sc.panel(57, 57)
    z = upscale(zombie_sprite(ZOMBIES['zombie'], 'idle'), 2)
    compose(ic, z[6:56, :], 4, 4)
    png_keep('Icon.png', ic)


if __name__ == '__main__':
    build_characters()
    build_objects()
    build_ui()
    build_tutorial()
    print('%d archivos escritos' % len(written))
