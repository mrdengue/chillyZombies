# Contexto del Proyecto - Chilly Zombies

**Fecha:** 2025-11-28
**Estado:** Modernización completada - Sistema de guardado, high scores y power-ups implementados

---

## 🎮 Lo que se ha implementado

### 1. Sistema de Guardado (localStorage)
**Archivos:** `game-progress.js`
- ✅ Progresión de niveles bloqueados/desbloqueados
- ✅ Solo nivel 1 desbloqueado al inicio
- ✅ Debes completar un nivel para desbloquear el siguiente
- ✅ Integrado con `gamelogic.js` (función `Game_LevelComplete`)
- ✅ UI actualizada para mostrar niveles bloqueados en pantalla de selección

### 2. High Scores Estilo Atari
**Archivos:** `highscore-ui.js`, `highscore-ui.css`
- ✅ Entrada de 3 caracteres estilo arcade
- ✅ Top 10 mejores puntajes guardados en localStorage
- ✅ Auto-avance entre caracteres al escribir
- ✅ Auto-submit al completar 3 letras
- ✅ **UI sin texto:** Solo 3 cuadrados blancos (90x90px, fuente 60px) sobre imagen GameOverSign.png
- ✅ Notificaciones in-game (sin alerts de JavaScript)
- ✅ Tabla de high scores muestra nombre, puntaje y nivel

### 3. Sistema de Power-ups
**Archivos:** `powerups.js`, `powerups.css`
- ✅ 8 tipos de power-ups con rareza (común, poco común, raro, épico)
- ✅ **Activación por click** (no automática)
- ✅ Aparecen cada 15-30 segundos durante el juego
- ✅ Máximo 3 power-ups activos en pantalla
- ✅ Spawn dentro de límites del nivel (LabyrinthConstraints)
- ✅ Visuales: círculos de colores con letras (S, R, H, A, F, D, B, M)
- ✅ Notificaciones DENTRO del canvas (no fuera)
- ✅ UI de power-ups activos con timer en esquina superior izquierda

**Power-ups disponibles:**
- S = Speed Boost (amarillo) - Velocidad 2x, 10s
- R = Rapid Fire (naranja) - Disparo rápido, 12s
- H = Shield (cyan) - Invulnerable, 8s
- A = Mega Ammo (verde) - +50 Snow Stock, instantáneo
- F = Freeze (azul claro) - Congela zombies, 5s
- D = Double Damage (rojo) - Daño 2x, 12s
- B = Bomb (magenta) - Mata todos los zombies, instantáneo
- M = Magnet (morado) - Auto-recolecta materiales, 15s

### 4. Renderizado Pixel-Perfect
**Archivos:** `sprites.css`, `canvas-renderer.js`
- ✅ CSS `image-rendering: pixelated` en todos los sprites
- ✅ Canvas con `imageSmoothingEnabled = false`
- ✅ Look retro estilo Nintendo/SNES sin suavizado

### 5. Integración con Game Loop
**Archivos modificados:** `gamelogic.js`
- ✅ PowerupSystem.update() en Game_Frame() (línea ~2377)
- ✅ PowerupSystem.clearAll() en Game_RestartLevel() (línea ~1613)
- ✅ PowerupSystem.clearAll() en Game_GameOver() (línea ~2952)
- ✅ GameProgress.completeLevel() al completar nivel
- ✅ HighScoreUI.showHighScoreEntry() en game over si hay high score

---

## 📁 Estructura de Archivos

### Nuevos archivos creados:
```
game-progress.js       - Sistema de guardado y progresión
highscore-ui.js        - UI de entrada de high scores
highscore-ui.css       - Estilos para high scores
powerups.js            - Sistema completo de power-ups
powerups.css           - Estilos y animaciones de power-ups
CONTEXTO.md            - Este archivo
```

### Archivos modificados:
```
index.html             - Scripts y HTML para high scores
sprites.css            - Pixel-perfect rendering
gamelogic.js           - Integración de sistemas
canvas-renderer.js     - Ya tenía imageSmoothingEnabled = false
```

### Archivos deshabilitados (comentados):
```
retro-graphics.js      - Causaba problemas, deshabilitado
retro-styles.css       - Deshabilitado
```

---

## ⚙️ Cómo Funciona Todo

### Al iniciar el juego:
1. `game-progress.js` carga datos de localStorage
2. Solo nivel 1 está desbloqueado
3. Pantalla de selección muestra niveles bloqueados/desbloqueados

