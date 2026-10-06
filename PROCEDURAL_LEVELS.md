# Sistema de Niveles Procedurales - Chilly Zombies

## Resumen

El juego ahora soporta **niveles infinitos** generados proceduralmente después de completar los 34 niveles predefinidos. El sistema crea niveles únicos con dificultad creciente y niveles de jefe cada 10 niveles.

## Características Principales

### 1. Generación Procedural
- **Niveles infinitos**: Después del nivel 34, los niveles se generan automáticamente
- **Dificultad progresiva**: Más zombies, enemigos más fuertes, y layouts más desafiantes
- **Variedad**: Cada nivel tiene un layout único con diferentes posiciones de materiales, zombies, y obstáculos

### 2. Niveles de Jefe (Boss Levels)
- **Cada 10 niveles**: Los niveles 10, 20, 30, 40, etc. son niveles de jefe
- **Múltiples jefes**:
  - Nivel 10: 1 Dinosaurio
  - Nivel 20: 2 Dinosaurios
  - Nivel 30: 3 Dinosaurios
  - Y así sucesivamente...
- **Mejor equipamiento**: Los niveles de jefe proporcionan más munición y stock de nieve

### 3. Nuevos Tipos de Zombies

Se agregaron 5 variantes nuevas de zombies de nieve:

- **SnowZombie1**: Valor 120, Fuerza 1 (básico)
- **SnowZombie2**: Valor 120, Fuerza 1 (básico)
- **SnowZombie3**: Valor 150, Fuerza 2 (medio)
- **SnowZombie4**: Valor 150, Fuerza 2 (medio)
- **SnowZombie5**: Valor 180, Fuerza 2 (fuerte)

### 4. Nuevos Personajes

Se agregaron 6 nuevos personajes jugables:

- Player4 (Rojo)
- Player5 (Verde)
- Player6 (Audífonos)
- Player7 (Naranja)
- Player8 (Azul)
- Player9 (Rosa)

Estos personajes se asignan aleatoriamente en los niveles procedurales.

### 5. NPCs Decorativos

Los niveles procedurales incluyen NPCs decorativos que no interactúan pero añaden vida al juego:

**Animales:**
- Dog (Perro con bufanda roja)
- Penguin (Pingüino con bufanda roja)
- Reindeer1 y Reindeer2 (Renos variantes)

**Villanos/Comerciantes:**
- NPC1, NPC2, NPC3, NPC4 (Villagers)

Estos NPCs son fantasmas (no colisionan) y simplemente añaden ambiente visual.

### 6. Animaciones de Muerte

Se agregaron múltiples animaciones de muerte:
- `anim_EnemyDeath_dead.gif` - Explosión blanca/hielo para enemigos
- `anim_HeroDeath1_dead.gif` a `anim_HeroDeath8_dead.gif` - Explosiones naranjas/fuego para héroes

## Sistema de Dificultad

### Tiers de Dificultad

El sistema divide los zombies en tiers:

- **Easy** (Niveles 1-4): Snowman, SnowZombie1, SnowZombie2, Sheep
- **Medium** (Niveles 5-14): NormalZombie, SnowZombie3, SnowZombie4, Zombiess
- **Hard** (Niveles 15+): Zombiess, SnowZombie5, NormalZombie en mayor cantidad

### Progresión de Dificultad

- **Número de zombies**: Aumenta con cada nivel (fórmula: 5 + nivel × 0.8 × multiplicador)
- **Multiplicador de dificultad**:
  - Niveles 1-4: 1.0x
  - Niveles 5-9: 1.2x
  - Niveles 10-19: 1.5x
  - Niveles 20-29: 1.8x
  - Niveles 30+: 2.0x + crecimiento adicional

- **Velocidad de spawn**: Disminuye progresivamente (enemigos aparecen más rápido)
- **FPS**: Aumenta con el nivel para mejor rendimiento (50-70 FPS)

### Layouts Variados

Los niveles procedurales tienen 3 tipos de layouts aleatorios:

