// ===========================================================
// PROCEDURAL LEVEL GENERATION SYSTEM
// ===========================================================
// Generates infinite levels with increasing difficulty
// Boss levels every 10 levels (10, 20, 30, 40, etc.)
// ===========================================================

var ProceduralLevels = {

  // Base grid for level positioning
  baseGridX: 28,
  baseGridY: 0,
  gridWidth: 480,
  gridHeight: 260,

  // Zombie types by difficulty tier
  zombieTiers: {
    easy: ['Snowman', 'SnowZombie1', 'SnowZombie2', 'Sheep'],
    medium: ['NormalZombie', 'SnowZombie3', 'SnowZombie4', 'Zombiess'],
    hard: ['Zombiess', 'SnowZombie5', 'NormalZombie'],
    boss: ['Boss1', 'Boss2', 'Boss3', 'Boss4', 'Boss5', 'Boss6', 'Boss7', 'Boss8', 'Dinosaur']
  },

  // Player types available
  playerTypes: ['Player', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6', 'Player7', 'Player8', 'Player9'],

  // Decorative NPC types
  npcTypes: ['Dog', 'Penguin', 'Reindeer1', 'Reindeer2', 'NPC1', 'NPC2', 'NPC3', 'NPC4'],

  // Prop types
  propTypes: ['Prop01', 'Prop02'],

  /**
   * Generate a procedural level
   * @param {number} levelNumber - The level number to generate
   * @returns {object} Level configuration object
   */
  generateLevel: function(levelNumber) {

    // Every 10th level is a boss level
    if (levelNumber % 10 === 0) {
      return this.generateBossLevel(levelNumber);
    }

    // Regular procedural level
    return this.generateRegularLevel(levelNumber);
  },

  /**
   * Generate a boss-only level
   */
  generateBossLevel: function(levelNumber) {
    const bossCount = Math.floor(levelNumber / 10); // 1 boss at level 10, 2 at level 20, etc.
    const gridPos = this.getGridPosition(levelNumber);

    // Base coordinates
    const baseX = gridPos.x * this.gridWidth;
    const baseY = gridPos.y * this.gridHeight;

    // Spawn spots for bosses (spread them out)
    const spawnSpots = [];
    for (let i = 0; i < bossCount; i++) {
      spawnSpots.push([
        baseX + 50 + (i * 150) % 400,
        baseY + 30 + (i * 80) % 200
      ]);
    }

    // Player configuration (use multiple players for boss levels)
    const numPlayers = Math.min(3, Math.floor(levelNumber / 10));
    const playersList = this.generatePlayers(baseX, baseY, numPlayers);

    return {
      LevelNumber: levelNumber,
      LevelComments: `Boss Level ${levelNumber} - ${bossCount} Dinosaur(s)`,
      FramesPerSecond: 60,
      LevelTotalZombies: bossCount,
      StartSpawnTimeInSecs: 2,
      ZombieMaxSpawnTime: 3,
      ZombieSpawnList: Array(bossCount).fill(['Dinosaur', -1]),
      ZombieSpawnSpots: spawnSpots,

      MaterialPositionX: baseX + 50,
      MaterialPositionY: baseY + 100,

      AmmoX: baseX + 100,
      AmmoY: baseY + 150,

      ShootingSpotX: baseX + 400,
      ShootingSpotY: baseY + 130,

      LevelCameraX: baseX + 240,
      LevelCameraY: baseY + 130,

      LabyrinthConstraints: {
        X1: baseX,
        X2: baseX + this.gridWidth,
        Y1: baseY + 25,
        Y2: baseY + this.gridHeight
      },

      PlayersList: playersList,

      SnowStock: 50 + (bossCount * 20),

      Ammo: {
        Weapon01: 10 + (bossCount * 5),
        Weapon02: 5 + (bossCount * 3),
        Weapon03: 3 + (bossCount * 2)
      },

      Props: this.generateProps(baseX, baseY, 3 + bossCount),
      Blocks: [],

      InGameTip: `BOSS LEVEL! Defeat ${bossCount} Dinosaur${bossCount > 1 ? 's' : ''}!`,
      InGameTipX: baseX + 200,
      InGameTipY: baseY + 30,

      // Add decorative NPCs
      DecorativeNPCs: this.generateDecorativeNPCs(baseX, baseY, 2)
    };
  },

  /**
   * Generate a regular procedural level
   */
  generateRegularLevel: function(levelNumber) {
    const gridPos = this.getGridPosition(levelNumber);
    const baseX = gridPos.x * this.gridWidth;
    const baseY = gridPos.y * this.gridHeight;

    // Calculate difficulty based on level number
    const difficulty = this.calculateDifficulty(levelNumber);

    // Determine zombie composition
    const zombieComposition = this.getZombieComposition(levelNumber, difficulty);
    const totalZombies = zombieComposition.count;

    // Generate spawn spots
    const spawnSpots = this.generateSpawnSpots(baseX, baseY, totalZombies);

    // Generate player configuration
    const numPlayers = this.getPlayerCount(levelNumber);
    const playersList = this.generatePlayers(baseX, baseY, numPlayers);

    // Generate props and blocks
    const numProps = 2 + Math.floor(Math.random() * 4);
    const numBlocks = Math.floor(difficulty.blockChance * 8);

    // Generate material and shooting positions
    const positions = this.generatePositions(baseX, baseY, levelNumber);

    return {
      LevelNumber: levelNumber,
      LevelComments: `Procedural Level ${levelNumber} - Difficulty ${difficulty.tier}`,
      FramesPerSecond: 50 + Math.min(20, Math.floor(levelNumber / 5)),
      LevelTotalZombies: totalZombies,
      StartSpawnTimeInSecs: Math.max(0.5, 2 - (levelNumber * 0.02)),
      ZombieMaxSpawnTime: Math.max(0.8, 2.5 - (levelNumber * 0.03)),
      ZombieSpawnList: zombieComposition.spawnList,
      ZombieSpawnSpots: spawnSpots,

      MaterialPositionX: positions.material.x,
      MaterialPositionY: positions.material.y,

      AmmoX: positions.ammo.x,
      AmmoY: positions.ammo.y,

      ShootingSpotX: positions.shooting.x,
      ShootingSpotY: positions.shooting.y,

      LevelCameraX: baseX + 240,
      LevelCameraY: baseY + 130,

      LabyrinthConstraints: {
        X1: baseX,
        X2: baseX + this.gridWidth,
        Y1: baseY + 25,
        Y2: baseY + this.gridHeight
      },

      PlayersList: playersList,

      SnowStock: Math.floor(20 + (levelNumber * 2) + (Math.random() * 10)),

      Ammo: {
        Weapon01: Math.floor(15 + (levelNumber * 0.5)),
        Weapon02: Math.floor(5 + (levelNumber * 0.3)),
        Weapon03: Math.floor(2 + (levelNumber * 0.2))
      },

      Props: this.generateProps(baseX, baseY, numProps),
      Blocks: this.generateBlocks(baseX, baseY, numBlocks),

      InGameTip: this.getRandomTip(levelNumber),
      InGameTipX: baseX + 200,
      InGameTipY: baseY + 30,

      // Add decorative NPCs
      DecorativeNPCs: this.generateDecorativeNPCs(baseX, baseY, 1 + Math.floor(Math.random() * 3))
    };
  },

  /**
   * Calculate difficulty parameters based on level number
   */
  calculateDifficulty: function(levelNumber) {
    const normalizedLevel = levelNumber % 10; // 0-9 within each set of 10

    let tier = 'easy';
    let zombieMultiplier = 1.0;
    let blockChance = 0.1;

    if (levelNumber < 5) {
      tier = 'easy';
      zombieMultiplier = 1.0;
      blockChance = 0.1;
    } else if (levelNumber < 10) {
      tier = 'easy-medium';
      zombieMultiplier = 1.2;
      blockChance = 0.2;
    } else if (levelNumber < 20) {
      tier = 'medium';
      zombieMultiplier = 1.5;
      blockChance = 0.3;
    } else if (levelNumber < 30) {
      tier = 'medium-hard';
      zombieMultiplier = 1.8;
      blockChance = 0.4;
    } else {
      tier = 'hard';
      zombieMultiplier = 2.0 + (levelNumber - 30) * 0.1;
      blockChance = 0.5;
    }

    return {
      tier: tier,
      zombieMultiplier: zombieMultiplier,
      blockChance: blockChance,
      normalizedLevel: normalizedLevel
    };
  },

  /**
   * Get zombie composition for a level
   */
  getZombieComposition: function(levelNumber, difficulty) {
    const baseCount = 5 + Math.floor(levelNumber * 0.8);
    const totalCount = Math.floor(baseCount * difficulty.zombieMultiplier);

    const spawnList = [];
    let tier = 'easy';

    // Determine zombie tier mix based on level
    if (levelNumber < 5) {
      tier = 'easy';
    } else if (levelNumber < 15) {
      tier = 'medium';
    } else {
      tier = 'hard';
    }

    // Get zombie types for this tier
    let zombiePool = this.zombieTiers[tier];

    // Add some variety by mixing in adjacent tiers
    if (levelNumber >= 5 && Math.random() > 0.5) {
      zombiePool = zombiePool.concat(this.zombieTiers.easy);
    }
    if (levelNumber >= 15 && Math.random() > 0.5) {
      zombiePool = zombiePool.concat(this.zombieTiers.medium);
    }

    // Generate spawn list
    for (let i = 0; i < totalCount; i++) {
      const zombieType = zombiePool[Math.floor(Math.random() * zombiePool.length)];
      spawnList.push([zombieType, -1]);
    }

    return {
      count: totalCount,
      spawnList: spawnList
    };
  },

  /**
   * Generate spawn spots for zombies
   */
  generateSpawnSpots: function(baseX, baseY, count) {
    const spots = [];
    const side = Math.random() > 0.5 ? 'left' : 'right';

    for (let i = 0; i < Math.max(count, 8); i++) {
      if (side === 'left') {
        spots.push([baseX + (Math.random() * 80), baseY + 20 + (i * 30) % 220]);
      } else {
        spots.push([baseX + 400 + (Math.random() * 80), baseY + 20 + (i * 30) % 220]);
      }
    }

    return spots;
  },

  /**
   * Generate player configuration
   */
  generatePlayers: function(baseX, baseY, count) {
    const playersList = {};
    const startX = baseX + 200;
    const startY = baseY + 100;

    for (let i = 1; i <= count; i++) {
      const playerType = this.playerTypes[Math.floor(Math.random() * this.playerTypes.length)];
      playersList[i] = {
        X: startX + ((i - 1) * 40),
        Y: startY + ((i - 1) * 20),
        BaseX: startX + 200,
        BaseY: startY + 80 + ((i - 1) * 25),
        Type: playerType
      };
    }

    return playersList;
  },

  /**
   * Get number of players for level
   */
  getPlayerCount: function(levelNumber) {
    if (levelNumber < 5) return 1;
    if (levelNumber < 15) return 2;
    return 3;
  },

  /**
   * Generate positions for materials, ammo, and shooting spots
   */
  generatePositions: function(baseX, baseY, levelNumber) {
    // Randomize layout
    const layout = Math.floor(Math.random() * 3);

    let material, ammo, shooting;

    switch (layout) {
      case 0: // Material on left, shooting on right
        material = { x: baseX + 50, y: baseY + 100 };
        ammo = { x: baseX + 100, y: baseY + 150 };
        shooting = { x: baseX + 400, y: baseY + 130 };
        break;
      case 1: // Material on right, shooting on left
        material = { x: baseX + 400, y: baseY + 100 };
        ammo = { x: baseX + 350, y: baseY + 150 };
        shooting = { x: baseX + 80, y: baseY + 130 };
        break;
      case 2: // Material in center
        material = { x: baseX + 240, y: baseY + 50 };
        ammo = { x: baseX + 240, y: baseY + 200 };
        shooting = { x: baseX + 100, y: baseY + 130 };
        break;
    }

    return { material, ammo, shooting };
  },

  /**
   * Generate decorative props
   */
  generateProps: function(baseX, baseY, count) {
    const props = [];

    for (let i = 0; i < count; i++) {
      const propType = this.propTypes[Math.floor(Math.random() * this.propTypes.length)];
      props.push({
        Type: propType,
        X: baseX + 20 + Math.floor(Math.random() * 440),
        Y: baseY + 20 + Math.floor(Math.random() * 220)
      });
    }

    // Add 2-3 collectible snow piles per level
    var snowPileCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < snowPileCount; i++) {
      props.push({
        Type: 'SnowPile',
        X: baseX + 50 + Math.floor(Math.random() * 380),
        Y: baseY + 30 + Math.floor(Math.random() * 200)
      });
    }

    return props;
  },

  /**
   * Generate obstacle blocks
   */
  generateBlocks: function(baseX, baseY, count) {
    const blocks = [];
    const blockTypes = ['Block01', 'IceBlock'];

    for (let i = 0; i < count; i++) {
      const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
      blocks.push({
        Type: blockType,
        X: baseX + 100 + Math.floor(Math.random() * 280),
        Y: baseY + 60 + Math.floor(Math.random() * 140),
        Width: 40,
        Height: 40
      });
    }

    return blocks;
  },

  /**
   * Generate decorative NPCs (animals and villagers)
   */
  generateDecorativeNPCs: function(baseX, baseY, count) {
    const npcs = [];

    for (let i = 0; i < count; i++) {
      const npcType = this.npcTypes[Math.floor(Math.random() * this.npcTypes.length)];
      npcs.push({
        Type: npcType,
        X: baseX + 50 + Math.floor(Math.random() * 380),
        Y: baseY + 30 + Math.floor(Math.random() * 200)
      });
    }

    return npcs;
  },

  /**
   * Get grid position for level number
   */
  getGridPosition: function(levelNumber) {
    const row = Math.floor(levelNumber / 10);
    const col = levelNumber % 10;

    return {
      x: this.baseGridX + col,
      y: this.baseGridY + row
    };
  },

  /**
   * Get random tip for level
   */
  getRandomTip: function(levelNumber) {
    const tips = [
      'Gather materials to build weapons!',
      'Tap zombies to shoot at them.',
      'Build stronger weapons for tough enemies.',
      'Watch your ammo count!',
      'Collect snow stock from materials.',
      'Different weapons have different strength.',
      'Plan your shots carefully!',
      'Some zombies are stronger than others.',
      'Use the shooting spot to aim.',
      'Work together with multiple players!'
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  },

  /**
   * Get level data - either from predefined levels or generate procedurally
   */
  getLevel: function(levelNumber) {
    // If we have predefined levels, use them first
    if (typeof Game_LevelData !== 'undefined' && levelNumber <= Game_LevelData.length) {
      return Game_LevelData[levelNumber - 1];
    }

    // Otherwise generate procedurally
    return this.generateLevel(levelNumber);
  }
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProceduralLevels;
}