### Durante el juego:
1. Power-ups aparecen cada 15-30 segundos
2. Jugador hace **click** en power-up para activarlo
3. Aparece notificación dentro del canvas
4. Efectos se aplican al jugador
5. UI muestra power-ups activos con timer

### Al completar nivel:
1. `GameProgress.completeLevel()` se ejecuta
2. Nivel actual se marca como completado
3. Siguiente nivel se desbloquea
4. Datos se guardan en localStorage

### Al perder (Game Over):
1. Se verifica si el puntaje califica para top 10
2. Si califica: muestra pantalla de entrada (3 letras)
3. UI: Solo GameOverSign.png de fondo + 3 cuadrados blancos
4. Auto-submit al completar 3 letras
5. Muestra tabla de high scores

---

## 🐛 Problemas Resueltos

1. ✅ Emojis mostraban símbolos → Cambiados a letras
2. ✅ Power-ups fuera de pantalla → Usan LabyrinthConstraints
3. ✅ Power-ups spawn después de game over → Check de Game_GameIsOver
4. ✅ Notificación fuera del canvas → position: absolute en id_div_container
5. ✅ Letras no cabían en cuadrados → 90x90px con fuente 60px
6. ✅ Alerts de JavaScript → Notificaciones in-game
7. ✅ High score UI con texto → Solo 3 cuadrados sin texto

---

## 🚀 Próximos Pasos Sugeridos

### 🔥 PRIORIDAD MÁXIMA:
**High Scores Online (Servidor)**
- Implementar backend para guardar high scores en servidor
- API REST para GET/POST high scores
- Cualquier jugador puede romper los récords globales
- Leaderboard mundial visible para todos

**Tecnologías sugeridas:**
- Backend: Node.js + Express, Python + Flask, o PHP simple
- Base de datos: SQLite, PostgreSQL, o MySQL
- API endpoints:
  - GET /api/highscores - Obtener top 10/100 global
  - POST /api/highscores - Enviar nuevo puntaje
- Consideraciones:
  - Validación anti-cheating (verificar puntajes válidos)
  - Rate limiting para evitar spam
  - Timestamp de cuándo se logró el puntaje
  - Opcional: País/región del jugador

### Corto plazo:
1. **Controles táctiles mejorados** (pendiente de requerimientos)
   - Mejores botones para móvil
   - Joystick virtual
   - Gestos de deslizamiento

2. **Nuevos niveles** (usar estructura existente en gamelevels.js)
   - Agregar a Game_LevelData array
   - Definir spawn points, constraints, etc.

3. **Nuevos enemigos/zombies**
   - Crear sprites pixelados con Piskel/Aseprite
   - Nombrar: `anim_tipozombie_idle.gif`, `anim_tipozombie_walk_01.gif`, etc.
   - Agregar a Game_ZombieTypes en gamelogic.js

### Mediano plazo:
4. **Balanceo de power-ups**
   - Ajustar spawn rate si aparecen muy seguido/poco
   - Ajustar duraciones
   - Ajustar rareza

5. **Efectos visuales**
   - Partículas al recoger power-ups
   - Animaciones de power-ups activos
   - Feedback visual en zombies congelados

6. **Audio**
   - Sonidos específicos para cada power-up
   - Música de fondo variada por nivel

---

## 🛠️ Herramientas para Sprites Pixel Art

### Recomendadas:
- **Piskel** (gratis, web): https://www.piskelapp.com/
- **Aseprite** ($20): https://www.aseprite.org/
- **LibreSprite** (gratis): https://libresprite.github.io/

### Configuración para sprites:
```
Tamaño:     16x16, 24x24, 32x32, 48x48 px
Paleta:     Limitada (NES: 54 colores, SNES: 256)
Antialiasing: OFF
Outlines:   1-2 píxeles
Animación:  2-4 frames
```

### Nombrado de sprites:
```
anim_<tipo>_idle.gif
anim_<tipo>_walk_01.gif
anim_<tipo>_walk_02.gif
anim_<tipo>_dead.gif
```

---

## 📊 Estado del Proyecto

### Completado (100%):
- ✅ Sistema de guardado con progresión de niveles
- ✅ High scores estilo Atari con nombres de 3 letras
- ✅ Sistema de power-ups con 8 tipos
- ✅ Renderizado pixel-perfect
- ✅ Integración con game loop

