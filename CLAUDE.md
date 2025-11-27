# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chilly Zombies is a browser-based tower defense game written in vanilla JavaScript (circa 2010). Players defend against waves of zombies by gathering materials, building weapons, and strategically placing defenses. The game features 34 levels with increasing difficulty, multiple player characters, various zombie types, and weapon systems.

## Running the Game

Open `index.html` in a web browser. The game is designed for mobile Safari but works in modern browsers. No build step or dependencies are required.

## Architecture

### Three-Layer Architecture

The codebase is organized into three main JavaScript files that form a clear separation of concerns:

1. **spriteengine.js** (137KB) - Core sprite engine
   - Generic 2D sprite engine with physics, animations, and rendering
   - Manages sprite lifecycle, collision detection, pathfinding, and movement
   - Provides animation system with multiple states (idle, walk, dead, etc.)
   - Handles camera system and sprite rendering
   - Frame-based animation loop (`SpriteHandler()` runs at configurable FPS)
   - Smart pathfinding with labyrinth solving for AI navigation

2. **gamelogic.js** (92KB) - Game-specific logic
   - Game state management and level progression
   - Player, zombie, and weapon mechanics
   - Scoring system and UI updates
   - Event handlers for user interactions
   - Bridges sprite engine with game rules
   - Main game loop in `Game_Frame()` function

3. **gamelevels.js** (88KB) - Level definitions
   - 34 level configurations as data structures
   - Each level defines: zombie spawn points, player positions, material locations, camera positions, and level constraints
   - Level comments at top describe progression and mechanics introduced

### Key Systems

**Sprite System**
- Sprites are created via `CreateSpriteObject(Type, X, Y)` in spriteengine.js
- Each sprite has: position, velocity, animations, collision properties, target behaviors
- Sprite types defined by animation naming convention: `anim_<type>_<state>.gif`
- Core sprite methods: `doDie()`, `doResurrect()`, `interactWith()`, `moveToTarget()`, `animate()`, `applyPhysics()`

**Game Flow**
- Entry point: `InitSpriteEngine()` called on body load (index.html:30)
- Game initialization: `Game_PreInitEngine()` then `Game_Init()` (gamelogic.js:1507)
- Main game loop: `Game_Frame()` called every frame (gamelogic.js:2248)
- Level loading: `Game_LoadLevel(Level, Transition)` (gamelogic.js:1619)

**Player Mechanics**
- 3 player types: Player, Player2, Player3 (different sprites)
- Players can: gather materials, build weapons, shoot at zombies
- Controlled by clicking ground to move or shooting spots to fire
- Base positions defined per level where players return after gathering

**Zombie/Enemy System**
- 5 zombie types defined in `Game_ZombieTypes` (gamelogic.js:67-74):
  - Snowman: Basic, worth 100 points, strength 1
  - NormalZombie: Basic, worth 100 points, strength 1
  - Zombiess: Stronger, worth 300 points, strength 2
  - Sheep: Weak, worth 50 points, strength 1
  - Dinosaur: Boss, worth 1000 points, strength 7
- Zombies spawn at predefined spots and pursue players
- Smart pathfinding avoids obstacles and finds optimal routes

**Weapon System**
- 3 weapon types in `Game_WeaponTypes` (gamelogic.js:76-81):
  - FireSock (Weapon01): Lifespan 55, strength 1
  - Snowball (Weapon02): Lifespan 40, strength 2
  - FireGift (Weapon03): Lifespan 35, strength 3
- Players build weapons using snow stock gathered from materials
- Weapons are projectiles with limited lifespan
- Max 5 weapons in air at once (`Game_MaxShotWeapons`)

**Level Structure**
Each level in `Game_LevelData` (gamelevels.js:36+) contains:
- `LevelTotalZombies`: Total zombies to defeat
- `ZombieSpawnList`: Array of zombie types to spawn
- `ZombieSpawnSpots`: Coordinates where zombies appear
- `PlayersList`: Starting positions for 1-3 players
- `MaterialPositionX/Y`: Where players gather resources
- `ShootingSpotX/Y`: Where players shoot from
- `LevelCameraX/Y`: Initial camera position
- `LabyrinthConstraints`: Boundary constraints for pathfinding
- `FramesPerSecond`: Performance tuning per level

**Coordinate System**
- Game world is much larger than viewport (480x260 visible area)
- Levels positioned in grid: Level 1 at (28*480, 0*260), etc.
- Camera system follows action within defined constraints
- Sprites beyond `gc_ActiveSpriteThreshold` (600px) are deactivated

## Code Conventions

**Naming**
- Global constants: `gc_PascalCase` (e.g., `gc_InitialFramesPerSecond`)
- Global variables: `g_PascalCase` (e.g., `g_FramesPerSecond`)
- Game variables: `Game_PascalCase` (e.g., `Game_CurrentLevel`)
- Sprite functions: `SpriteObjectFunct_camelCase` (e.g., `SpriteObjectFunct_doDie`)
- Game functions: `Game_PascalCase` (e.g., `Game_Start`)

**HTML/CSS Integration**
- Game screens managed by showing/hiding divs with `div_shown`/`div_hidden` classes
- Main screens: loading, main menu, level select, game, pause, game over, tutorial, about
- Sprite positioning via absolute CSS positioning in `sprites.css`
- UI elements have `id_` prefix (e.g., `id_div_loading`, `id_control_weapon_01`)

**Asset Loading**
- Images loaded via `LoadAnimImages()` in spriteengine.js
- Sounds managed by SoundManager2 library (external dependency at `/webgames/soundmanager/`)
- GIF animations for all sprite states

## Common Development Patterns

**Adding a New Level**
1. Add level object to `Game_LevelData` array in gamelevels.js
2. Increment `Game_MaxLevels` in gamelogic.js
3. Define spawn spots, player positions, and constraints
4. Set appropriate FPS for performance

**Adding a New Zombie Type**
1. Create animation GIFs: `anim_<type>_idle.gif`, `anim_<type>_walk_01-04.gif`, `anim_<type>_dead.gif`
2. Add entry to `Game_ZombieTypes` object in gamelogic.js
3. Reference new type in level `ZombieSpawnList` arrays

**Adding a New Weapon**
1. Create animation GIF: `anim_weapon_<name>_idle.gif` and button image
2. Add entry to `Game_WeaponTypes` and `Game_Ammo` objects
3. Add HTML control button in index.html control panel
4. Update weapon selection logic in `Game_SelectWeapon()`

**Modifying Game Physics**
- Constants at top of spriteengine.js: `gc_GroundFriction`, `gc_WalkFactor`, etc.
- Physics applied in `SpriteObjectFunct_applyPhysics()` function
- Collision detection in `Sprite_ApplyInteractions()`

## Technical Notes

- **Browser Compatibility**: Originally designed for iPhone/iPod (2010), uses Mobile Safari detection
- **No Build Tools**: Pure vanilla JavaScript, no transpilation or bundling
- **Frame Rate**: Configurable FPS (30-100), mobile devices use higher values (50-100)
- **Sound System**: Uses SoundManager2 library for cross-browser audio
- **Save System**: Uses cookies/localStorage for level unlocking and high scores
- **Performance**: Sprite activation threshold prevents off-screen sprite processing
- **Physics**: Custom physics engine with friction, bouncing, and velocity
- **Pathfinding**: A* style labyrinth solving for zombie AI