1. **Layout 0**: Material a la izquierda, shooting spot a la derecha
2. **Layout 1**: Material a la derecha, shooting spot a la izquierda
3. **Layout 2**: Material en el centro, layout desafiante

### Obstáculos y Decoración

- **Props**: 2-6 objetos decorativos (árboles, rocas) por nivel
- **Bloques**: 0-8 bloques de hielo/normales que obstruyen el camino
- **Bloques aumentan con dificultad**: Más bloques en niveles difíciles

## Implementación Técnica

### Archivos Modificados/Creados

1. **procedurallevels.js** (NUEVO)
   - Contiene toda la lógica de generación procedural
   - Objeto `ProceduralLevels` con métodos de generación

2. **gamelogic.js** (MODIFICADO)
   - `Game_ZombieTypes`: Agregados 5 nuevos tipos de zombies de nieve
   - `Player_Sounds`: Agregados sonidos para Player4-9
   - `Game_LoadLevel()`: Modificado para usar generación procedural cuando el nivel > 34
   - Agregado soporte para `DecorativeNPCs` en carga de nivel

3. **index.html** (MODIFICADO)
   - Agregado script `procedurallevels.js` antes de `gamelogic.js`

### Sprites Integrados

Todos los sprites están en `/home/jorge/chilly/` en formato GIF:

**Jugadores:**
- anim_Player4_idle.gif - anim_Player9_idle.gif

**Zombies:**
- anim_SnowZombie1_idle.gif - anim_SnowZombie5_idle.gif

**Muerte:**
- anim_EnemyDeath_dead.gif
- anim_HeroDeath1_dead.gif - anim_HeroDeath8_dead.gif

**Animales:**
- anim_Dog_idle.gif
- anim_Penguin_idle.gif
- anim_Reindeer1_idle.gif
- anim_Reindeer2_idle.gif

**NPCs:**
- anim_NPC1_idle.gif - anim_NPC4_idle.gif

## Cómo Funciona

1. **Niveles 1-34**: Se cargan desde `Game_LevelData` (predefinidos)

2. **Nivel 35+**: Se generan proceduralmente:
   ```javascript
   if (Level <= Game_LevelData.length) {
     LevelData = Game_LevelData[Level - 1];
   } else {
     LevelData = ProceduralLevels.generateLevel(Level);
   }
   ```

3. **Niveles de Jefe**: Detectados automáticamente
   ```javascript
   if (levelNumber % 10 === 0) {
     return this.generateBossLevel(levelNumber);
   }
   ```

4. **NPCs Decorativos**: Se crean como sprites fantasma
   ```javascript
   ThisNPCSprite.setGhost(true);
   ThisNPCSprite.isDecorativeNPC = true;
   ```

## Grid de Posicionamiento

Los niveles se posicionan en una cuadrícula virtual:

- **Nivel 1**: Grid (28, 0)
- **Nivel 10**: Grid (28, 1)
- **Nivel 20**: Grid (28, 2)
- etc.

Cada celda de grid es 480×260 pixels.

## Próximos Pasos

Cuando recibas los sprites de jefes adicionales:

1. Agregar nuevos tipos de jefes a `Game_ZombieTypes`
2. Actualizar `zombieTiers.boss` en `procedurallevels.js`
3. Modificar `generateBossLevel()` para variar los tipos de jefe

## Tips de Juego

- **Los niveles de jefe** son más difíciles - acumula munición en niveles previos
- **Niveles procedurales** nunca se repiten - cada playthrough es único
- **NPCs decorativos** no te afectarán - son solo visuales
- **La dificultad escala infinitamente** - ¿hasta qué nivel puedes llegar?

## Debugging

Para ver logs de generación procedural:
```javascript
console.log('[PROCEDURAL] Generated level', Level, ':', LevelData.LevelComments);
console.log('[NPC] Spawned decorative NPC:', ThisNPC.Type);
```

Abre la consola del navegador (F12) para ver estos mensajes.