### Pendiente:
- ⏳ Controles táctiles mejorados (sin especificar)
- ⏳ Nuevos niveles (estructura lista)
- ⏳ Nuevos enemigos (herramientas recomendadas)

---

## 💾 Datos Guardados en localStorage

```javascript
// Game Progress
{
  version: 1,
  highestLevelUnlocked: <número>,
  levelsCompleted: [1, 2, 3, ...],
  totalScore: <número>,
  playTime: <milisegundos>
}

// High Scores
[
  { name: "AAA", score: 50000, level: 10, date: "..." },
  { name: "BBB", score: 40000, level: 8, date: "..." },
  ...
]
```

---

## 🔧 Comandos Git

Para continuar mañana:
```bash
# Ver estado
git status

# Ver cambios
git log --oneline

# Leer este archivo
cat CONTEXTO.md
```

---

## 📝 Notas Importantes

1. **No usar retro-graphics.js** - Está deshabilitado porque causaba problemas
2. **Canvas en modo híbrido** - DOM + Canvas, no Canvas-only
3. **Power-ups por click** - No automáticos, requieren click del jugador
4. **High score sin texto** - Solo 3 cuadrados sobre imagen de game over
5. **Notificaciones in-game** - No usar alert(), usar elementos del DOM

---

## 🎯 Para mañana

**Leer este archivo y luego:**

### PRIORIDAD: High Scores Online
Implementar sistema de high scores en servidor para leaderboard global.

**Opciones adicionales:**
- Controles táctiles mejorados
- Nuevos niveles
- Nuevos enemigos
- Ajustes y balanceo

**El proyecto está funcional y listo para seguir expandiendo.**

---

## 🎨 Reskin "LucasArts 1993" (estilo Day of the Tentacle)

**La lógica del juego no cambió.** Solo cambian el arte, la interfaz y el sonido.

### Gráficos
- Todo el arte (sprites, objetos, interfaz, tutorial, fondos) se genera con
  `python3 tools/build_art.py` (requiere `pip install pillow numpy`).
  - `tools/pixart.py`: mini motor de pixel art (paleta VGA, sombreado con
    dithering Bayer, líneas interiores y contorno negro).
  - `tools/art_people.py`, `art_monsters.py`, `art_objects.py`, `art_scenes.py`:
    personajes, monstruos, objetos y escenas.
  - Cada imagen conserva **el mismo nombre y tamaño** que la original, porque el
    motor usa el tamaño natural de la imagen para colisiones (el script lo verifica).
- `dott-theme.css`: interfaz estilo SCUMM (paneles morados biselados, verbos en
  verde, fuente pixelada, cursor de cruz). Se carga después de `modern-layout.css`.
- `dott-fx.js`: capa de presentación:
  - pinta el suelo nevado (`ground_tile.png`) en el canvas siguiendo la cámara
    (el renderer original dibujaba en un canvas que no estaba en la página, por
    eso el fondo era blanco);
  - texto flotante y frases de los personajes en su color con contorno negro;
  - cursor que cicla colores; habilidades como verbos de texto.
- Fuentes en `fonts/` (Pixelify Sans OFL, Luckiest Guy Apache 2.0).

### Sonido
- `python3 tools/adlib_sfx.py` regenera los 13 `.mp3` con un sintetizador FM
  estilo AdLib/OPL2 (requiere numpy y ffmpeg).
- `adlib-music.js`: reproductor FM en tiempo real (Web Audio) con dos temas
  originales: `menu` y `level`. Cambia de tema según la pantalla visible, baja
  el volumen en pausa y la tecla **M** silencia la música.

### 📱 Modo vertical en móviles
- `fullscreen.js` detecta pantallas verticales (`body.mode-portrait`): la escena
  (480 de ancho = un nivel completo) se escala a todo el ancho y debajo va un
  panel táctil estilo SCUMM (inventario + verbos grandes). Teléfonos en
  horizontal usan el modo móvil (escena 480 de ancho), no el de escritorio.
- `spriteengine.js`: los listeners de toque ahora son `passive:false`. Antes el
  navegador los trataba como pasivos y cada toque contaba dos veces (Auto-aim,
  Turret y x1/x2 se activaban y desactivaban solos). La simulación de mouse se
  limita a la pantalla de juego; menús y diálogos usan toques nativos (scroll,
  teclado en las iniciales del récord) y se emite `click` para power-ups.
- Las ventanas de Personajes / Skill Tree / Leaderboard quedaban detrás del
  menú principal (z-index); ahora se ven.
