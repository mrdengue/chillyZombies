var Game_CurrentLevel = 1;
var Game_CurrentLevelFramesPerSecond = gc_MobileInitialFramesPerSecond;
var Game_NewHighScore                = false;
var Game_HighScore    = 1000;
var Game_MaxLevels    = 34;
var Game_ZombieLevelSpawnCountMax = 0.75;
var Game_Score;
var Game_SnowStock;
var Game_PlayersArray;
var Game_NumberOfPlayers;
var Game_Zombies;
var Game_Players;
var Game_Weapons;
var Game_PlayerStocCapacity     = 100;
var Game_PlayerBuildCapacity    = 100;
var Game_UpdateCountersTimer    = 0;
var Game_UpdateZombieObjectives = 0;
var Game_PlayerShooter = null;

var Game_LabyrinthConstraints;

var Game_LevelTotalZombies;
var Game_ZombieSpawnSpots;
var Game_IntermittentBlocks;
var Game_IntermittentBlockCount;
var Game_IntermittentBlockCountMax;
var Game_IntermittentBlockShown;
var Game_TypesWith_IntermittentBlockExclusion;
var Game_ZombiesInGame;
var Game_ZombieTotalSpawnCount;
var Game_MaxZombiesInGame    = 9;
var Game_ZombieSpawnCountMax;
var Game_ZombieSpawnCount;
var Game_ZombieSpawnList;
var Game_NextZombieSpawnIndex;
var Game_CurrentZombieSpawnType;

var Game_InGameTipLabel = null;
var Game_InGameTipDisplayTime = -1;

var Game_GameIsOver = false;

// Combo system
var Game_ComboCount = 0;
var Game_ComboTimer = 0;
var Game_ComboTimeoutFrames = 0; // Set on level load based on FPS
var Game_ComboMultiplier = 1;
var Game_ZombiesKilledThisLevel = 0;

// Critical hit system
var Game_CriticalHitChance = 0.15; // 15%
var Game_CriticalHitMultiplier = 2;

// Kill streak system
var Game_KillStreak = 0;
var Game_KillStreakBest = 0;
var Game_KillStreakThresholds = [5, 10, 20, 50];

// Weapon upgrade system
var Game_WeaponKills = { Weapon01: 0, Weapon02: 0, Weapon03: 0 };
var Game_WeaponLevels = { Weapon01: 1, Weapon02: 1, Weapon03: 1 };
var Game_WeaponKillsPerLevel = 50;

// Star rating system
var Game_LevelStars = {};
var Game_LevelStartTime = 0;
var Game_LevelDamageTaken = 0;
var Game_LevelShotsFired = 0;
var Game_LevelShotsHit = 0;

// Snow particles
var Game_SnowParticles = [];

// Speed control
var Game_SpeedMultiplier = 1;
var Game_BaseFramesPerSecond = 0;

// Auto-shoot
var Game_AutoShootEnabled = false;
var Game_AutoShootTimer = 0;

// Achievements
var Game_Achievements = {};
var Game_TotalKills = 0;

// Shop upgrades (persistent)
var Game_ShopUpgrades = { playerHP: 0, playerSpeed: 0, weaponDmg: 0, gatherSpeed: 0, turretDiscount: 0 };

var Game_TurretMode = false;
var Game_SystemsTimer = 0;

var Game_TutorialPage;
var Game_TutorialMaxPages = 7;

var Game_BaseX;
var Game_BaseY;
var Game_BaseWidth;
var Game_BaseHeight;

var Game_Camera = null;
var Game_LevelCameraX = 0;
var Game_LevelCameraY = 0;

var Game_LevelStarted = false;
var Game_CountdownActive = false;
var Game_LevelComplete = 0;
var Game_CreatePlayers;

var Game_TriggerFrameStop               = false;
var Game_NumberOfPlayersInLastLevel;
var Game_PlayersInLastLevel;

var Game_UserPaused = false;

var Game_TooltipTime    = 0;
var Game_TooltipMaxTime = 0;

var Game_ZombieTypes =
              {
                NormalZombie: { SpriteType: 'Zombie', Worth: 100, Strength: 1, SpawnSound: 'spawned_zombie' },
                Snowman:      { SpriteType: 'Snowman', Worth: 100, Strength: 1, SpawnSound: 'spawned_snowman'  },
                Zombiess:     { SpriteType: 'Zombiess', Worth: 300, Strength: 2, SpawnSound: 'spawned_zombiess'  },
                Sheep:        { SpriteType: 'Sheep', Worth: 50, Strength: 1, SpawnSound: 'spawned_sheep'  },
                Dinosaur:     { SpriteType: 'Dinosaur', Worth: 1000, Strength: 7, SpawnSound: 'spawned_dinosaur'  },
                // New snow zombie variants
                SnowZombie1:  { SpriteType: 'SnowZombie1', Worth: 120, Strength: 1, SpawnSound: 'spawned_snowman'  },
                SnowZombie2:  { SpriteType: 'SnowZombie2', Worth: 200, Strength: 3, SpawnSound: 'spawned_snowman'  },
                SnowZombie3:  { SpriteType: 'SnowZombie3', Worth: 150, Strength: 2, SpawnSound: 'spawned_snowman'  },
                SnowZombie4:  { SpriteType: 'SnowZombie4', Worth: 150, Strength: 1, SpawnSound: 'spawned_snowman'  },
                SnowZombie5:  { SpriteType: 'SnowZombie5', Worth: 200, Strength: 2, SpawnSound: 'spawned_snowman'  },
                // Boss types
                Boss1:        { SpriteType: 'Boss1', Worth: 2000, Strength: 10, SpawnSound: 'spawned_dinosaur'  },
                Boss2:        { SpriteType: 'Boss2', Worth: 2500, Strength: 12, SpawnSound: 'spawned_dinosaur'  },
                Boss3:        { SpriteType: 'Boss3', Worth: 3000, Strength: 14, SpawnSound: 'spawned_dinosaur'  },
                Boss4:        { SpriteType: 'Boss4', Worth: 3500, Strength: 16, SpawnSound: 'spawned_dinosaur'  },
                Boss5:        { SpriteType: 'Boss5', Worth: 4000, Strength: 18, SpawnSound: 'spawned_dinosaur'  },
                Boss6:        { SpriteType: 'Boss6', Worth: 4500, Strength: 20, SpawnSound: 'spawned_dinosaur'  },
                Boss7:        { SpriteType: 'Boss7', Worth: 5000, Strength: 22, SpawnSound: 'spawned_dinosaur'  },
                Boss8:        { SpriteType: 'Boss8', Worth: 6000, Strength: 25, SpawnSound: 'spawned_dinosaur'  }
              };
              
var Game_WeaponTypes = 
              {
                Weapon01: { LifeSpan: 55,Strength: 1,HTMLButtonId: 'id_control_weapon_01', SpriteType: 'FireSock', Tooltip: 'FireSock' },
                Weapon02: { LifeSpan: 40,Strength: 2,HTMLButtonId: 'id_control_weapon_02', SpriteType: 'Snowball', Tooltip: 'Killer Snowball' },
                Weapon03: { LifeSpan: 35,Strength: 3,HTMLButtonId: 'id_control_weapon_03', SpriteType: 'FireGift', Tooltip: 'FireGift' }
              };
              
var Player_Sounds =
              {
                Player:  { Killed: 'bouncewall' },
                Player2: { Killed: 'bouncewall' },
                Player3: { Killed: 'bouncewall' },
                Player4: { Killed: 'bouncewall' },
                Player5: { Killed: 'bouncewall' },
                Player6: { Killed: 'bouncewall' },
                Player7: { Killed: 'bouncewall' },
                Player8: { Killed: 'bouncewall' },
                Player9: { Killed: 'bouncewall' }
              };

var Game_Ammo =
              {
                Weapon01: { CountId:'id_weapon_01',Count: 0, BuildDifficulty: 10  },
                Weapon02: { CountId:'id_weapon_02',Count: 0, BuildDifficulty: 20 },
                Weapon03: { CountId:'id_weapon_03',Count: 0, BuildDifficulty: 30 }
              };

var Game_MaxShotWeapons = 5; // Max number of bullets on air at the same time.
var Game_NumberShotWeapons;
              
var Game_Material     = null;
var Game_AmmoSprite   = null;
var Game_ShootingSpot = null;
var Game_Old_Material     = null;
var Game_Old_AmmoSprite   = null;
var Game_Old_ShootingSpot = null;

var Game_Props = null;
var Game_SnowPiles = [];
var Game_Old_Props = null;
var Game_Blocks = null;
var Game_Old_Blocks = null;

var Game_JustStarted;

var Game_MainMenu;
var Game_MainMenu_HighScore;
var Game_MainScreen;
var Game_GameOverScreen;
var Game_GameEndScreen;
var Game_SelectLevelScreen;
var Game_AboutScreen;
var Game_TutorialScreen;
var Game_QuitLevelConfirmation;
var Game_NewHighScoreNoticeAtGameOver;
var Game_PauseLevelScreen;

var Game_g_ControlBar_SelectIndicator;
var Game_g_ControlBar_SelectedButton = null;
var Game_SelectedWeapon    = '';

var Game_Sounds = 
[
  {
                    id:'bgnoise_owl',filename: 'bgowl'
  },
  {
                    id:'zombiedead',filename: 'zombiedead'
  },
  {
                    id:'zombiehit',filename: 'zombiehit'
  },
  {
                    id:'weaponlaunched',filename: 'weaponlaunched'
  },
  {
                    id:'spawned_zombie',filename: 'spawned_zombie'
  },
  {
                    id:'spawned_zombiess',filename: 'spawned_zombiess'
  },
  {
                    id:'spawned_snowman',filename: 'spawned_snowman'
  },
  {
                    id:'spawned_sheep',filename: 'spawned_sheep'
  },
  {
                    id:'spawned_dinosaur',filename: 'spawned_dinosaur'
  },
  {
                    id:'gameover',filename: 'gameover'
  },
  {
                    id:'levelachieved',filename: 'levelachieved'
  },
  {
                    id:'iceblockdown',filename: 'iceblockdown'
  },
  {
                    id:'playerkilled',filename: 'playerkilled'
  }
                    //,
];
                  
var Game_Noise_Owl = 'bgnoise_owl';

var Game_MusicNextNoteWait;
                  

var Game_Sprite_TypeProperties =
  {
    Player:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble    : false,
        TextBubbleX   : 0, // Coordinates in percentage.
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0, // Coordinates in percentage.
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.
                                 // 100% = the whole world.  50% = about a quarter of it (half width and half height).

        SmartTargetSearchLimit : 250, // How many animation frames must pass before the Sprite gives up finding a path.
                                     // Don't make this value dependant of g_FramesPerSecond.
                                     // Programs with more framerate would have more advantage over the rest.

        StopToCalculatePath : true, // If StopToCalculatePath is true, the Sprite will stop any movement
                                    // when assigned a smart-gototarget.
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'], // Types of Sprites that will always be ignored as obstacles when calculating target paths.
        SmartPAttmptBeforeGivingUp : -1, // Number of attempts before a Sprite gives up going through an object,
                                        // considers it an obstacle and tries to find another path.
                                        // 0:  Give up immediately.  -1:  Never give up.
                                        // N: Try N more times.

        Camera       : -1,  // -1:  Sprite is not a Camera.  0:  Sprite is a Camera, but the Camera is not active.
                            //  1:  Sprite is a Camera, and it's active (the view port follows it).

        ImageList   : {
                        img_idle:     'anim_player_idle.gif',
                        img_walk01:   'anim_player_walk_01.gif',
                        img_walk02:   'anim_player_walk_02.gif',
                        img_walk03:   'anim_player_walk_03.gif',
                        img_walk04:   'anim_player_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player_dead.gif',
                        img_gather:   'anim_player_gather.gif',
                        img_build:    'anim_player_build.gif'
                      }
      },

    Player2:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble    : false,
        TextBubbleX   : 0, // Coordinates in percentage.
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0, // Coordinates in percentage.
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_player2_idle.gif',
                        img_walk01:   'anim_player2_walk_01.gif',
                        img_walk02:   'anim_player2_walk_02.gif',
                        img_walk03:   'anim_player2_walk_03.gif',
                        img_walk04:   'anim_player2_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player2_dead.gif',
                        img_gather:   'anim_player2_gather.gif',
                        img_build:    'anim_player2_build.gif'
                      }
      },

    Player3:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_player3_idle.gif',
                        img_walk01:   'anim_player3_walk_01.gif',
                        img_walk02:   'anim_player3_walk_02.gif',
                        img_walk03:   'anim_player3_walk_03.gif',
                        img_walk04:   'anim_player3_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player3_dead.gif',
                        img_gather:   'anim_player3_gather.gif',
                        img_build:    'anim_player3_build.gif'
                      }
      },

    Player4:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player4_idle.gif',
                        img_walk01:   'anim_player4_walk_01.gif',
                        img_walk02:   'anim_player4_walk_02.gif',
                        img_walk03:   'anim_player4_walk_03.gif',
                        img_walk04:   'anim_player4_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player4_dead.gif',
                        img_gather:   'anim_player4_gather.gif',
                        img_build:    'anim_player4_build.gif'
                      }
      },

    Player5:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player5_idle.gif',
                        img_walk01:   'anim_player5_walk_01.gif',
                        img_walk02:   'anim_player5_walk_02.gif',
                        img_walk03:   'anim_player5_walk_03.gif',
                        img_walk04:   'anim_player5_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player5_dead.gif',
                        img_gather:   'anim_player5_gather.gif',
                        img_build:    'anim_player5_build.gif'
                      }
      },

    Player6:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player6_idle.gif',
                        img_walk01:   'anim_player6_walk_01.gif',
                        img_walk02:   'anim_player6_walk_02.gif',
                        img_walk03:   'anim_player6_walk_03.gif',
                        img_walk04:   'anim_player6_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player6_dead.gif',
                        img_gather:   'anim_player6_gather.gif',
                        img_build:    'anim_player6_build.gif'
                      }
      },

    Player7:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player7_idle.gif',
                        img_walk01:   'anim_player7_walk_01.gif',
                        img_walk02:   'anim_player7_walk_02.gif',
                        img_walk03:   'anim_player7_walk_03.gif',
                        img_walk04:   'anim_player7_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player7_dead.gif',
                        img_gather:   'anim_player7_gather.gif',
                        img_build:    'anim_player7_build.gif'
                      }
      },

    Player8:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player8_idle.gif',
                        img_walk01:   'anim_player8_walk_01.gif',
                        img_walk02:   'anim_player8_walk_02.gif',
                        img_walk03:   'anim_player8_walk_03.gif',
                        img_walk04:   'anim_player8_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player8_dead.gif',
                        img_gather:   'anim_player8_gather.gif',
                        img_build:    'anim_player8_build.gif'
                      }
      },

    Player9:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 2,
        Size       : 1,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,
        TextBubble    : false,
        TextBubbleX   : 0,
        TextBubbleY   : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : ['Player','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','AmmoStation','Material','ShootingSpot','Prop01','Prop02','SnowPile'],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:     'anim_player9_idle.gif',
                        img_walk01:   'anim_player9_walk_01.gif',
                        img_walk02:   'anim_player9_walk_02.gif',
                        img_walk03:   'anim_player9_walk_03.gif',
                        img_walk04:   'anim_player9_walk_04.gif',
                        img_selector: 'anim_player_selector.gif',
                        img_dead:     'anim_player9_dead.gif',
                        img_gather:   'anim_player9_gather.gif',
                        img_build:    'anim_player9_build.gif'
                      }
      },

    Block:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_block_idle.gif'
                      }
      },

    Blockx2h:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx2h_idle.gif'
                      }
      },

    Blockx3h:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx3h_idle.gif'
                      }
      },

    Blockx4h:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx4h_idle.gif'
                      }
      },

    Blockx2v:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx2v_idle.gif'
                      }
      },

    Blockx3v:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx3v_idle.gif'
                      }
      },

    Blockx4v:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,
        
        ImageList   : {
                        img_idle:     'anim_blockx4v_idle.gif'
                      }
      },

    IceBlock:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblock_idle.gif'
                      }
      },

    IceBlockx2h:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx2h_idle.gif'
                      }
      },

    IceBlockx3h:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx3h_idle.gif'
                      }
      },

    IceBlockx4h:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx4h_idle.gif'
                      }
      },

    IceBlockx2v:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx2v_idle.gif'
                      }
      },

    IceBlockx3v:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx3v_idle.gif'
                      }
      },

    IceBlockx4v:
      {
        Strength   : 1,
        Weight     : 10,
        VelLimit   : 0.3,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_iceblockx4v_idle.gif'
                      }
      },

    AmmoStation:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,

        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,

        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_ammostation_idle.gif'
                      }
      },

    ShootingSpot:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_shootingspot_idle.gif'
                      }
      },

    Prop01:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_prop_01_idle.gif'
                      }
      },

    Prop02:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_prop_02_idle.gif'
                      }
      },

    SnowPile:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1.5,

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 1,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_snowpile_idle.gif'
                      }
      },

    Material:
      {
        Strength   : 0.6,
        Weight     : 10,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,       

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_material_idle.gif'
                      }
      },

    Zombie:
      {
        Strength   : 0.2,
        Weight     : 5,
        VelLimit   : 1,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,       

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_zombie_idle.gif',
                        img_walk01:   'anim_zombie_walk_01.gif',
                        img_walk02:   'anim_zombie_walk_02.gif',
                        img_walk03:   'anim_zombie_walk_03.gif',
                        img_walk04:   'anim_zombie_walk_04.gif',
                        img_dead:     'anim_zombie_dead.gif'
                      }
      },

    FireSock:
      {
        Strength   : 2,
        Weight     : 10,
        VelLimit   : 5,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : -1,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,       

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:              'anim_weapon_firesock_idle.gif'
                      }
      },

    FireGift:
      {
        Strength   : 2,
        Weight     : 10,
        VelLimit   : 3,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : -1,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,       

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:              'anim_weapon_firegift_idle.gif'
                      }
      },

    Snowball:
      {
        Strength   : 3,
        Weight     : 10,
        VelLimit   : 5,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 5,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : -1,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,       

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:              'anim_weapon_snowball_idle.gif'
                      }
      },

    Zombiess:
      {
        Strength   : 0.2,
        Weight     : 5,
        VelLimit   : 1,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:      'anim_zombiess_idle.gif',
                        img_walk01:    'anim_zombiess_walk_01.gif',
                        img_walk02:    'anim_zombiess_walk_02.gif',
                        img_walk03:    'anim_zombiess_walk_03.gif',
                        img_walk04:    'anim_zombiess_walk_04.gif',
                        img_dead:      'anim_zombiess_dead.gif'
                      }
      },

    Snowman:
      {
        Strength   : 0.5,
        Weight     : 3,
        VelLimit   : 0.75,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:      'anim_snowman_idle.gif',
                        img_walk01:    'anim_snowman_walk_01.gif',
                        img_walk02:    'anim_snowman_walk_02.gif',
                        img_walk03:    'anim_snowman_walk_01.gif',
                        img_walk04:    'anim_snowman_walk_02.gif',
                        img_dead:      'anim_snowman_dead.gif'
                      }
      },

    SnowZombie1:
      {
        Strength   : 0.5,
        Weight     : 3,
        VelLimit   : 0.75,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_SnowZombie1_idle.gif',
                        img_walk01:    'anim_SnowZombie1_walk_01.gif',
                        img_walk02:    'anim_SnowZombie1_walk_02.gif',
                        img_walk03:    'anim_SnowZombie1_walk_03.gif',
                        img_walk04:    'anim_SnowZombie1_walk_04.gif',
                        img_dead:      'anim_SnowZombie1_dead.gif'
                      }
      },

    SnowZombie2:
      {
        Strength   : 0.5,
        Weight     : 3,
        VelLimit   : 0.75,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_SnowZombie2_idle.gif',
                        img_walk01:    'anim_SnowZombie2_walk_01.gif',
                        img_walk02:    'anim_SnowZombie2_walk_02.gif',
                        img_walk03:    'anim_SnowZombie2_walk_03.gif',
                        img_walk04:    'anim_SnowZombie2_walk_04.gif',
                        img_dead:      'anim_SnowZombie2_dead.gif'
                      }
      },

    SnowZombie3:
      {
        Strength   : 0.6,
        Weight     : 3,
        VelLimit   : 0.85,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_SnowZombie3_idle.gif',
                        img_walk01:    'anim_SnowZombie3_walk_01.gif',
                        img_walk02:    'anim_SnowZombie3_walk_02.gif',
                        img_walk03:    'anim_SnowZombie3_walk_03.gif',
                        img_walk04:    'anim_SnowZombie3_walk_04.gif',
                        img_dead:      'anim_SnowZombie3_dead.gif'
                      }
      },

    SnowZombie4:
      {
        Strength   : 0.6,
        Weight     : 3,
        VelLimit   : 0.85,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_SnowZombie4_idle.gif',
                        img_walk01:    'anim_SnowZombie4_walk_01.gif',
                        img_walk02:    'anim_SnowZombie4_walk_02.gif',
                        img_walk03:    'anim_SnowZombie4_walk_03.gif',
                        img_walk04:    'anim_SnowZombie4_walk_04.gif',
                        img_dead:      'anim_SnowZombie4_dead.gif'
                      }
      },

    SnowZombie5:
      {
        Strength   : 0.7,
        Weight     : 3,
        VelLimit   : 0.95,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_SnowZombie5_idle.gif',
                        img_walk01:    'anim_SnowZombie5_walk_01.gif',
                        img_walk02:    'anim_SnowZombie5_walk_02.gif',
                        img_walk03:    'anim_SnowZombie5_walk_03.gif',
                        img_walk04:    'anim_SnowZombie5_walk_04.gif',
                        img_dead:      'anim_SnowZombie5_dead.gif'
                      }
      },

    // Boss types - progressively stronger and larger
    Boss1:
      {
        Strength   : 1,
        Weight     : 8,
        VelLimit   : 0.6,
        Size       : 1.5, // Larger than regular zombies
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss1_idle.gif',
                        img_walk01:    'anim_Boss1_walk_01.gif',
                        img_walk02:    'anim_Boss1_walk_02.gif',
                        img_walk03:    'anim_Boss1_walk_03.gif',
                        img_walk04:    'anim_Boss1_walk_04.gif',
                        img_dead:      'anim_Boss1_dead.gif'
                      }
      },

    Boss2:
      {
        Strength   : 1,
        Weight     : 9,
        VelLimit   : 0.65,
        Size       : 1.6,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss2_idle.gif',
                        img_walk01:    'anim_Boss2_walk_01.gif',
                        img_walk02:    'anim_Boss2_walk_02.gif',
                        img_walk03:    'anim_Boss2_walk_03.gif',
                        img_walk04:    'anim_Boss2_walk_04.gif',
                        img_dead:      'anim_Boss2_dead.gif'
                      }
      },

    Boss3:
      {
        Strength   : 1,
        Weight     : 10,
        VelLimit   : 0.7,
        Size       : 1.7,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss3_idle.gif',
                        img_walk01:    'anim_Boss3_walk_01.gif',
                        img_walk02:    'anim_Boss3_walk_02.gif',
                        img_walk03:    'anim_Boss3_walk_03.gif',
                        img_walk04:    'anim_Boss3_walk_04.gif',
                        img_dead:      'anim_Boss3_dead.gif'
                      }
      },

    Boss4:
      {
        Strength   : 1,
        Weight     : 11,
        VelLimit   : 0.75,
        Size       : 1.8,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss4_idle.gif',
                        img_walk01:    'anim_Boss4_walk_01.gif',
                        img_walk02:    'anim_Boss4_walk_02.gif',
                        img_walk03:    'anim_Boss4_walk_03.gif',
                        img_walk04:    'anim_Boss4_walk_04.gif',
                        img_dead:      'anim_Boss4_dead.gif'
                      }
      },

    Boss5:
      {
        Strength   : 1,
        Weight     : 12,
        VelLimit   : 0.8,
        Size       : 1.9,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss5_idle.gif',
                        img_walk01:    'anim_Boss5_walk_01.gif',
                        img_walk02:    'anim_Boss5_walk_02.gif',
                        img_walk03:    'anim_Boss5_walk_03.gif',
                        img_walk04:    'anim_Boss5_walk_04.gif',
                        img_dead:      'anim_Boss5_dead.gif'
                      }
      },

    Boss6:
      {
        Strength   : 1,
        Weight     : 13,
        VelLimit   : 0.85,
        Size       : 2.0,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss6_idle.gif',
                        img_walk01:    'anim_Boss6_walk_01.gif',
                        img_walk02:    'anim_Boss6_walk_02.gif',
                        img_walk03:    'anim_Boss6_walk_03.gif',
                        img_walk04:    'anim_Boss6_walk_04.gif',
                        img_dead:      'anim_Boss6_dead.gif'
                      }
      },

    Boss7:
      {
        Strength   : 1,
        Weight     : 14,
        VelLimit   : 0.9,
        Size       : 2.2,
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss7_idle.gif',
                        img_walk01:    'anim_Boss7_walk_01.gif',
                        img_walk02:    'anim_Boss7_walk_02.gif',
                        img_walk03:    'anim_Boss7_walk_03.gif',
                        img_walk04:    'anim_Boss7_walk_04.gif',
                        img_dead:      'anim_Boss7_dead.gif'
                      }
      },

    Boss8:
      {
        Strength   : 1,
        Weight     : 15,
        VelLimit   : 1.0,
        Size       : 2.5, // Final boss - largest
        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 3,
        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,
        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100,
        SmartTargetSearchLimit : 250,
        StopToCalculatePath : true,
        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        Camera       : -1,
        ImageList   : {
                        img_idle:      'anim_Boss8_idle.gif',
                        img_walk01:    'anim_Boss8_walk_01.gif',
                        img_walk02:    'anim_Boss8_walk_02.gif',
                        img_walk03:    'anim_Boss8_walk_03.gif',
                        img_walk04:    'anim_Boss8_walk_04.gif',
                        img_dead:      'anim_Boss8_dead.gif'
                      }
      },

    Sheep:
      {
        Strength   : 0.9,
        Weight     : 3,
        VelLimit   : 2,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:      'anim_sheep_idle.gif',
                        img_walk01:    'anim_sheep_walk_01.gif',
                        img_walk02:    'anim_sheep_walk_02.gif',
                        img_walk03:    'anim_sheep_walk_03.gif',
                        img_walk04:    'anim_sheep_walk_04.gif',
                        img_dead:      'anim_sheep_dead.gif'
                      }
      },

    Dinosaur:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 1,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : true,
        Ghost : false,
        Visible : true,
        Z : 2,

        TextBubble   : false,
        TextBubbleX  : 0,
        TextBubbleY  : 0,
        TextBubbleTargetX   : 0,
        TextBubbleTargetY   : 0,

        LivingState  : 0,
        WalkSum      : 0,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:      'anim_dinosaur_idle.gif',
                        img_walk01:    'anim_dinosaur_walk_01.gif',
                        img_walk02:    'anim_dinosaur_walk_02.gif',
                        img_walk03:    'anim_dinosaur_walk_03.gif',
                        img_walk04:    'anim_dinosaur_walk_04.gif',
                        img_dead:      'anim_dinosaur_dead.gif'
                      }
      },

    TextBubble:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 0,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 9,

        TextBubble   : true,
        TextLabel    : false,
        TextBubbleX  : 50,  // Coordinates in percentage.
        TextBubbleY  : 100, // Coordinates in percentage.
        TextBubbleTargetX   : 50, // Coordinates in percentage.
        TextBubbleTargetY   : 0, // Coordinates in percentage.

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,        

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_textbubble_idle.gif'
                      }
      },

    TextLabel:
      {
        Strength   : 1,
        Weight     : 1,
        VelLimit   : 0,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 9,

        TextBubble   : true,
        TextLabel    : true,
        TextBubbleX  : 50,  // Coordinates in percentage.
        TextBubbleY  : 50, // Coordinates in percentage.
        TextBubbleTargetX   : 50, // Coordinates in percentage.
        TextBubbleTargetY   : 50, // Coordinates in percentage.

        LivingState  : -1,
        WalkSum      : -1,
        Target       : -1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.

        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,        

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : -1,

        ImageList   : {
                        img_idle:     'anim_textlabel_idle.gif'
                      }
      },
	  
    Camera:
      {
        Strength   : 3,
        Weight     : 1,
        VelLimit   : 6,
        Size       : 1, // Value between 0.05 and 10.  1 = actual size.

        Bounceable : false,
        Ghost : true,
        Visible : true,
        Z : 16,

        TextBubble   : false,
        TextBubbleX  : 0,  // Coordinates in percentage.
        TextBubbleY  : 0, // Coordinates in percentage.
        TextBubbleTargetX   : 0, // Coordinates in percentage.
        TextBubbleTargetY   : 0, // Coordinates in percentage.

        LivingState  : -1,
        WalkSum      : -1,
        Target       : 1,
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.
        
        SmartTargetSearchLimit : 250,
        
        StopToCalculatePath : true,        

        ExcludeObstacleTypeList : [],
        SmartPAttmptBeforeGivingUp : -1,
        
        Camera       : 0,

        ImageList   : {
                        img_idle:     'anim_camera_idle.gif'
                      }
      }
      // ,
  };

function Game_PreInitEngine()
{
  // Game-specific animation states.
  g_SpriteImageAnimNames.push('build');
  g_SpriteImageAnimNames.push('gather');
  //g_BackgroundImageName = 'game_background.png';
  g_MainWorld_Width    = 29 * 480; // Every 5 levels, go down 1 to the left.
  g_MainWorld_Height   = 8  * 260;
  g_Labyrinth_ObjectThickness = 1.25; // As opposed to to the default, 1.25.
}

function Game_Init()
{
  Game_FramesPerSecondChanged();
  
  Game_g_ControlBar_SelectIndicator = document.getElementById('id_control_selectedbutton');
  Game_MainMenu       = document.getElementById('id_div_mainmenu');
  Game_MainScreen     = document.getElementById('id_div_container');
  Game_GameOverScreen = document.getElementById('id_div_gameover');
  Game_GameEndScreen  = document.getElementById('id_div_gameend');
  Game_SelectLevelScreen     = document.getElementById('id_div_selectlevel');
  Game_AboutScreen           = document.getElementById('id_div_about');
  Game_TutorialScreen        = document.getElementById('id_div_tutorial');
  Game_QuitLevelConfirmation = document.getElementById('id_div_quitelevelconfirm');
  Game_NewHighScoreNoticeAtGameOver = document.getElementById('gameover_highscore_notice');
  Game_PauseLevelScreen      = document.getElementById('id_div_pauselevelscreen');
  Game_MainMenu_HighScore    = document.getElementById('id_mainmenu_highscore');

  // Load persistent data
  Game_LoadAchievements();
  Game_LoadShopUpgrades();
  Game_LoadWeaponUnlocks();
  Game_LoadCharacterUnlocks();
  Game_LoadSkillTree();
  Game_InitNewWeapons();

  Game_ShowMainMenu();
}

function Game_ShowMainMenu()
{
  ReplaceHTML(Game_MainMenu_HighScore.id,Game_HighScore);
  Game_MainScreen.className = 'div_hidden';
  Game_MainMenu.className   = 'div_shown';
  Game_GameOverScreen.className = 'gameover div_hidden';
  Game_GameEndScreen.className  = 'gameend div_hidden';
  Game_SelectLevelScreen.className    = 'selectlevel div_hidden';
  Game_AboutScreen.className          = 'about div_hidden';
  Game_TutorialScreen.className       = 'tutorial div_hidden';
  Game_QuitLevelConfirmation.className = 'quitlevelconfirm div_hidden';
  if (Game_NewHighScoreNoticeAtGameOver) Game_NewHighScoreNoticeAtGameOver.style.display = 'none';
  Game_PauseLevelScreen.className = 'pauselevel div_hidden';

  // Play ambient music on menu (looping)
  try { soundManager.play(Game_Noise_Owl, {loops: 1}); } catch(e) {}

  // Start menu snow effect
  Game_StartMenuSnow();
}

function Game_FromGameToMainMenu(TriggerFrameStop)
{
  Game_GameIsOver = false;
  Game_EndlessMode = false;
  if (TriggerFrameStop)
  {
    Game_TriggerFrameStop = true;
  }
  // Clean up gameplay HUD elements
  Game_ClearTurrets();
  var wp = document.getElementById('wave-preview');
  if (wp && wp.parentNode) wp.parentNode.removeChild(wp);
  var mm = document.getElementById('minimap-wrapper');
  if (mm && mm.parentNode) mm.parentNode.removeChild(mm);
  var sc = document.getElementById('snow-canvas');
  if (sc && sc.parentNode) sc.parentNode.removeChild(sc);
  var ec = document.getElementById('effects-canvas');
  if (ec && ec.parentNode) ec.parentNode.removeChild(ec);
  Game_EffectsCanvas = null; Game_EffectsCtx = null; Game_EffectsParticles = [];
  var cf = document.getElementById('combo-flash');
  if (cf && cf.parentNode) cf.parentNode.removeChild(cf);
  var so = document.getElementById('stats-overlay');
  if (so && so.parentNode) so.parentNode.removeChild(so);
  var sho = document.getElementById('shop-overlay');
  if (sho && sho.parentNode) sho.parentNode.removeChild(sho);
  // Reset speed/autoshoot
  Game_SpeedMultiplier = 1;
  Game_AutoShootEnabled = false;
  Game_StopBackgroundMusic();
  Game_DifficultyMultiplier = 1.0;
  Game_MaxZombiesInGame = 9;

  Game_CurrentLevel = 1;
  Game_ShowMainMenu();
}

function Game_Start(KickstartTimer)
{
  // Stop menu ambient music and menu effects
  try { soundManager.stopAll(); } catch(e) {}
  Game_StopMenuSnow();

  Game_MainScreen.className = 'div_shown';
  Game_MainMenu.className   = 'div_hidden';
  Game_SelectLevelScreen.className = 'div_hidden';
  Game_QuitLevelConfirmation.className = 'quitlevelconfirm div_hidden';
  if (Game_NewHighScoreNoticeAtGameOver) Game_NewHighScoreNoticeAtGameOver.style.display = 'none';
  Game_PauseLevelScreen.className = 'pauselevel div_hidden';

  Game_JustStarted = true;
  Game_NewHighScore = false;
  
  Game_SelectWeapon('Weapon01',false);
  
  if (Game_CurrentLevel == 1)
  {
    Game_NumberOfPlayersInLastLevel = -1;
    Game_PlayersInLastLevel = null;
  }
  
  Game_PlayersArray  = new Array();
  Game_Zombies  = new Object();
  Game_Players  = new Object();
  Game_Weapons  = new Object();
  Game_CreatePlayers = true;
  Game_NumberOfPlayers = 0;
  Game_LevelComplete = 0;
  Game_CountdownActive = false;
  Game_ZombieSpawnCount  = 0;
  Game_NumberShotWeapons = 0;
  Game_Score             = 0;

  // Reset combo and progress for new level.
  Game_ComboCount = 0;
  Game_ComboTimer = 0;
  Game_ComboMultiplier = 1;
  Game_ComboTimeoutFrames = Math.floor(g_FramesPerSecond * 3); // 3 sec combo window
  Game_ZombiesKilledThisLevel = 0;
  Game_HideCombo();

  // Reset new gameplay systems for level
  Game_KillStreak = 0;
  Game_LevelStartTime = Date.now();
  Game_LevelDamageTaken = 0;
  Game_LevelShotsFired = 0;
  Game_LevelShotsHit = 0;
  Game_SystemsTimer = 0;
  Game_ClearTurrets();
  Game_LoadLevelStars();
  Game_BaseFramesPerSecond = 0;
  Game_SpeedMultiplier = 1;
  Game_AutoShootEnabled = false;
  Game_AutoShootTimer = 0;
  Game_SnowParticles = [];
  // Reset boost flags so they re-apply
  for (var wt in Game_WeaponTypes) { Game_WeaponTypes[wt]._shopBoosted = false; Game_WeaponTypes[wt]._skillApplied = false; }
  Game_DifficultyMultiplier = 1.0;
  Game_DifficultyCheckTimer = 0;
  // Reset ability cooldowns
  for (var ab in Game_Abilities) { Game_Abilities[ab].timer = 0; }

  ClearTimeLine(false,false);

  Game_LoadLevel(Game_CurrentLevel,false);
  Sprite_StartRendering(KickstartTimer);
  
  if (Game_Camera)
  {
    DoGeneralAction('nocamera',null);
    Game_Camera.ScheduleDestruction = true;
  }
  
  Game_Camera = PlaceSprite(Game_LevelCameraX,Game_LevelCameraY,'Camera',false);
  Game_Camera.setCamera();
  // Force immediate viewport update so sprites render at correct positions
  // from the very first frame (don't wait for SpriteHandler to update)
  SetViewPort(Game_LevelCameraX, Game_LevelCameraY);
  Game_UpdateScreenScoreInfo();

  // Reset UI buttons
  var speedBtn = document.getElementById('speed-btn');
  if (speedBtn) speedBtn.textContent = 'x1';
  var autoBtn = document.getElementById('autoshoot-btn');
  if (autoBtn) autoBtn.style.borderColor = '#4488CC';
}

function Game_RestartLevel()
{
  // Clear overlays
  var so = document.getElementById('stats-overlay');
  if (so && so.parentNode) so.parentNode.removeChild(so);
  var sho = document.getElementById('shop-overlay');
  if (sho && sho.parentNode) sho.parentNode.removeChild(sho);

  // Clear all power-ups
  if (window.PowerupSystem)
  {
    PowerupSystem.clearAll();
  }

  Game_GameIsOver = false;
  Game_GameOverScreen.className = 'gameover div_hidden';
  Game_GameEndScreen.className  = 'gameend div_hidden';
  Game_Start(false);
}

function Game_LoadLevel(Level,Transition)
{
  if (Game_InGameTipLabel)
  {
    Game_InGameTipLabel.ScheduleDestruction = true;
    Game_InGameTipLabel = null;
  }

  // Use procedural level generation for levels beyond predefined ones
  var LevelData;
  if (Level <= Game_LevelData.length) {
    LevelData = Game_LevelData[Level - 1];
  } else if (typeof ProceduralLevels !== 'undefined') {
    LevelData = ProceduralLevels.generateLevel(Level);
    console.log('[PROCEDURAL] Generated level', Level, ':', LevelData.LevelComments);
  } else {
    // Fallback: loop back to level 1 if no procedural generation
    LevelData = Game_LevelData[0];
  }
  
  if (Transition)
  {
    // If we are transitioning, don't load the constraints yet.
    Game_LabyrinthConstraints = null;
  }
  else
  {
    Game_LabyrinthConstraints = (LevelData.LabyrinthConstraints)?LevelData.LabyrinthConstraints:null;
  }
  
  var StartSpawnTimeInSecs             = (LevelData.StartSpawnTimeInSecs != undefined)?LevelData.StartSpawnTimeInSecs:-1;
  
  Game_IntermittentBlocks          = (LevelData.IntermittentBlocks)?true:false;
  
  Game_IntermittentBlockCount      = Game_IntermittentBlockCountMax;
  Game_IntermittentBlockShown      = true;
  
  Game_ZombieSpawnSpots            = LevelData.ZombieSpawnSpots;
  Game_LevelCameraX                = LevelData.LevelCameraX;
  Game_LevelCameraY                = LevelData.LevelCameraY;
  Game_CurrentLevelFramesPerSecond = (LevelData.FramesPerSecond)?LevelData.FramesPerSecond:gc_MobileInitialFramesPerSecond; // (or gc_MobileInitialFramesPerSecond_Slow,gc_MobileInitialFramesPerSecond_Fast)
  Game_LevelTotalZombies           = LevelData.LevelTotalZombies;
  Game_UpdateProgressBar();

  if (!LevelData.SameSnowStockAsPrevious || !Transition)
  {
    Game_SnowStock = LevelData.SnowStock;
  }
  
  if (LevelData.ZombieMaxSpawnTime)
  {
    Game_ZombieLevelSpawnCountMax = LevelData.ZombieMaxSpawnTime;
    Game_SetZombieSpawnCountMax(Game_ZombieLevelSpawnCountMax);
  }
  
  if (!LevelData.SameAmmoAsPrevious || !Transition)
  {
    for (var ThisWeapon in LevelData.Ammo)
    {
      if ((Game_Ammo[ThisWeapon] != undefined) && (LevelData.Ammo[ThisWeapon] != undefined))
      {
        Game_Ammo[ThisWeapon].Count = LevelData.Ammo[ThisWeapon];
      }
    }
  }
  
  if (LevelData.InGameTip)
  {
    Game_InGameTipLabel = Game_CreateAndPlaceSprite(LevelData.InGameTipX,LevelData.InGameTipY,'TextLabel')
    Game_InGameTipLabel.setCaption(LevelData.InGameTip);
    Game_InGameTipLabel.showCaption(true);
  }
   
  Game_Material = Game_CreateAndPlaceSprite(LevelData.MaterialPositionX,LevelData.MaterialPositionY,'Material')
  Game_Material.isMaterial = true;
  Game_Material.setGhost(true);
  
  Game_AmmoSprite = Game_CreateAndPlaceSprite(LevelData.AmmoX,LevelData.AmmoY,'AmmoStation')
  Game_AmmoSprite.isAmmo = true;
  Game_AmmoSprite.setGhost(true);
  
  Game_ShootingSpot = Game_CreateAndPlaceSprite(LevelData.ShootingSpotX,LevelData.ShootingSpotY,'ShootingSpot')
  Game_ShootingSpot.isShootingSpot = true;
  Game_ShootingSpot.setGhost(true);
  
  Game_Props = new Array();
  Game_SnowPiles = new Array();
  for (var PropIndex in LevelData.Props)
  {
    var ThisPropSprite = Game_CreateAndPlaceSprite(LevelData.Props[PropIndex].X,LevelData.Props[PropIndex].Y,LevelData.Props[PropIndex].Type)
    if (ThisPropSprite)
    {
      if (LevelData.Props[PropIndex].Type === 'SnowPile')
      {
        ThisPropSprite.isSnowPile = true;
        Game_SnowPiles.push(ThisPropSprite);
      }
      Game_Props.push(ThisPropSprite);
    }
  }

  // Auto-generate SnowPiles if the level didn't define any
  if (Game_SnowPiles.length === 0 && LevelData.LabyrinthConstraints)
  {
    var lc = LevelData.LabyrinthConstraints;
    var areaW = lc.X2 - lc.X1;
    var areaH = lc.Y2 - lc.Y1;
    var pileCount = 2 + Math.floor(Math.random() * 2); // 2-3 piles
    for (var sp = 0; sp < pileCount; sp++)
    {
      // Place in the left half of the level (away from shooting/ammo spots which are usually on the right)
      var pileX = lc.X1 + 20 + Math.floor(Math.random() * (areaW * 0.5));
      var pileY = lc.Y1 + 20 + Math.floor(Math.random() * (areaH - 50));
      var spPile = Game_CreateAndPlaceSprite(pileX, pileY, 'SnowPile');
      if (spPile)
      {
        spPile.isSnowPile = true;
        spPile.setGhost(true);
        Game_SnowPiles.push(spPile);
        Game_Props.push(spPile);
      }
    }
  }

  Game_Blocks = new Array();
  for (var BlockIndex in LevelData.Blocks)
  {
    var ThisBlockSprite = Game_CreateAndPlaceSprite(LevelData.Blocks[BlockIndex].X,LevelData.Blocks[BlockIndex].Y,LevelData.Blocks[BlockIndex].Type)
    if (ThisBlockSprite)
    {
      if (ThisBlockSprite.Type == 'IceBlock')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx2h')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 2 * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx3h')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 3 * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx4h')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 4 * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx2v')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 2 * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx3v')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 3 * 0.5);
      }
      else if (ThisBlockSprite.Type == 'IceBlockx4v')
      {
        ThisBlockSprite.isIceBlock = true;
        ThisBlockSprite.BlockLife  = Math.floor(g_FramesPerSecond * 4 * 0.5);
      }
      
      Game_Blocks.push(ThisBlockSprite);
    }
  }

  // Create decorative NPCs (animals and villagers)
  if (LevelData.DecorativeNPCs)
  {
    for (var NPCIndex in LevelData.DecorativeNPCs)
    {
      var ThisNPC = LevelData.DecorativeNPCs[NPCIndex];
      var ThisNPCSprite = Game_CreateAndPlaceSprite(ThisNPC.X, ThisNPC.Y, ThisNPC.Type);
      if (ThisNPCSprite)
      {
        ThisNPCSprite.setGhost(true); // Make them non-interactive
        ThisNPCSprite.isDecorativeNPC = true;
        console.log('[NPC] Spawned decorative NPC:', ThisNPC.Type, 'at', ThisNPC.X, ThisNPC.Y);
      }
    }
  }

  var Shooter = null;
  
  Game_BaseX = -1;
  Game_BaseY = -1;
  var Game_BaseX2 = -1;
  var Game_BaseY2 = -1;
  if (LevelData.PlayersList)
  {
    if (Game_CreatePlayers)
    {
      var PlayersInLastLevel = null;
      if (Game_PlayersInLastLevel)
      {
        PlayersInLastLevel = Game_PlayersInLastLevel.concat(); // <--- This operation clones.
      }
      
      for (var ThisPlayer in LevelData.PlayersList)
      {
        var Proceed = true;
        
        if (Game_NumberOfPlayersInLastLevel != -1)
        {
          if (PlayersInLastLevel)
          {
            // Respawn only the players of the type that were left last time (last game).
            Proceed = false;
            for (var ThisOldPlayerType in PlayersInLastLevel)
            {
              if (PlayersInLastLevel[ThisOldPlayerType] == LevelData.PlayersList[ThisPlayer].Type)
              {
                delete PlayersInLastLevel[ThisOldPlayerType];
                Proceed = true;
                break;
              }
            }
          }
          //else if (Game_NumberOfPlayers >= Game_NumberOfPlayersInLastLevel)
          //{
          //  // We'll probably never get here.
          //  Proceed = false;
          //}
        }
        
        if (Proceed)
        {
          var ThisPlayerInfo = LevelData.PlayersList[ThisPlayer];
          Game_CreateAndPlacePlayer(ThisPlayerInfo.X,ThisPlayerInfo.Y,ThisPlayerInfo.BaseX,ThisPlayerInfo.BaseY,ThisPlayerInfo.Type);
          Game_NumberOfPlayers++;
          
          if ((Game_BaseX == -1) || (Game_BaseX > ThisPlayerInfo.BaseX))
          {
            Game_BaseX = ThisPlayerInfo.BaseX;
          }
          
          if ((Game_BaseY == -1) || (Game_BaseY > ThisPlayerInfo.BaseY))
          {
            Game_BaseY = ThisPlayerInfo.BaseY;
          }
          
          if ((Game_BaseX2 == -1) || (Game_BaseX2 < (ThisPlayerInfo.BaseX + parseInt(g_AnimTypes[ThisPlayerInfo.Type].idle.Image.width))))
          {
            Game_BaseX2 = ThisPlayerInfo.BaseX + parseInt(g_AnimTypes[ThisPlayerInfo.Type].idle.Image.width);
          }
          
          if ((Game_BaseY2 == -1) || (Game_BaseY2 < (ThisPlayerInfo.BaseY + parseInt(g_AnimTypes[ThisPlayerInfo.Type].idle.Image.height))))
          {
            Game_BaseY2 = ThisPlayerInfo.BaseY + parseInt(g_AnimTypes[ThisPlayerInfo.Type].idle.Image.height);
          }
        }
        //else
        //{
        //  break;
        //}
      }
      
      Game_BaseWidth  = Game_BaseX2 - Game_BaseX;
      Game_BaseHeight = Game_BaseY2 - Game_BaseY;
      
      if (Game_NumberOfPlayersInLastLevel == -1)
      {
        Game_NumberOfPlayersInLastLevel = Game_NumberOfPlayers;
      }

      Shooter = Game_PlayersArray[0];
    }
    else
    {
      var PlayerIndex = 0;
      
      for (var PlayerInfo in LevelData.PlayersList)
      {
        var ThisPlayerInfo = LevelData.PlayersList[PlayerInfo];
        
        while ((PlayerIndex < Game_PlayersArray.length) && !Game_PlayersArray[PlayerIndex])
        {
          PlayerIndex++;
        }
        
        if (Game_PlayersArray[PlayerIndex])
        {
          Game_PlayersArray[PlayerIndex].setStateImage('',2);
          
          Game_PlayersArray[PlayerIndex].BaseX          = ThisPlayerInfo.BaseX;
          Game_PlayersArray[PlayerIndex].BaseY          = ThisPlayerInfo.BaseY;
          Game_PlayersArray[PlayerIndex].BuildAmmoPhase = 0;
          // Teleport player to new level area (near their start position)
          // so they don't appear stuck at the previous level's coordinates.
          Game_PlayersArray[PlayerIndex].X = ThisPlayerInfo.X;
          Game_PlayersArray[PlayerIndex].Y = ThisPlayerInfo.Y;
          SetSpriteTarget(Game_PlayersArray[PlayerIndex],ThisPlayerInfo.BaseX,ThisPlayerInfo.BaseY,null,true,false);
          
          if (!Shooter)
          {
            Shooter = Game_PlayersArray[PlayerIndex];
          }
          
          PlayerIndex++;
        }
        else
        {
          break;
        }
      }
      
      // Move any extra players (from previous level with more players) to the
      // last assigned player's base position so they stay on-screen.
      // E.g., level 1 has 3 players but level 2 only defines 2 positions.
      while (PlayerIndex < Game_PlayersArray.length)
      {
        if (Game_PlayersArray[PlayerIndex])
        {
          var lastInfo = LevelData.PlayersList[Object.keys(LevelData.PlayersList).pop()];
          Game_PlayersArray[PlayerIndex].setStateImage('',2);
          Game_PlayersArray[PlayerIndex].BaseX          = lastInfo.BaseX;
          Game_PlayersArray[PlayerIndex].BaseY          = lastInfo.BaseY;
          Game_PlayersArray[PlayerIndex].BuildAmmoPhase = 0;
          // Teleport extra players to new level area
          Game_PlayersArray[PlayerIndex].X = lastInfo.X;
          Game_PlayersArray[PlayerIndex].Y = lastInfo.Y;
          SetSpriteTarget(Game_PlayersArray[PlayerIndex],lastInfo.BaseX,lastInfo.BaseY,null,true,false);
        }
        PlayerIndex++;
      }

      if (Game_PlayerShooter)
      {
        Shooter = Game_PlayerShooter;
      }
    }
  }
  
  if (Shooter)
  {
    Shooter.GameObjective = 'GotoShootingSpot';
    SetSpriteTarget(Shooter,Game_ShootingSpot.X + Game_ShootingSpot.RealImageWidth * 0.5,Game_ShootingSpot.Y + Game_ShootingSpot.RealImageHeight * 0.8,null,true,false);
  }
  
  // Notice that Labyrinth constraints are set after the players are instructed to move to their
  // next level positions.  Otherwise, they would "think" they are trapped within invisible walls.
  if (!Game_LabyrinthConstraints)
  {
    Game_LabyrinthConstraints = (LevelData.LabyrinthConstraints)?LevelData.LabyrinthConstraints:null;
  }
  
  Game_ZombiesInGame         = 0;
  Game_ZombieSpawnList = LevelData.ZombieSpawnList.concat().reverse(); // contact() clones here.
  Game_ZombieTotalSpawnCount = 0;

  // Apply special wave modifiers for milestone levels
  Game_ApplySpecialWaveModifiers();

  if (StartSpawnTimeInSecs >= 0)
  {
    Game_ZombieSpawnCount  = Math.floor(StartSpawnTimeInSecs * g_FramesPerSecond);
  }
  
  // Hacking the engine to include intermittent blocks.
  if (Game_TypesWith_IntermittentBlockExclusion)
  {
    for (var ThisType in Game_TypesWith_IntermittentBlockExclusion)
    {
      if (Game_Sprite_TypeProperties[ThisType].OldExcludeObstacleTypeList)
      {
        Game_Sprite_TypeProperties[ThisType].ExcludeObstacleTypeList = Game_Sprite_TypeProperties[ThisType].OldExcludeObstacleTypeList;
      }
    }
  }
  
  Game_TypesWith_IntermittentBlockExclusion = null;
  
  if (Game_IntermittentBlocks)
  {
    for (var PlayerId in Game_Players)
    {
      var Player = Game_Players[PlayerId];
      if (Player)
      {
        if (!Game_TypesWith_IntermittentBlockExclusion)
        {
          Game_TypesWith_IntermittentBlockExclusion = new Object();
        }
        
        if (!Game_TypesWith_IntermittentBlockExclusion[Player.Type])
        {
          Game_TypesWith_IntermittentBlockExclusion[Player.Type] = true;
        
          // We must include blocks in the players' labyrinth obstacle exclude list.
          Game_Sprite_TypeProperties[Player.Type].OldExcludeObstacleTypeList = Game_Sprite_TypeProperties[Player.Type].ExcludeObstacleTypeList.concat(); // Cloning.
          Game_Sprite_TypeProperties[Player.Type].ExcludeObstacleTypeList.push(
                                              'Block',
                                              'Blockx2h',
                                              'Blockx3h',
                                              'Blockx4h',
                                              'Blockx2v',
                                              'Blockx3v',
                                              'Blockx4v',
                                              'IceBlock',
                                              'IceBlockx2h',
                                              'IceBlockx3h',
                                              'IceBlockx4h',
                                              'IceBlockx2v',
                                              'IceBlockx3v',
                                              'IceBlockx4v'
                                                                              );
        }
      }
    }
  }
  
  var ZombieTypeElement = Game_ZombieSpawnList.pop();
  Game_CurrentZombieSpawnType = ZombieTypeElement[0];
  Game_NextZombieSpawnIndex   = ZombieTypeElement[1];
  Game_CreatePlayers = false;
  
  ReplaceHTML('span_levelboard','<span class="levelamount">' + Level + '</span>');
  Game_UpdateScreenInfo();
}

function Game_CreateAndPlaceSprite(X,Y,Type)
{
  var Sprite = PlaceSprite(X,Y,Type,false);
  Sprite.isPlayer       = false;
  Sprite.isZombie       = false;
  Sprite.isDinosaur     = false;
  Sprite.ZombieType     = '';
  Sprite.ZombieStrength = 0;
  Sprite.isWeapon       = false;
  Sprite.WeaponType     = '';
  Sprite.isMaterial     = false;
  Sprite.isAmmo         = false;
  Sprite.isIceBlock     = false;
  Sprite.BlockLife      = 0;
  Sprite.isShootingSpot = false;
  Sprite.isSnowPile     = false;
  Sprite.SnowStock      = 0;
  Sprite.BaseX          = 0;
  Sprite.BaseY          = 0;
  Sprite.BuildAmmoPhase = 0;
  Sprite.GameObjective  = '';
  
  return Sprite;
}

function Game_CreateAndPlacePlayer(X,Y,BaseX,BaseY,PlayerType)
{
  var Player = Game_CreateAndPlaceSprite(X,Y,PlayerType);
  Player.isPlayer       = true;
  Player.SnowStock      = 0;
  Player.BaseX          = BaseX;
  Player.BaseY          = BaseY;
  Player.BuildAmmoPhase = 0;
  
  Game_Players[Player.Id] = Player;
  Game_PlayersArray.push(Player);

  // Apply unique player abilities
  Game_ApplyPlayerAbilities();

  SetSpriteTarget(Player,BaseX,BaseY,null,true,false);

  return Player;
}

function Game_CreateAndPlaceZombie(X,Y,ZombieType)
{
  var Zombie = Game_CreateAndPlaceSprite(X,Y,Game_ZombieTypes[ZombieType].SpriteType);
  Zombie.isPlayer   = false;
  Zombie.isZombie     = true;
  Zombie.isDinosaur   = (ZombieType == 'Dinosaur' || ZombieType.indexOf('Boss') === 0);
  Zombie.ZombieType = ZombieType;
  Zombie.ZombieStrength = Game_ZombieTypes[ZombieType].Strength;
  
  Zombie.findTarget = function()
  {
    var Distance = -1;
    var ChosenFood = null;
    var FoodSource = [Game_Players];
    
    if (Zombie.isDinosaur)
    {
      FoodSource.push(Game_Zombies);
    }
    
    for (var ThisFoodBatch in FoodSource)
    {
      var ThisBatch = FoodSource[ThisFoodBatch];
      
      for (var FoodId in ThisBatch)
      {
        var Food = ThisBatch[FoodId];
        if (Food && (Food.Id != Zombie.Id) && !Food.isDinosaur)
        {
          if (Zombie.TargetSprite == null)
          {
            ChosenFood = Food;
            var DistanceX = Math.abs(Zombie.X - Food.X);
            var DistanceY = Math.abs(Zombie.Y - Food.Y);
            Distance = DistanceX*DistanceX + DistanceY*DistanceY;
          }
          else
          {
            var DistanceX = Math.abs(Zombie.X - Food.X);
            var DistanceY = Math.abs(Zombie.Y - Food.Y);
            var ThisDistance = DistanceX*DistanceX + DistanceY*DistanceY;
            if ((Distance == -1) || (Distance > ThisDistance))
            {
              ChosenFood = Food;
              Distance = ThisDistance;
            }
          }
        }
      }
    }
    
    if (ChosenFood)
    {
      Zombie.setTargetSprite(ChosenFood,false,false);
      Zombie.Target = Game_Sprite_TypeProperties[Zombie.Type].Target;
    }
  }
  
  Game_Zombies[Zombie.Id] = Zombie;
  
  return Zombie;
}

function Game_CreateAndPlaceWeapon(X,Y,Type)
{
  var Weapon = null;
  if (Game_WeaponTypes[Type])
  {
    Weapon        = Game_CreateAndPlaceSprite(X,Y,Game_WeaponTypes[Type].SpriteType);
    Weapon.isWeapon   = true;
    Weapon.ZombiesKilled    = 0;
    Weapon.WeaponType       = Type;
    
    Weapon.LifeSpan         = Game_WeaponTypes[Type].LifeSpan;
    Weapon.WeaponStrength = Game_WeaponTypes[Type].Strength;
    
    Game_Weapons[Weapon.Id] = Weapon;
  }
  
  return Weapon;
}

function Game_SpriteSelected(SelectedSprite,PreviouslySelectedSprite)
{
  if (SelectedSprite)
  {
    if (SelectedSprite.isSnowPile)
    {
      // Collect snow pile: instant +25 snow stock, pile disappears
      Game_SnowStock += 25;
      ReplaceHTML('id_snowstock', Game_SnowStock);
      Game_ShowFloatingText('+25 SNOW!', '#88CCFF', {X: SelectedSprite.X, Y: SelectedSprite.Y});
      SoundPlay('weaponlaunched');
      SelectedSprite.ScheduleDestruction = true;
      // Remove from snow piles tracking array
      for (var sp = 0; sp < Game_SnowPiles.length; sp++) {
        if (Game_SnowPiles[sp] && Game_SnowPiles[sp].Id === SelectedSprite.Id) {
          Game_SnowPiles.splice(sp, 1); break;
        }
      }
      SelectSprite(null, false);
    }
    else if (SelectedSprite.isMaterial)
    {
      Game_PrintStatusBar('Junkyard: Source for ammo parts.');

      SelectSprite(SelectedSprite,false);

      // If no player was selected, auto-pick the nearest idle player
      var ThisPlayer = null;
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        ThisPlayer = PreviouslySelectedSprite;
      }
      else
      {
        ThisPlayer = Game_FindNearestIdlePlayer(SelectedSprite.X, SelectedSprite.Y);
      }

      if (ThisPlayer)
      {
        SelectSprite(ThisPlayer,true);

        ThisPlayer.setStateImage('',2);
        if (Game_PlayerShooter && (Game_PlayerShooter.Id == ThisPlayer.Id))
        {
          Game_PlayerShooter = null;
        }
        ThisPlayer.GameObjective = 'SeekMaterial';
        SetSpriteTarget(ThisPlayer,SelectedSprite.X + SelectedSprite.RealImageWidth * 0.5,SelectedSprite.Y + SelectedSprite.RealImageHeight * 0.8,null,true,false);
      }
      else if (Game_PlayerShooter)
      {
        Game_PlayerLookWhereToShoot(Game_PlayerShooter,SelectedSprite.X,SelectedSprite.Y);
        Game_PlayerShoot(Game_PlayerShooter.X,Game_PlayerShooter.Y,SelectedSprite.X,SelectedSprite.Y);
      }
    }
    else if (SelectedSprite.isAmmo)
    {
      Game_PrintStatusBar('Workshop:  Build more ammo here (select the weapon first).');

      SelectSprite(SelectedSprite,false);

      // If no player was selected, auto-pick the nearest idle player
      var ThisPlayer = null;
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        ThisPlayer = PreviouslySelectedSprite;
      }
      else
      {
        ThisPlayer = Game_FindNearestIdlePlayer(SelectedSprite.X, SelectedSprite.Y);
      }

      if (ThisPlayer)
      {
        SelectSprite(ThisPlayer,true);
        ThisPlayer.setStateImage('',2);

        if (Game_PlayerShooter && (Game_PlayerShooter.Id == ThisPlayer.Id))
        {
          Game_PlayerShooter = null;
        }
        ThisPlayer.GameObjective = 'GotoAmmo';
        SetSpriteTarget(ThisPlayer,SelectedSprite.X,SelectedSprite.Y,null,true,false);
      }
      else if (Game_PlayerShooter)
      {
        Game_PlayerLookWhereToShoot(Game_PlayerShooter,SelectedSprite.X,SelectedSprite.Y);
        Game_PlayerShoot(Game_PlayerShooter.X,Game_PlayerShooter.Y,SelectedSprite.X,SelectedSprite.Y);
      }
    }
    else if (SelectedSprite.isShootingSpot)
    {
      Game_PrintStatusBar('Shooting station:  Kill Zombies from here.');

      SelectSprite(SelectedSprite,false);

      // If no player was selected, auto-pick the nearest idle player
      var ThisPlayer = null;
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        ThisPlayer = PreviouslySelectedSprite;
      }
      else
      {
        ThisPlayer = Game_FindNearestIdlePlayer(SelectedSprite.X, SelectedSprite.Y);
      }

      if (ThisPlayer)
      {
        ThisPlayer.setStateImage('',2);
        if (Game_PlayerShooter && (Game_PlayerShooter.Id != ThisPlayer.Id))
        {
          SetSpriteTarget(Game_PlayerShooter,Game_PlayerShooter.BaseX,Game_PlayerShooter.BaseY,null,true,false);
          Game_PlayerShooter = null;
        }

        SelectSprite(ThisPlayer,true);

        ThisPlayer.GameObjective = 'GotoShootingSpot';
        SetSpriteTarget(ThisPlayer,Game_ShootingSpot.X + Game_ShootingSpot.RealImageWidth * 0.5,Game_ShootingSpot.Y + Game_ShootingSpot.RealImageHeight * 0.8,null,true,false);
      }
    }
//    else if (Game_PlayerShooter && PreviouslySelectedSprite && (Game_PlayerShooter.Id == SelectedSprite.Id) && (Game_PlayerShooter.Id != PreviouslySelectedSprite.Id))
//    {
//      Game_PlayerShooter.setStateImage('',2);
//      SetSpriteTarget(Game_PlayerShooter,Game_PlayerShooter.BaseX,Game_PlayerShooter.BaseY,null,true,false);
//      SelectSprite(PreviouslySelectedSprite,true);
//      
//      PreviouslySelectedSprite.GameObjective = 'GotoShootingSpot';
//      SetSpriteTarget(PreviouslySelectedSprite,SelectedSprite.X,SelectedSprite.Y,null,true,false);
//    }
    else if (Game_PlayerShooter && !SelectedSprite.isPlayer)
    {
      Game_PlayerLookWhereToShoot(Game_PlayerShooter,
                       SelectedSprite.X + SelectedSprite.RealImageWidth * 0.5,
                       SelectedSprite.Y + SelectedSprite.RealImageHeight * 0.5);
                       
      Game_PlayerShoot(Game_PlayerShooter.X,
                       Game_PlayerShooter.Y,
                       SelectedSprite.X + SelectedSprite.RealImageWidth * 0.5,
                       SelectedSprite.Y + SelectedSprite.RealImageHeight * 0.5);
      
      if (PreviouslySelectedSprite)
      {
        SelectSprite(PreviouslySelectedSprite,true);
      }
    }
    else if (SelectedSprite.isPlayer)
    {
      Game_PrintStatusBar('Click on any of the stations to move.');
    }
    else
    {
      SelectSprite(null,false);
      if (SelectedSprite.isZombie)
      {
        Game_PrintStatusBar('To kill it, place someone at the Shooting Station.');
      }
    }
  }
}

function Game_TargetAchieved(Sprite)
{
  if (Sprite.isPlayer)
  {
    var Player = Sprite;
    if (Player.GameObjective == 'SeekMaterial')
    {
      Player.GameObjective = 'StockSnow';
      Player.setStateImage('gather',1);
    }
    else if (Player.GameObjective == 'GotoAmmo')
    {
      Game_SnowStock += Player.SnowStock;
      Player.SnowStock = 0;
      Player.GameObjective = 'BuildAmmo';
      Player.setStateImage('build',1);
    }
    else if (Player.GameObjective == 'GotoShootingSpot')
    {
      Player.GameObjective = '';
      Player.setStateImage('',2);
      Player.setStateImage('idle',0);
      Game_PlayerShooter = Player;
    }
    else if (Player.GameObjective == 'ReturnMaterialToBase')
    {
      Game_SnowStock += Player.SnowStock;
      Player.SnowStock = 0;
      Player.GameObjective = 'ReturnToBase';
      SetSpriteTarget(Player,Player.BaseX,Player.BaseY,null,true,false);
      Game_PrintStatusBar('Ready to build ammo.');
    }
    else if (Player.GameObjective == 'ReturnToBase')
    {
      Player.GameObjective = '';
    }
    
//^^if (Player.Type=='Player'){     Game_LevelComplete = 1;}//^^ // Great for debugging.
    
  }
  else if (Sprite.Camera == 1)
  {
    var Camera = Sprite;
    
    if (Game_LevelComplete == 2)
    {
      Game_StartLevel();
    }
  }
}

function Game_Frame()
{
  if (!g_TimeLine_Paused)
  {
    for (var PlayerId in Game_Players)
    {
      var Player = Game_Players[PlayerId];
      if (Player)
      {
        if ((Player.GameObjective == 'StockSnow') && (Player.LivingState == 0))
        {
          if (Player.SnowStock < Game_PlayerStocCapacity)
          {
            Player.SnowStock++;
          }
          else
          {
            Player.GameObjective = 'ReturnMaterialToBase';
            Player.setStateImage('',2);
            Player.setStateImage('idle',0);
            SetSpriteTarget(Player,Game_AmmoSprite.X,Game_AmmoSprite.Y,null,true,false);
          }
        }
        else if ((Player.GameObjective == 'BuildAmmo') && (Player.LivingState == 0))
        {
          var StopBuilding = false;
          if (Player.BuildAmmoPhase < Game_PlayerBuildCapacity)
          {
            if (Game_SnowStock > 0)
            {
              Game_SnowStock--;
              Player.BuildAmmoPhase++;
              
              if ((Player.BuildAmmoPhase % Game_Ammo[Game_SelectedWeapon].BuildDifficulty) == 0)
              {
                Game_Ammo[Game_SelectedWeapon].Count++;
              }
            }
            else
            {
              StopBuilding = true;
            }
          }
          else
          {
            StopBuilding = true;
          }
          
          if (StopBuilding)
          {
            Player.GameObjective = '';
            Player.BuildAmmoPhase = 0;
            Player.setStateImage('',2);
            Player.setStateImage('idle',0);
            Game_PrintStatusBar('Ammo is ready.');

            for (var ThisPlayer in Game_Players)
            {
              if (Game_Players[ThisPlayer] && (Game_Players[ThisPlayer].Id != Player.Id) && ((Game_Players[ThisPlayer].X - Player.X) < 5) && ((Game_Players[ThisPlayer].Y - Player.Y) < 5))
              {
                Player.GameObjective = 'ReturnToBase';
                SetSpriteTarget(Player,Player.BaseX,Player.BaseY,null,true,false);
                break;
              }
            }
          }
        }
      }
    }
    
    for (var WeaponId in Game_Weapons)
    {
      var Weapon = Game_Weapons[WeaponId];
      if (Weapon)
      {
        if (--Weapon.LifeSpan <= 0)
        {
          if (!Weapon.ScheduleDestruction)
          {
            Game_NumberShotWeapons--;
            Weapon.ScheduleDestruction = true;
            // Shot missed: reset combo and kill streak
            if (!Weapon._hitSomething)
            {
              Game_ComboCount = 0;
              Game_ComboMultiplier = 1;
              Game_ComboTimer = 0;
              Game_HideCombo();
              Game_KillStreak = 0;
            }
          }
        }
      }
    }
    
    if (--Game_UpdateCountersTimer <= 0)
    {
      Game_UpdateCountersTimer = Math.floor(g_FramesPerSecond * 0.5);
      Game_UpdateScreenInfo();
    }
    
    if (Game_LevelStarted)
    {
      // Unstuck system: manage ghost-mode timers and detect stuck zombies.
      Game_UpdateZombieStuckDetection();

      // New gameplay systems (run every frame)
      Game_UpdateSpecialZombies();
      Game_UpdateBossAbilities();
      Game_UpdateTurrets();
      Game_UpdateSnowParticles();
      Game_UpdateProjectileTrails();
      Game_UpdateEffectsCanvas();
      Game_UpdateBossHealthBars();
      Game_UpdateAutoShoot();
      Game_UpdateAbilityCooldowns();
      Game_UpdateDynamicDifficulty();

      // Slower updates (every ~1 second)
      if (!Game_SystemsTimer) Game_SystemsTimer = 0;
      if (++Game_SystemsTimer >= g_FramesPerSecond)
      {
        Game_SystemsTimer = 0;
        // Game_AutoGatherIdlePlayers(); // Disabled: players move only on user click
        Game_UpdateWavePreview();
        Game_UpdateMiniMap();
        Game_CheckAchievements();
        Game_CheckWeaponUnlocks();
      }

      if (--Game_UpdateZombieObjectives <= 0)
      {
        Game_UpdateZombieObjectives = Math.floor(g_FramesPerSecond * 0.5);
        Game_UpdateZombieTargets();
      }
      
      if (--Game_ZombieSpawnCount <= 0)
      {
        Game_ZombieSpawnCount = Game_ZombieSpawnCountMax;

        if (!Game_CountdownActive && (Game_ZombiesInGame < Game_MaxZombiesInGame) && (Game_ZombieTotalSpawnCount < Game_LevelTotalZombies))
        {
          if ((Game_ZombieSpawnList.length > 0) && (Game_ZombieTotalSpawnCount >= Game_NextZombieSpawnIndex))
          {
            var ZombieTypeElement = Game_ZombieSpawnList.pop();
            Game_CurrentZombieSpawnType = ZombieTypeElement[0];
            Game_NextZombieSpawnIndex   = ZombieTypeElement[1];
          }
          var SpawnSpot = Game_ZombieSpawnSpots[Math.floor(Math.random() * Game_ZombieSpawnSpots.length)];
          
          if (SpawnSpot)
          {
            var TheZombie = Game_CreateAndPlaceZombie(SpawnSpot[0],SpawnSpot[1],Game_CurrentZombieSpawnType);

            if (TheZombie)
            {
              Game_ApplyZombieBehaviors(TheZombie);
              TheZombie.findTarget();
              // Spawn entrance animation
              Game_SpriteSpawnEffect(TheZombie);
              Game_ZombieTotalSpawnCount++;
              Game_ZombiesInGame++;
            }
            SoundPlay(Game_ZombieTypes[Game_CurrentZombieSpawnType].SpawnSound);
          }
        }
      }

      // Update power-up system
      if (window.PowerupSystem)
      {
        PowerupSystem.update();
      }

      // Combo timer countdown
      if (Game_ComboTimer > 0)
      {
        Game_ComboTimer--;
        if (Game_ComboTimer <= 0)
        {
          Game_ComboCount = 0;
          Game_ComboMultiplier = 1;
          Game_HideCombo();
        }
      }
    }

    if (Game_IntermittentBlocks)
    {
      if (--Game_IntermittentBlockCount <= 0)
      {
        Game_IntermittentBlockShown = !Game_IntermittentBlockShown;
        
        for (var ThisBlock in Game_Blocks)
        {
          Game_Blocks[ThisBlock].setVisible(Game_IntermittentBlockShown);
          Game_Blocks[ThisBlock].setGhost(!Game_IntermittentBlockShown);
        }
        
        Game_IntermittentBlockCount = Game_IntermittentBlockCountMax;
      }
    }
    
    if (Game_LevelComplete > 0)
    {
      if (Game_LevelComplete == 1)
      {
        Game_LevelStarted = false;
        
        Game_Old_Material     = Game_Material;
        Game_Old_AmmoSprite   = Game_AmmoSprite;
        Game_Old_ShootingSpot = Game_ShootingSpot;
        Game_Old_Props        = Game_Props;
        Game_Old_Blocks       = Game_Blocks;
        Game_NumberOfPlayersInLastLevel = Game_NumberOfPlayers;

        Game_CurrentLevel++;
        SoundPlay('levelachieved');
        Game_SynthSFX('levelup');
        Game_StopBackgroundMusic();

        // Save progress and unlock next level
        if (window.GameProgress) {
          var completedLevel = Game_CurrentLevel - 1;
          GameProgress.completeLevel(completedLevel, Game_Score);
        }

        if (Game_CurrentLevel <= Game_MaxLevels)
        {
          Game_PlayersInLastLevel = new Array();
          for (var ThisPlayer in Game_PlayersArray)
          {
            if (Game_PlayersArray[ThisPlayer].LivingState == 0)
            {
              if (Game_PlayersInLastLevel == null)
              {
                Game_PlayersInLastLevel = new Array();
              }
              Game_PlayersInLastLevel.push(Game_PlayersArray[ThisPlayer].Type);
            }
          }
          
          // Let's make every block as Ghost.  This will make scrolling smoother.
          for (var j in Game_Blocks)
          {
            if (Game_Blocks[j])
            {
              Game_Blocks[j].setGhost(true);
            }
          }

          for (var j in Game_Players)
          {
            if (Game_Players[j])
            {
              Game_Players[j].Strength =  5;
              Game_Players[j].setVelocity(5);
            }
          }

          if (Game_Camera)
          {
            Game_Camera.X = Game_LevelCameraX;
            Game_Camera.Y = Game_LevelCameraY;
          }

          // Pause game and show shop - level only loads after CONTINUE
          TimeLine_SpritePlay(false);
          Game_ShowShop_BeforeNextLevel();
        }
        else
        {
          Game_TheEnd();
        }
        
        Game_LevelComplete++;
      }
    }
    
    if (--Game_MusicNextNoteWait <= 0)
    {
      Game_MusicNextNoteWait   = Math.floor(g_FramesPerSecond * 10) + 20;
      SoundPlay(Game_Noise_Owl);
    }
  }
  
  if (Game_TooltipTime > 0)
  {
    Game_TooltipDisplayCheck();
  }
  
  if (Game_InGameTipDisplayTime > -1)
  {
    Game_InGameTipDisplayTime--;
    
    if (Game_InGameTipDisplayTime <= 0)
    {
      if (Game_InGameTipLabel)
      {
        Game_InGameTipLabel.ScheduleDestruction = true;
        Game_InGameTipLabel = null;
        Game_InGameTipDisplayTime = -1;
      }
    }
  }
  
  if (Game_TriggerFrameStop)
  {
    Game_TriggerFrameStop = false;
    ClearTimeLine(false,false);
    return false;
  }
  else
  {
    return true;
  }
}

function Game_UpdateZombieTargets()
{
  for (var ZombieId in Game_Zombies)
  {
    var Zombie = Game_Zombies[ZombieId];
    if (Zombie)
    {
      Zombie.findTarget();
    }
  }
}

function Game_UpdateScreenInfo()
{
  ReplaceHTML('id_snowstock',Game_SnowStock);
  
  for (var ThisAmmo in Game_Ammo)
  {
    Game_UpdateAmmoScreenIfo(ThisAmmo);
  }
}

function Game_UpdateScreenScoreInfo()
{
  var scoreText = ': <span class="scoreamount">' + Game_Score + '</span>';
  if (Game_ComboMultiplier >= 2)
  {
    scoreText += ' <span style="color:#FFD700;font-size:14px;">x' + Game_ComboMultiplier + '</span>';
  }
  ReplaceHTML('span_scoreboard', scoreText);
}

function Game_UpdateProgressBar()
{
  var total = Game_LevelTotalZombies;
  var killed = Game_ZombiesKilledThisLevel;
  var pct = total > 0 ? Math.round((killed / total) * 100) : 0;

  var bar = document.getElementById('span_progress_bar');
  var text = document.getElementById('span_progress_text');
  if (bar) { bar.style.width = pct + '%'; }
  if (text) { text.textContent = killed + '/' + total; }
}

function Game_ShowCombo(multiplier, points)
{
  var el = document.getElementById('combo-display');
  if (el)
  {
    el.textContent = 'x' + multiplier + ' COMBO! +' + points;
    el.className = 'visible';
  }
  if (multiplier >= 3) Game_SynthSFX('combo');
}

function Game_HideCombo()
{
  var el = document.getElementById('combo-display');
  if (el) { el.className = ''; }
}

function Game_UpdateAmmoScreenIfo(AmmoType)
{
  ReplaceHTML(Game_Ammo[AmmoType].CountId,Game_Ammo[AmmoType].Count);
}

// Level completion check - called after any zombie death (BounceCheck, lightning, area bomb, etc.)
function Game_CheckLevelCompletion()
{
  if ((Game_ZombieTotalSpawnCount >= Game_LevelTotalZombies) && (Game_ZombiesInGame <= 0) && !Game_GameIsOver)
  {
    var stars = Game_CalculateLevelStars();
    Game_SaveLevelStars(Game_CurrentLevel, stars);
    Game_ShowLevelStarsResult(stars);
    Game_EarnSkillPoints(stars);
    Game_SubmitOnlineScore();
    Game_SaveAchievements();
    Game_GameIsOver = true;
    Game_ShowStatsScreen(Game_EndlessMode);
  }
}

// Lightning strike power-up: full-screen flash, thunder, kill all zombies
function Game_LightningStrike()
{
  // 1) Full-screen white flash overlay
  var flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9000;pointer-events:none;background:#fff;opacity:0.95;';
  document.body.appendChild(flash);

  // Flash sequence: bright → dim → bright → fade out
  setTimeout(function() { flash.style.opacity = '0.3'; }, 80);
  setTimeout(function() { flash.style.opacity = '0.85'; }, 150);
  setTimeout(function() { flash.style.opacity = '0.2'; }, 250);
  setTimeout(function() { flash.style.transition = 'opacity 0.5s'; flash.style.opacity = '0'; }, 350);
  setTimeout(function() { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 900);

  // 2) Thunder sound via Web Audio API
  Game_PlayThunderSound();

  // 3) Lightning bolt SVG effect on the game area
  var bolt = document.createElement('div');
  var boltSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  boltSvg.setAttribute('viewBox', '0 0 100 200');
  boltSvg.style.cssText = 'width:120px;height:240px;filter:drop-shadow(0 0 20px #88ccff) drop-shadow(0 0 40px #4488ff);';
  var boltPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  boltPoly.setAttribute('points', '50,0 30,80 55,75 35,200 70,90 45,95');
  boltPoly.setAttribute('fill', '#ddeeff');
  boltPoly.setAttribute('stroke', '#88ccff');
  boltPoly.setAttribute('stroke-width', '2');
  boltSvg.appendChild(boltPoly);
  bolt.appendChild(boltSvg);
  bolt.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:9001;pointer-events:none;opacity:1;';
  document.body.appendChild(bolt);
  setTimeout(function() { bolt.style.transition = 'opacity 0.3s'; bolt.style.opacity = '0'; }, 300);
  setTimeout(function() { if (bolt.parentNode) bolt.parentNode.removeChild(bolt); }, 700);

  // 4) Kill all alive zombies after brief delay (so flash is visible first)
  setTimeout(function() {
    if (!window.Game_Zombies) return;
    var killCount = 0;
    for (var key in Game_Zombies)
    {
      var zombie = Game_Zombies[key];
      if (zombie && zombie.LivingState === 0)
      {
        zombie.doAction('die');
        zombie.setGhost(true);
        if (typeof Game_SpriteDyingEffect === 'function') Game_SpriteDyingEffect(zombie);
        if (typeof Game_SpawnDeathParticles === 'function') Game_SpawnDeathParticles(zombie);
        Game_ZombiesInGame--;
        Game_ZombiesKilledThisLevel++;
        Game_TotalKills++;
        var worth = (Game_ZombieTypes && zombie.ZombieType && Game_ZombieTypes[zombie.ZombieType])
          ? Game_ZombieTypes[zombie.ZombieType].Worth : 100;
        Game_Score += worth;
        killCount++;
      }
    }
    Game_UpdateProgressBar();
    Game_UpdateScreenInfo();
    if (killCount > 0)
    {
      Game_ShowFloatingText('LIGHTNING! x' + killCount, '#88CCFF', null);
      SoundPlay('zombiedead');
    }
    // Check if this cleared the level
    Game_CheckLevelCompletion();
  }, 120);
}

// Synthesize a thunder crack using Web Audio API
function Game_PlayThunderSound()
{
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    var duration = 0.8;
    var sampleRate = ctx.sampleRate;
    var bufferSize = Math.floor(sampleRate * duration);
    var buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    var data = buffer.getChannelData(0);

    // White noise with exponential decay = thunder rumble
    for (var i = 0; i < bufferSize; i++)
    {
      var t = i / sampleRate;
      // Sharp initial crack then rumble decay
      var envelope = (t < 0.02) ? 1.0 : Math.exp(-t * 4) * 0.7;
      // Add a low rumble component
      envelope += (t > 0.05 && t < 0.6) ? Math.sin(t * 80) * Math.exp(-t * 3) * 0.3 : 0;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    var source = ctx.createBufferSource();
    source.buffer = buffer;

    // Low-pass filter for bass rumble
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    var gain = ctx.createGain();
    gain.gain.value = 0.6;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);

    // Clean up context after sound finishes
    setTimeout(function() { ctx.close(); }, 1500);
  } catch(e) {
    // Silently fail if Web Audio not available
  }
}

function Game_SpriteDead(Sprite)
{
  if (Sprite.isZombie)
  {
    delete Game_Zombies[Sprite.Id];
  }
  else if (Sprite.isPlayer)
  {
    for (var ThisPlayer in Game_PlayersArray)
    {
      if (Game_PlayersArray[ThisPlayer].Id == Sprite.Id)
      {
        delete Game_PlayersArray[ThisPlayer];
        break;
      }
    }
    delete Game_Players[Sprite.Id];
  }
  else if (Sprite.isWeapon)
  {
    delete Game_Weapons[Sprite.Id];
  }
}

function Game_BounceCheck(Sprite1,Sprite2)
{
  var Result = true;
  var WeaponFailed = false;
  var KillerWeapon = null;
  var Killer = null;
  var IceBlock = null;
  var DeadZombie   = null;
  var EatenZombie   = null;
  if (Sprite1.isPlayer && Sprite2.isPlayer)
  {
    Result = false;
  }
  else if (Sprite1.isWeapon)
  {
    if (Sprite2.isZombie && (Sprite2.LivingState == 0))
    {
      KillerWeapon = Sprite1;
      Sprite1._hitSomething = true;
      Game_LevelShotsHit++;

      // Critical hit check
      var isCritical = Math.random() < Game_CriticalHitChance;
      var hitStrength = Sprite1.WeaponStrength;
      if (isCritical) { hitStrength *= Game_CriticalHitMultiplier; Game_SpriteCriticalEffect(Sprite2); }

      if (Sprite2.ZombieStrength > hitStrength)
      {
        Sprite2.ZombieStrength -= hitStrength;
        Sprite1.WeaponStrength = 0;
      }
      else
      {
        Sprite1.WeaponStrength -= Sprite2.ZombieStrength;
        Sprite2.ZombieStrength = 0;
      }

      Game_ShowDamageNumber(hitStrength, Sprite2, isCritical);

      if (Sprite2.ZombieStrength <= 0)
      {
        DeadZombie   = Sprite2;
      }
      else
      {
        SoundPlay('zombiehit');
        WeaponFailed = true;
        // Visual hit flash + sparks on zombie
        Game_SpriteHitFlash(Sprite2);
        Game_SpawnHitSparks(Sprite2);
      }
    }

    Result = false;
  }
  else if (Sprite2.isWeapon)
  {
    if (Sprite1.isZombie && (Sprite1.LivingState == 0))
    {
      KillerWeapon = Sprite2;
      Sprite2._hitSomething = true;
      Game_LevelShotsHit++;

      // Critical hit check
      var isCritical2 = Math.random() < Game_CriticalHitChance;
      var hitStrength2 = Sprite2.WeaponStrength;
      if (isCritical2) { hitStrength2 *= Game_CriticalHitMultiplier; Game_SpriteCriticalEffect(Sprite1); }

      if (Sprite1.ZombieStrength > hitStrength2)
      {
        Sprite1.ZombieStrength -= hitStrength2;
        Sprite2.WeaponStrength = 0;
      }
      else
      {
        Sprite2.WeaponStrength -= Sprite1.ZombieStrength;
        Sprite1.ZombieStrength = 0;
      }

      Game_ShowDamageNumber(hitStrength2, Sprite1, isCritical2);

      if (Sprite1.ZombieStrength <= 0)
      {
        DeadZombie   = Sprite1;
      }
      else
      {
        SoundPlay('zombiehit');
        WeaponFailed = true;
        // Visual hit flash + sparks on zombie
        Game_SpriteHitFlash(Sprite1);
        Game_SpawnHitSparks(Sprite1);
      }
    }

    Result = false;
  }
  else if (Sprite1.isIceBlock && !Sprite2.isDinosaur)
  {
    IceBlock = Sprite1;
  }
  else if (Sprite2.isIceBlock && !Sprite1.isDinosaur)
  {
    IceBlock = Sprite2;
  }
  else
  {
    var DeadPlayer = null;
    if (Sprite1.isZombie && Sprite2.isPlayer)
    {
      if (Sprite1.LivingState == 0)
      {
        Killer = Sprite1;
        DeadPlayer = Sprite2;
      }
      else
      {
        Result = false;
      }
    }
    else if (Sprite2.isZombie && Sprite1.isPlayer)
    {
      if (Sprite2.LivingState == 0)
      {
        Killer = Sprite2;
        DeadPlayer = Sprite1;
      }
      else
      {
        Result = false;
      }
    }
    else if (Sprite1.isDinosaur && Sprite2.isZombie && !Sprite2.isDinosaur)
    {
      // Dinosaur eats everything, even other zombies.
      Result = false;
      
      if ((Sprite1.LivingState == 0) && (Sprite2.LivingState == 0))
      {
        Killer = Sprite1;
        EatenZombie = Sprite2;
      }
    }
    else if (Sprite2.isDinosaur && Sprite1.isZombie && !Sprite1.isDinosaur)
    {
      // Dinosaur eats everything, even other zombies.
      Result = false;
      
      if ((Sprite1.LivingState == 0) && (Sprite2.LivingState == 0))
      {
        Killer = Sprite2;
        EatenZombie = Sprite1;
      }
    }
    else if (Sprite1.isDinosaur || Sprite2.isDinosaur)
    {
      Result = false;
    }
    
    if (DeadPlayer && (DeadPlayer.LivingState == 0))
    {
      SoundPlay(Player_Sounds[DeadPlayer.Type].Killed);
      // Visual damage feedback: hurt flash + screen shake
      Game_SpriteHurtFlash(DeadPlayer);
      Game_ScreenShake();
      Game_LevelDamageTaken++;
      if (Killer && Killer.isDinosaur)
      {
        Game_SpriteDead(DeadPlayer);
        DeadPlayer.ScheduleDestruction = true;
      }
      else
      {
        DeadPlayer.setStateImage('',2);
        DeadPlayer.doAction('die');
      }
      
      if (Game_PlayerShooter && (Game_PlayerShooter.Id == DeadPlayer.Id))
      {
        Game_PlayerShooter = null;
      }
      
      Game_NumberOfPlayers--;
      
      if (Game_NumberOfPlayers <= 0)
      {
        Game_GameOver();
      }
      else
      {
        SoundPlay('playerkilled');
      }
    }
  }
  
  if (KillerWeapon)
  {
    if ((KillerWeapon.WeaponStrength <= 0) || WeaponFailed)
    {
      if (!KillerWeapon.ScheduleDestruction)
      {
        KillerWeapon.ScheduleDestruction = true;
        Game_NumberShotWeapons--;
      }
    }
  }
  
  if (IceBlock)
  {
    if (--IceBlock.BlockLife <= 0)
    {
      for (var ThisIceBlock in Game_Blocks)
      {
        if (Game_Blocks[ThisIceBlock].Id == IceBlock.Id)
        {
          delete Game_Blocks[ThisIceBlock];
          break;
        }
      }
      IceBlock.ScheduleDestruction = true;
      SoundPlay('iceblockdown');
    }
  }
  
  if (DeadZombie && !EatenZombie)
  {
    EatenZombie = DeadZombie;
  }
  
  if (DeadZombie || EatenZombie)
  {
    SoundPlay('zombiedead');
    if (Killer && Killer.isDinosaur)
    {
      Game_SpriteDead(EatenZombie);
      EatenZombie.ScheduleDestruction = true;
    }
    else
    {
      EatenZombie.doAction('die');
      EatenZombie.setGhost(true);
      // Visual death effect
      Game_SpriteDyingEffect(EatenZombie);
      Game_SpawnDeathParticles(EatenZombie);
    }

    // Splitter zombie: spawn 2 minis on death
    Game_HandleSplitterDeath(EatenZombie);
    // Special weapon effects (Area Bomb, Ice Wall)
    if (KillerWeapon) Game_HandleSpecialWeaponEffect(KillerWeapon, EatenZombie);

    Game_ZombiesInGame--;
    Game_ZombiesKilledThisLevel++;
    Game_TotalKills++;
    Game_UpdateProgressBar();

    if (DeadZombie)
    {
      // Combo system: quick successive kills multiply score.
      Game_ComboCount++;
      Game_ComboTimer = Game_ComboTimeoutFrames; // Reset combo timer
      Game_ComboMultiplier = Math.min(Game_ComboCount, 10); // Cap at x10

      var BaseWorth = Game_ZombieTypes[DeadZombie.ZombieType].Worth;
      var ComboBonus = BaseWorth * Game_ComboMultiplier;
      Game_Score += ComboBonus;

      // Score popup at kill location
      Game_ShowScorePopup(ComboBonus, EatenZombie);

      if (Game_ComboMultiplier >= 2)
      {
        Game_ShowCombo(Game_ComboMultiplier, ComboBonus);
        Game_ComboScreenFlash(Game_ComboMultiplier);
      }

      if (Game_HighScore < Game_Score)
      {
        Game_HighScore = Game_Score;
        Game_NewHighScore = true;
      }

      Game_UpdateScreenScoreInfo();

      // Kill streak system
      Game_KillStreak++;
      if (Game_KillStreak > Game_KillStreakBest) Game_KillStreakBest = Game_KillStreak;
      Game_CheckKillStreakReward();

      // Weapon upgrade: track kills per weapon type
      if (KillerWeapon && KillerWeapon.WeaponType)
      {
        Game_WeaponKills[KillerWeapon.WeaponType]++;
        var newLevel = Math.floor(Game_WeaponKills[KillerWeapon.WeaponType] / Game_WeaponKillsPerLevel) + 1;
        if (newLevel > Game_WeaponLevels[KillerWeapon.WeaponType])
        {
          Game_WeaponLevels[KillerWeapon.WeaponType] = newLevel;
          Game_WeaponTypes[KillerWeapon.WeaponType].Strength++;
          Game_WeaponTypes[KillerWeapon.WeaponType].LifeSpan += 5;
          Game_ShowWeaponLevelUp(KillerWeapon.WeaponType, newLevel);
        }
      }
    }

    Game_CheckLevelCompletion();
  }
  
  return Result;
}

function Game_SpriteSelectable(Sprite)
{
  return Sprite.isPlayer;
}

function Game_PlayerLookWhereToShoot(PlayerShooter,X,Y)
{
  if (PlayerShooter.X < X)
  {
    PlayerShooter.setStateImage('walk01',0);
  }
  else
  {
    PlayerShooter.setStateImage('walk03',0);
  }
}

function Game_PlayerShoot(X,Y,TargetX,TargetY)
{
  if (Game_NumberShotWeapons < Game_MaxShotWeapons)
  {
    var WeaponType = Game_SelectedWeapon;
    
    if (Game_Ammo[WeaponType].Count > 0)
    {
      var Weapon    = Game_CreateAndPlaceWeapon(X,Y,WeaponType);
      // Add projectile glow effect
      Game_SpriteProjectileEffect(Weapon);
      SetSpriteTarget(Weapon,TargetX,TargetY,null,false,false);
      Weapon.Target = -1;
      Weapon.moveToTarget();
      
      Game_Ammo[WeaponType].Count--;

      Game_UpdateAmmoScreenIfo(WeaponType);
      Game_NumberShotWeapons++;
      Game_LevelShotsFired++;
      SoundPlay('weaponlaunched');
    }
  }
}

function Game_GroundClicked(X,Y,PreviouslySelectedSprite)
{
  // Turret placement mode
  if (Game_TurretMode)
  {
    if (Game_BuildTurret(X, Y))
    {
      Game_TurretMode = false;
      var btn = document.getElementById('id_turret_btn');
      if (btn) btn.style.borderColor = '#4488CC';
    }
    return;
  }

  if (Game_PlayerShooter)
  {
    Game_PlayerLookWhereToShoot(Game_PlayerShooter,X,Y);
    Game_PlayerShoot(Game_PlayerShooter.X,Game_PlayerShooter.Y,X,Y);
  }

  if ((X >= Game_BaseX) && (X <= Game_BaseX + Game_BaseWidth) && 
      (Y >= Game_BaseY - Game_BaseHeight) && (Y <= Game_BaseY))
  {
    if (PreviouslySelectedSprite && (PreviouslySelectedSprite.isPlayer) && ((Game_PlayerShooter && Game_PlayerShooter.Id != PreviouslySelectedSprite.Id) || !Game_PlayerShooter))
    {
      PreviouslySelectedSprite.GameObjective = 'ReturnToBase';
      PreviouslySelectedSprite.setStateImage('',2);
      SetSpriteTarget(PreviouslySelectedSprite,PreviouslySelectedSprite.BaseX,PreviouslySelectedSprite.BaseY,null,true,false);
    }
  }
}

function Game_CameraMoved()
{
  if (Game_JustStarted)
  {
    Game_StartLevel();
    Game_JustStarted = false;
  }
}

function Game_StartLevel()
{
  if (Game_InGameTipLabel)
  {
    Game_InGameTipDisplayTime = Math.floor(g_FramesPerSecond * 3);
  }
  
  if (g_isMobileSafari)
  {
    SetAnimationFPS(Game_CurrentLevelFramesPerSecond);
  }
  
  if (Game_Old_Material)
  {
    Game_Old_Material.ScheduleDestruction = true;
  }
  
  if (Game_Old_AmmoSprite)
  {
    Game_Old_AmmoSprite.ScheduleDestruction = true;
  }
  
  if (Game_Old_ShootingSpot)
  {
    Game_Old_ShootingSpot.ScheduleDestruction = true;
  }
  
  for (var ThisProp in Game_Old_Props)
  {
    Game_Old_Props[ThisProp].ScheduleDestruction = true;
  }

  for (var ThisBlock in Game_Old_Blocks)
  {
    Game_Old_Blocks[ThisBlock].ScheduleDestruction = true;
  }

  Game_LevelComplete = 0;
  DoGeneralAction('nocamera',null);
  Game_LevelStarted = true;

  // Wave countdown before zombies start - block spawning until done
  Game_CountdownActive = true;
  Game_ShowWaveCountdown(function() { Game_CountdownActive = false; });

  for (var j in Game_Players)
  {
    if (Game_Players[j])
    {
      Game_Players[j].Strength = Game_Sprite_TypeProperties[Game_Players[j].Type].Strength;
      Game_Players[j].setVelocity(Game_Sprite_TypeProperties[Game_Players[j].Type].VelLimit);
    }
  }

  // Apply persistent shop upgrades to players & weapons
  Game_ApplyShopUpgrades();
  // Apply skill tree
  Game_ApplySkillTree();
  // Update weapon UI for unlocked weapons
  Game_UpdateWeaponUI();
  // Store base FPS for speed control
  if (Game_BaseFramesPerSecond === 0) Game_BaseFramesPerSecond = g_FramesPerSecond;
  // Start background music
  var musicGroup = Math.floor((Game_CurrentLevel - 1) / 10);
  Game_StartBackgroundMusic(musicGroup);
}

function Game_TheEnd()
{
  Game_GameEndScreen.className = 'gameend div_shown';
}

function Game_GameOver()
{
  Game_GameIsOver = true;

  // Clear all power-ups
  if (window.PowerupSystem)
  {
    PowerupSystem.clearAll();
  }

  // Populate game over stats
  var precision = Game_LevelShotsFired > 0 ? Math.round((Game_LevelShotsHit / Game_LevelShotsFired) * 100) : 0;
  var el;
  el = document.getElementById('gameover_score'); if (el) el.textContent = Game_Score;
  el = document.getElementById('gameover_level'); if (el) el.textContent = Game_CurrentLevel;
  el = document.getElementById('gameover_kills'); if (el) el.textContent = Game_ZombiesKilledThisLevel;
  el = document.getElementById('gameover_accuracy'); if (el) el.textContent = precision + '%';
  el = document.getElementById('gameover_combo'); if (el) el.textContent = 'x' + Math.max(1, Game_ComboMultiplier);

  // Show high score notice
  var hsNotice = document.getElementById('gameover_highscore_notice');
  if (hsNotice) {
    hsNotice.style.display = (Game_NewHighScore) ? 'block' : 'none';
  }

  // Check for high score and show entry dialog
  if (window.HighScoreUI && window.GameProgress) {
    if (GameProgress.isHighScore(Game_Score)) {
      setTimeout(function() {
        HighScoreUI.showHighScoreEntry(Game_Score, Game_CurrentLevel);
      }, 1000);
    }
  }

  Game_GameOverScreen.className = 'gameover div_shown';
  SoundPlay('gameover');
}

function Game_LevelSelection()
{
  Game_SelectLevelScreen.className = 'selectlevel div_shown';
  Game_LoadLevelStars();
  // Show stars on level buttons
  Game_UpdateLevelSelectStars();
}

function Game_UpdateLevelSelectStars()
{
  for (var lvl = 1; lvl <= Game_MaxLevels; lvl++)
  {
    var btn = document.getElementById('id_level_' + lvl);
    if (!btn) continue;
    var stars = Game_LevelStars[lvl] || 0;
    var existing = btn.querySelector('.level-stars');
    if (existing) existing.parentNode.removeChild(existing);
    if (stars > 0)
    {
      var starSpan = document.createElement('span');
      starSpan.className = 'level-stars';
      starSpan.style.cssText = 'display:block;font-size:8px;color:#FFD700;line-height:1;';
      var txt = '';
      for (var s = 0; s < 3; s++) txt += (s < stars) ? '\u2605' : '\u2606';
      starSpan.textContent = txt;
      btn.appendChild(starSpan);
    }
  }
}

function Game_SelectLevelFromScreen(Level)
{
  Game_NumberOfPlayersInLastLevel = -1;
  Game_PlayersInLastLevel = null;
  Game_CurrentLevel = Level;
  Game_Start(true);
}

function Game_ShowAboutScreen()
{
  Game_AboutScreen.className = 'about div_shown';
}

function Game_UpdateZombieStuckDetection()
{
  var StuckThresholdFrames = Math.floor(g_FramesPerSecond * 8); // 8 seconds without progress = stuck
  var MinMovementDistance = 10; // Must move at least 10px in 8 seconds

  for (var ZombieId in Game_Zombies)
  {
    var Zombie = Game_Zombies[ZombieId];
    if (!Zombie || Zombie.LivingState !== 0) continue;

    // Count down ghost timer if active.
    if (Zombie.StuckGhostFrames > 0)
    {
      Zombie.StuckGhostFrames--;
      if (Zombie.StuckGhostFrames <= 0)
      {
        // Restore normal collision.
        Zombie.setGhost(false);
        Zombie.SmartTargetGiveUpCount = 0;
        // Reset stuck tracking so we start fresh.
        Zombie.StuckCheckX = Zombie.X;
        Zombie.StuckCheckY = Zombie.Y;
        Zombie.StuckTimer = 0;
      }
      continue; // Skip stuck detection while in ghost mode.
    }

    // Initialize stuck tracking.
    if (Zombie.StuckTimer === undefined)
    {
      Zombie.StuckCheckX = Zombie.X;
      Zombie.StuckCheckY = Zombie.Y;
      Zombie.StuckTimer = 0;
    }

    Zombie.StuckTimer++;

    if (Zombie.StuckTimer >= StuckThresholdFrames)
    {
      // Check if zombie moved enough since last check.
      var dx = Math.abs(Zombie.X - Zombie.StuckCheckX);
      var dy = Math.abs(Zombie.Y - Zombie.StuckCheckY);

      if (dx + dy < MinMovementDistance)
      {
        // Zombie hasn't moved significantly - it's stuck.
        // Activate ghost mode to phase through obstacle.
        Zombie.setGhost(true);
        Zombie.StuckGhostFrames = Math.floor(g_FramesPerSecond * 2);
        // Re-seek target so it moves toward the player.
        Zombie.findTarget();
      }

      // Reset tracking for next check period.
      Zombie.StuckCheckX = Zombie.X;
      Zombie.StuckCheckY = Zombie.Y;
      Zombie.StuckTimer = 0;
    }
  }
}

function Game_SmartTargetGivenUp(Sprite)
{
  // Track how many times pathfinding has given up for this zombie.
  if (!Sprite.SmartTargetGiveUpCount) { Sprite.SmartTargetGiveUpCount = 0; }
  Sprite.SmartTargetGiveUpCount++;

  if (Sprite.isZombie && Sprite.SmartTargetGiveUpCount >= 3)
  {
    // Zombie is stuck after 3 failed pathfinding attempts.
    // Make it temporarily ghost so it phases through the obstacle.
    Sprite.setGhost(true);
    Sprite.StuckGhostFrames = Math.floor(g_FramesPerSecond * 2); // Ghost for 2 seconds
    Sprite.SmartTargetGiveUpCount = 0;
  }

  // Restart target seeking.
  SetSpriteTarget(Sprite,Sprite.TargetX,Sprite.TargetY,null,true,false);
}

function Game_QuitLevel()
{
  if (!Game_GameIsOver)
  {
    TimeLine_SpritePlay(false);
    Game_QuitLevelConfirmation.className = 'quitlevelconfirm div_shown';
  }
}

function Game_PauseLevel()
{
  if (g_TimerCounter_Object && !g_TimeLine_Paused && !Game_GameIsOver)
  {
    TimeLine_SpritePlay(false);
    Game_UserPaused = true;

    // Populate pause stats
    var el;
    el = document.getElementById('pause_score'); if (el) el.textContent = Game_Score;
    el = document.getElementById('pause_level'); if (el) el.textContent = Game_CurrentLevel;
    el = document.getElementById('pause_kills'); if (el) el.textContent = Game_ZombiesKilledThisLevel;
    el = document.getElementById('pause_snow'); if (el) el.textContent = Game_SnowStock;

    Game_PauseLevelScreen.className = 'pauselevel div_shown';
  }
}

function Game_DismissQuitLevelConfirm()
{
  if (!Game_UserPaused)
  {
    TimeLine_SpritePlay(true);
  }
  Game_QuitLevelConfirmation.className = 'quitlevelconfirm div_hidden';
}

function Game_DismissPauseDialog()
{
  Game_UserPaused = false;
  TimeLine_SpritePlay(true);
  Game_PauseLevelScreen.className = 'pauselevel div_hidden';
}

function Game_ReachedWall(Sprite,BounceForce)
{
  if (Sprite.isWeapon)
  {
    // For now... (because it could explode or whatever).
    if (!Sprite.ScheduleDestruction)
    {
      Game_NumberShotWeapons--;
      Sprite.ScheduleDestruction = true;
    }
  }
}

function Game_OffScreen(Sprite)
{
  // Called when the Sprite gets off-screen.
  if (Sprite.isWeapon)
  {
    // For now... (because it could explode or whatever).
    if (!Sprite.ScheduleDestruction)
    {
      Game_NumberShotWeapons--;
      Sprite.ScheduleDestruction = true;
    }
  }
}

function Game_OffScreenTooLong(Sprite)
{
  // Called when the Sprite's associated bitmap is destroyed after being off-screen for too long.
  // (To save space).
}

function Game_OnScreen(Sprite)
{
  // Called when the Sprite gets on screen. (Bitmap may be recreated in the process).
}

function Game_BounceForce(Sprite1,Sprite2,BounceForce)
{
  //if (BounceForce>2)
  //{
  //}
}

function Game_SelectWeapon(Weapon,ShowTooltip)
{
  if (Game_WeaponTypes[Weapon])
  {
    var SelectedButton = document.getElementById(Game_WeaponTypes[Weapon].HTMLButtonId);
    
    if (SelectedButton)
    {
      Game_g_ControlBar_SelectedButton = SelectedButton;
      Game_SelectedWeapon = Weapon;

      var ButtonDivDimensions = getDimensions(Game_g_ControlBar_SelectedButton);

      if (Game_g_ControlBar_SelectIndicator) {
        Game_g_ControlBar_SelectIndicator.style.top  = 0;
        Game_g_ControlBar_SelectIndicator.style.left = ButtonDivDimensions.left;
        Game_g_ControlBar_SelectIndicator.className  = 'control_selectedbutton img_shown';
      }
    }
    
    if (ShowTooltip)
    {
      Game_PrintStatusBar(Game_WeaponTypes[Weapon].Tooltip);
    }
  }
}

function Game_ControlBar_DeselectButton()
{
  if (Game_g_ControlBar_SelectedButton && Game_g_ControlBar_SelectIndicator)
  {
    Game_g_ControlBar_SelectIndicator.className  = 'control_selectedbutton img_hidden';
  }
  Game_g_ControlBar_SelectedButton = null;
  Game_SelectedWeapon = '';
}

function Game_Exit()
{
}

function Game_FramesPerSecondChanged()
{
  Game_SetZombieSpawnCountMax(Game_ZombieLevelSpawnCountMax);
  Game_MusicNextNoteWait   = Math.floor(g_FramesPerSecond * 20) + 10;
  Game_TooltipMaxTime      = Math.floor(g_FramesPerSecond * 5);
  Game_IntermittentBlockCountMax = Math.floor(g_FramesPerSecond * 1);
}

function Game_SetZombieSpawnCountMax(TimeInSeconds)
{
  Game_ZombieSpawnCountMax = Math.floor(g_FramesPerSecond * TimeInSeconds);
}

function Game_GameEnd()
{
  Game_GameIsOver = true;
  Game_FromGameToMainMenu(true);
  Game_ShowAboutScreen();
}

function Game_Tutorial()
{
  Game_TutorialPage = 1;
  Game_MainMenu.className   = 'div_hidden';
  Game_Tutorial_ShowPage(Game_TutorialPage);
  Game_TutorialScreen.className = 'tutorial div_shown';
}

function Game_Tutorial_ShowPage(Page)
{
  var Previous = document.getElementById('id_tutorial_screen_previous');
  var Next     = document.getElementById('id_tutorial_screen_next');
  
  if ((Page >= 1) && (Page <= Game_TutorialMaxPages))
  {
    for (var i=1;i<=Game_TutorialMaxPages;i++)
    {
      var ThisPage = document.getElementById('id_tutorial_screen_' + i);
      if (ThisPage)
      {
        if (Page == i)
        {
          ThisPage.className = 'tutorialpage img_shown';
          Game_TutorialPage = Page;
        }
        else
        {
          ThisPage.className = 'tutorialpage img_hidden';
        }
      }
    }
  }
  
  if (Previous)
  {
    if (Page == 1)
    {
      Previous.style.visibility = 'hidden';
    }
    else
    {
      Previous.style.visibility = 'visible';
    }
  }
  
  if (Next)
  {
    if (Page == Game_TutorialMaxPages)
    {
      Next.style.visibility = 'hidden';
    }
    else
    {
      Next.style.visibility = 'visible';
    }
  }
}

function Game_Tutorial_PreviousPage()
{
  Game_Tutorial_ShowPage(Game_TutorialPage - 1);
}

function Game_Tutorial_NextPage()
{
  Game_Tutorial_ShowPage(Game_TutorialPage + 1);
}

function Game_PrintStatusBar(Text)
{
  if (document.getElementById('div_infoscreen'))
  {
    ReplaceHTML('div_infoscreen',Text);
    Game_TooltipTime = Game_TooltipMaxTime;
  }
}

function Game_TooltipDisplayCheck()
{
  Game_TooltipTime--;
  if (Game_TooltipTime == 0)
  {
    ReplaceHTML('div_infoscreen','');
  }
}

// ==============================================
// VISUAL EFFECTS SYSTEM
// ==============================================

// Flash white when a zombie is hit but not killed
function Game_SpriteHitFlash(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.add('sprite-hit');
    setTimeout(function() {
      if (Sprite.Image) Sprite.Image.classList.remove('sprite-hit');
    }, 120);
  }
}

// Red hurt flash when a player takes fatal damage
function Game_SpriteHurtFlash(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.add('sprite-hurt');
    setTimeout(function() {
      if (Sprite.Image) Sprite.Image.classList.remove('sprite-hurt');
    }, 200);
  }
}

// Fade + grayscale when a zombie dies
function Game_SpriteDyingEffect(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.remove('sprite-shadow');
    Sprite.Image.classList.add('sprite-dying');
  }
}

// Scale-in animation when a zombie spawns
function Game_SpriteSpawnEffect(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.add('sprite-spawn');
    setTimeout(function() {
      if (Sprite.Image) Sprite.Image.classList.remove('sprite-spawn');
    }, 300);
  }
}

// Glow effect on weapon projectiles
function Game_SpriteProjectileEffect(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.remove('sprite-shadow');
    Sprite.Image.classList.add('sprite-projectile');
  }
}

// Screen shake when a player dies
function Game_ScreenShake()
{
  var container = document.getElementById('div_moviescreenframe');
  if (container)
  {
    container.classList.add('screen-shake');
    setTimeout(function() {
      container.classList.remove('screen-shake');
    }, 200);
  }
}

// ============================================
// CRITICAL HIT EFFECT - golden flash + text
// ============================================
function Game_SpriteCriticalEffect(Sprite)
{
  if (Sprite && Sprite.Image)
  {
    Sprite.Image.classList.add('sprite-critical');
    setTimeout(function() {
      if (Sprite.Image) Sprite.Image.classList.remove('sprite-critical');
    }, 300);
  }
  // Show CRITICAL text
  Game_ShowFloatingText('CRITICAL!', '#FFD700', Sprite);
  Game_SynthSFX('critical');
}

// ============================================
// FLOATING TEXT (reusable for criticals, streaks, etc.)
// ============================================
function Game_ShowFloatingText(text, color, Sprite)
{
  var el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = 'position:absolute;z-index:200;font-family:"Courier New",monospace;font-weight:bold;font-size:14px;color:' + color + ';text-shadow:2px 2px 0 #000;pointer-events:none;transition:all 0.8s;opacity:1;';
  if (Sprite && window.g_ViewPort_X !== undefined)
  {
    el.style.left = (Sprite.X + g_ViewPort_X) + 'px';
    el.style.top = (Sprite.Y + g_ViewPort_Y - 20) + 'px';
  }
  else
  {
    el.style.left = '50%';
    el.style.top = '40%';
  }
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  setTimeout(function() { el.style.top = (parseInt(el.style.top) - 30) + 'px'; el.style.opacity = '0'; }, 50);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
}

// ============================================
// KILL STREAK REWARDS
// ============================================
function Game_CheckKillStreakReward()
{
  for (var i = 0; i < Game_KillStreakThresholds.length; i++)
  {
    if (Game_KillStreak === Game_KillStreakThresholds[i])
    {
      var rewards = [
        { type: 'ammo', desc: '+50 SNOW!', action: function() { Game_SnowStock += 50; ReplaceHTML('id_snowstock', Game_SnowStock); } },
        { type: 'weapon', desc: '+3 FIRESOCK!', action: function() { Game_Ammo['Weapon01'].Count += 3; Game_UpdateAmmoScreenIfo('Weapon01'); } },
        { type: 'weapon', desc: '+3 SNOWBALL!', action: function() { Game_Ammo['Weapon02'].Count += 3; Game_UpdateAmmoScreenIfo('Weapon02'); } },
        { type: 'score', desc: '+500 PTS!', action: function() { Game_Score += 500; Game_UpdateScreenScoreInfo(); } }
      ];
      var reward = rewards[i % rewards.length];
      reward.action();
      Game_ShowStreakNotification(Game_KillStreak, reward.desc);
      break;
    }
  }
}

function Game_ShowStreakNotification(streak, rewardText)
{
  var el = document.createElement('div');
  el.style.cssText = 'position:absolute;top:80px;left:50%;transform:translateX(-50%);z-index:300;background:#0f0c29;border:3px solid #FF4400;padding:10px 20px;font-family:"Courier New",monospace;font-weight:bold;text-align:center;opacity:1;transition:opacity 0.5s;';
  var line1 = document.createElement('div');
  line1.style.cssText = 'color:#FF4400;font-size:18px;text-shadow:2px 2px 0 #000';
  line1.textContent = streak + ' KILL STREAK!';
  var line2 = document.createElement('div');
  line2.style.cssText = 'color:#FFD700;font-size:14px;margin-top:4px';
  line2.textContent = rewardText;
  el.appendChild(line1);
  el.appendChild(line2);
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; }, 2000);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 2500);
}

// ============================================
// WEAPON LEVEL UP NOTIFICATION
// ============================================
function Game_ShowWeaponLevelUp(weaponType, level)
{
  var name = Game_WeaponTypes[weaponType] ? Game_WeaponTypes[weaponType].Tooltip : weaponType;
  Game_ShowStreakNotification(0, '');
  var el = document.createElement('div');
  el.style.cssText = 'position:absolute;top:80px;left:50%;transform:translateX(-50%);z-index:300;background:#0f0c29;border:3px solid #00FF88;padding:10px 20px;font-family:"Courier New",monospace;font-weight:bold;text-align:center;opacity:1;transition:opacity 0.5s;';
  var line1 = document.createElement('div');
  line1.style.cssText = 'color:#00FF88;font-size:18px;text-shadow:2px 2px 0 #000';
  line1.textContent = name.toUpperCase() + ' LEVEL ' + level + '!';
  var line2 = document.createElement('div');
  line2.style.cssText = 'color:#88CCFF;font-size:14px;margin-top:4px';
  line2.textContent = '+1 DMG, +5 RANGE';
  el.appendChild(line1);
  el.appendChild(line2);
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; }, 2500);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
}

// ============================================
// Find nearest idle player to a given position (for auto-selecting when clicking stations)
function Game_FindNearestIdlePlayer(x, y)
{
  var bestPlayer = null;
  var bestDist = Infinity;
  for (var i in Game_PlayersArray)
  {
    var p = Game_PlayersArray[i];
    if (!p || p.LivingState !== 0) continue;
    if (p.GameObjective && p.GameObjective !== '') continue;
    // Skip the player currently at the shooting spot
    if (Game_PlayerShooter && Game_PlayerShooter.Id === p.Id) continue;
    var dx = p.X - x;
    var dy = p.Y - y;
    var dist = dx * dx + dy * dy;
    if (dist < bestDist) { bestDist = dist; bestPlayer = p; }
  }
  // If no non-shooter idle player found, allow the shooter as last resort
  if (!bestPlayer && Game_PlayerShooter && Game_PlayerShooter.LivingState === 0)
  {
    bestPlayer = Game_PlayerShooter;
  }
  return bestPlayer;
}

// AUTO-GATHER: idle players automatically gather materials
// ============================================
function Game_AutoGatherIdlePlayers()
{
  if (!Game_LevelStarted || Game_GameIsOver) return;
  for (var PlayerId in Game_PlayersArray)
  {
    var Player = Game_PlayersArray[PlayerId];
    if (Player && Player.LivingState === 0 && (!Player.GameObjective || Player.GameObjective === ''))
    {
      // Send idle player to gather material
      if (Game_Material && Game_AmmoSprite)
      {
        if (Game_SnowStock < 10 || Player.SnowStock === 0)
        {
          // Go gather snow
          Player.GameObjective = 'SeekMaterial';
          Player.setStateImage('',2);
          SetSpriteTarget(Player, Game_Material.X + Game_Material.RealImageWidth * 0.5, Game_Material.Y + Game_Material.RealImageHeight * 0.8, null, true, false);
        }
      }
    }
  }
}

// ============================================
// WAVE PREVIEW: show upcoming zombie types
// ============================================
function Game_UpdateWavePreview()
{
  var container = document.getElementById('wave-preview');
  if (!container)
  {
    container = document.createElement('div');
    container.id = 'wave-preview';
    container.style.cssText = 'position:absolute;bottom:5px;left:10px;z-index:100;display:flex;gap:3px;align-items:center;background:rgba(15,12,41,0.8);padding:3px 8px;border:1px solid #4488CC;font-family:"Courier New",monospace;font-size:10px;color:#88CCFF;';
    var gameContainer = document.getElementById('div_moviescreenframe');
    if (gameContainer) gameContainer.appendChild(container);
  }

  while (container.firstChild) container.removeChild(container.firstChild);

  var label = document.createElement('span');
  label.textContent = 'NEXT:';
  label.style.cssText = 'color:#FFD700;font-weight:bold;margin-right:4px;';
  container.appendChild(label);

  if (!Game_ZombieSpawnList || Game_ZombieSpawnList.length === 0)
  {
    var done = document.createElement('span');
    done.textContent = 'NONE';
    done.style.color = '#00FF88';
    container.appendChild(done);
    return;
  }

  // Show next 5 zombies
  var count = Math.min(5, Game_ZombieSpawnList.length);
  for (var i = Game_ZombieSpawnList.length - 1; i >= Math.max(0, Game_ZombieSpawnList.length - count); i--)
  {
    var zombieType = Game_ZombieSpawnList[i][0];
    var icon = document.createElement('div');
    var isBoss = zombieType.indexOf('Boss') === 0;
    var isSnowZombie = zombieType.indexOf('SnowZombie') === 0;
    var bgColor = isBoss ? '#FF0044' : isSnowZombie ? '#4488FF' : '#44AA44';
    var initial = isBoss ? 'B' + zombieType.replace('Boss','') : zombieType.charAt(0).toUpperCase();
    icon.textContent = initial;
    icon.style.cssText = 'width:16px;height:16px;background:' + bgColor + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;';
    container.appendChild(icon);
  }

  var remaining = document.createElement('span');
  remaining.textContent = '(' + Game_ZombieSpawnList.length + ')';
  remaining.style.cssText = 'color:#aaa;margin-left:4px;';
  container.appendChild(remaining);
}

// ============================================
// MINI-MAP: show positions of zombies and players
// ============================================
function Game_UpdateMiniMap()
{
  var canvas = document.getElementById('minimap-canvas');
  if (!canvas)
  {
    var wrapper = document.createElement('div');
    wrapper.id = 'minimap-wrapper';
    wrapper.style.cssText = 'position:absolute;top:30px;right:5px;z-index:90;border:1px solid #4488CC;background:rgba(0,0,0,0.6);';
    canvas = document.createElement('canvas');
    canvas.id = 'minimap-canvas';
    canvas.width = 80;
    canvas.height = 60;
    canvas.style.cssText = 'display:block;image-rendering:pixelated;';
    wrapper.appendChild(canvas);
    var gameContainer = document.getElementById('div_moviescreenframe');
    if (gameContainer) gameContainer.appendChild(wrapper);
  }

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 80, 60);
  ctx.fillStyle = 'rgba(15,12,41,0.5)';
  ctx.fillRect(0, 0, 80, 60);

  var levelData = Game_LevelData ? Game_LevelData[Game_CurrentLevel - 1] : null;
  if (!levelData || !levelData.LabyrinthConstraints) return;

  var c = levelData.LabyrinthConstraints;
  var scaleX = 80 / (c.X2 - c.X1);
  var scaleY = 60 / (c.Y2 - c.Y1);

  // Draw players as blue dots
  for (var pid in Game_PlayersArray)
  {
    var p = Game_PlayersArray[pid];
    if (p && p.LivingState === 0)
    {
      var px = (p.X - c.X1) * scaleX;
      var py = (p.Y - c.Y1) * scaleY;
      ctx.fillStyle = '#44AAFF';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
    }
  }

  // Draw zombies as red dots
  for (var zid in Game_Zombies)
  {
    var z = Game_Zombies[zid];
    if (z && z.LivingState === 0)
    {
      var zx = (z.X - c.X1) * scaleX;
      var zy = (z.Y - c.Y1) * scaleY;
      ctx.fillStyle = z.isDinosaur ? '#FF0044' : '#FF4444';
      var size = z.isDinosaur ? 3 : 2;
      ctx.fillRect(Math.round(zx), Math.round(zy), size, size);
    }
  }

  // Draw camera viewport as white rectangle
  if (window.g_ViewPort_X !== undefined)
  {
    var vx = (-g_ViewPort_X - c.X1) * scaleX;
    var vy = (-g_ViewPort_Y - c.Y1) * scaleY;
    var vw = 480 * scaleX;
    var vh = 260 * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(vx), Math.round(vy), Math.round(vw), Math.round(vh));
  }
}

// ============================================
// UNIQUE PLAYER ABILITIES (passive bonuses)
// ============================================
function Game_ApplyPlayerAbilities()
{
  var abilities = {
    'Player':  { speedMult: 1.0, gatherMult: 1.0, desc: 'Balanced' },
    'Player2': { speedMult: 0.9, gatherMult: 1.5, desc: 'Fast Gatherer' },
    'Player3': { speedMult: 1.2, gatherMult: 0.8, desc: 'Speed Runner' },
    'Player4': { speedMult: 1.0, gatherMult: 1.0, damageMult: 1.5, desc: 'Heavy Hitter' },
    'Player5': { speedMult: 1.3, gatherMult: 1.0, desc: 'Scout' },
    'Player6': { speedMult: 1.0, gatherMult: 2.0, desc: 'Master Builder' },
    'Player7': { speedMult: 1.1, gatherMult: 1.1, desc: 'Versatile' },
    'Player8': { speedMult: 0.8, gatherMult: 1.0, shielded: true, desc: 'Tank' },
    'Player9': { speedMult: 1.0, gatherMult: 1.3, critBonus: 0.1, desc: 'Lucky' }
  };

  for (var pid in Game_PlayersArray)
  {
    var p = Game_PlayersArray[pid];
    if (!p || p._abilityApplied) continue;
    var ability = abilities[p.Type] || abilities['Player'];
    if (ability.speedMult && ability.speedMult !== 1.0) p.VelLimit *= ability.speedMult;
    if (ability.shielded) p.Strength = 3;
    p._ability = ability;
    p._abilityApplied = true;
  }
}

// ============================================
// SPECIAL ZOMBIE BEHAVIORS
// ============================================
function Game_ApplyZombieBehaviors(Zombie)
{
  if (!Zombie || !Zombie.ZombieType) return;

  var type = Zombie.ZombieType;
  // SnowZombie1: Fast zombie (1.5x speed)
  if (type === 'SnowZombie1') { Zombie.VelLimit *= 1.5; Zombie._specialType = 'fast'; }
  // SnowZombie2: Tank (slow, 2x HP)
  else if (type === 'SnowZombie2') { Zombie.VelLimit *= 0.6; Zombie.ZombieStrength *= 2; Zombie._specialType = 'tank'; }
  // SnowZombie3: Splitter (spawns 2 minis on death)
  else if (type === 'SnowZombie3') { Zombie._specialType = 'splitter'; }
  // SnowZombie4: Zigzag movement
  else if (type === 'SnowZombie4') { Zombie._specialType = 'zigzag'; Zombie._zigzagTimer = 0; }
  // SnowZombie5: Healer (boosts nearby zombie HP)
  else if (type === 'SnowZombie5') { Zombie._specialType = 'healer'; Zombie._healTimer = 0; }
}

function Game_UpdateSpecialZombies()
{
  if (!Game_LevelStarted || Game_GameIsOver) return;

  for (var zid in Game_Zombies)
  {
    var z = Game_Zombies[zid];
    if (!z || z.LivingState !== 0) continue;

    // Handle frozen zombies (from Ice Wall or Freeze All ability)
    if (z._frozen)
    {
      z._frozenTimer--;
      z.setVelocity(0);
      if (z._frozenTimer <= 0)
      {
        z._frozen = false;
        z.setVelocity(Game_Sprite_TypeProperties[z.Type] ? Game_Sprite_TypeProperties[z.Type].VelLimit : 1);
      }
      continue; // Skip other behavior while frozen
    }

    if (z._specialType === 'zigzag')
    {
      z._zigzagTimer++;
      if (z._zigzagTimer % 30 === 0) { z.VelX += (Math.random() - 0.5) * 2; }
    }
    else if (z._specialType === 'healer')
    {
      z._healTimer++;
      if (z._healTimer >= Math.floor(g_FramesPerSecond * 3))
      {
        z._healTimer = 0;
        // Heal nearby zombies
        for (var nid in Game_Zombies)
        {
          var n = Game_Zombies[nid];
          if (n && n.Id !== z.Id && n.LivingState === 0)
          {
            var dx = Math.abs(n.X - z.X);
            var dy = Math.abs(n.Y - z.Y);
            if (dx + dy < 80)
            {
              var maxStr = Game_ZombieTypes[n.ZombieType] ? Game_ZombieTypes[n.ZombieType].Strength : 1;
              if (n.ZombieStrength < maxStr) n.ZombieStrength++;
            }
          }
        }
      }
    }
  }
}

// Handle splitter zombies spawning minis on death
function Game_HandleSplitterDeath(DeadZombie)
{
  if (DeadZombie && DeadZombie._specialType === 'splitter')
  {
    // Spawn 2 small fast zombies near death location
    for (var s = 0; s < 2; s++)
    {
      var offsetX = (s === 0) ? -15 : 15;
      var miniZombie = Game_CreateAndPlaceZombie(DeadZombie.X + offsetX, DeadZombie.Y, 'SnowZombie1');
      if (miniZombie)
      {
        miniZombie.ZombieStrength = 1;
        miniZombie.VelLimit *= 1.3;
        Game_SpriteSpawnEffect(miniZombie);
        Game_ZombiesInGame++;
      }
    }
  }
}

// ============================================
// BOSS SPECIAL ABILITIES
// ============================================
function Game_UpdateBossAbilities()
{
  if (!Game_LevelStarted || Game_GameIsOver) return;

  for (var zid in Game_Zombies)
  {
    var boss = Game_Zombies[zid];
    if (!boss || !boss.isDinosaur || boss.LivingState !== 0) continue;
    if (!boss._bossTimer) boss._bossTimer = 0;
    boss._bossTimer++;

    var type = boss.ZombieType;
    var interval = Math.floor(g_FramesPerSecond * 5); // Every 5 seconds

    if (boss._bossTimer % interval !== 0) continue;

    // Boss1: Freeze nearest player for 2s
    if (type === 'Boss1' || type === 'Boss2')
    {
      var nearestPlayer = Game_FindNearestPlayer(boss);
      if (nearestPlayer && nearestPlayer.LivingState === 0)
      {
        nearestPlayer._frozenTimer = Math.floor(g_FramesPerSecond * 2);
        nearestPlayer._originalVelLimit = nearestPlayer._originalVelLimit || nearestPlayer.VelLimit;
        nearestPlayer.VelLimit = 0;
        Game_ShowFloatingText('FROZEN!', '#66CCFF', nearestPlayer);
      }
    }
    // Boss3/Boss4: Spawn a mini zombie
    else if (type === 'Boss3' || type === 'Boss4')
    {
      var spawnZ = Game_CreateAndPlaceZombie(boss.X + 20, boss.Y, 'Snowman');
      if (spawnZ)
      {
        Game_ZombiesInGame++;
        Game_SpriteSpawnEffect(spawnZ);
        Game_ShowFloatingText('SUMMON!', '#FF4400', boss);
      }
    }
    // Boss5/Boss6: Charge attack (speed burst)
    else if (type === 'Boss5' || type === 'Boss6')
    {
      boss._chargeTimer = Math.floor(g_FramesPerSecond * 1.5);
      boss._originalBossSpeed = boss._originalBossSpeed || boss.VelLimit;
      boss.VelLimit *= 3;
      Game_ShowFloatingText('CHARGE!', '#FF8800', boss);
    }
    // Boss7/Boss8: Shield (temporary invulnerability)
    else if (type === 'Boss7' || type === 'Boss8')
    {
      boss._shieldTimer = Math.floor(g_FramesPerSecond * 3);
      boss._savedStrength = boss.ZombieStrength;
      boss.ZombieStrength = 9999;
      Game_ShowFloatingText('SHIELD!', '#00FFAA', boss);
    }
  }

  // Update boss timers
  for (var zid2 in Game_Zombies)
  {
    var b = Game_Zombies[zid2];
    if (!b || b.LivingState !== 0) continue;

    // Boss charge timer
    if (b._chargeTimer > 0)
    {
      b._chargeTimer--;
      if (b._chargeTimer <= 0 && b._originalBossSpeed)
      {
        b.VelLimit = b._originalBossSpeed;
      }
    }
    // Boss shield timer
    if (b._shieldTimer > 0)
    {
      b._shieldTimer--;
      if (b._shieldTimer <= 0 && b._savedStrength)
      {
        b.ZombieStrength = b._savedStrength;
      }
    }
  }

  // Update player freeze timers
  for (var pid in Game_PlayersArray)
  {
    var pl = Game_PlayersArray[pid];
    if (pl && pl._frozenTimer > 0)
    {
      pl._frozenTimer--;
      if (pl._frozenTimer <= 0 && pl._originalVelLimit)
      {
        pl.VelLimit = pl._originalVelLimit;
        delete pl._originalVelLimit;
      }
    }
  }
}

function Game_FindNearestPlayer(Sprite)
{
  var nearest = null;
  var nearestDist = 999999;
  for (var pid in Game_PlayersArray)
  {
    var p = Game_PlayersArray[pid];
    if (p && p.LivingState === 0)
    {
      var dx = Math.abs(Sprite.X - p.X);
      var dy = Math.abs(Sprite.Y - p.Y);
      var dist = dx * dx + dy * dy;
      if (dist < nearestDist) { nearest = p; nearestDist = dist; }
    }
  }
  return nearest;
}

// ============================================
// STAR RATING SYSTEM
// ============================================
function Game_CalculateLevelStars()
{
  var stars = 0;
  var elapsedMs = Date.now() - Game_LevelStartTime;
  var elapsedSec = elapsedMs / 1000;
  var precision = Game_LevelShotsFired > 0 ? (Game_LevelShotsHit / Game_LevelShotsFired) : 0;

  // Star 1: Complete the level (always earned)
  stars = 1;

  // Star 2: Complete in under 90 seconds OR precision > 50%
  if (elapsedSec < 90 || precision > 0.5) stars = 2;

  // Star 3: Complete in under 60 seconds AND precision > 70% AND no player deaths
  if (elapsedSec < 60 && precision > 0.7 && Game_LevelDamageTaken === 0) stars = 3;

  return stars;
}

function Game_SaveLevelStars(level, stars)
{
  var savedStars = Game_LevelStars[level] || 0;
  if (stars > savedStars)
  {
    Game_LevelStars[level] = stars;
    // Save to localStorage
    try { localStorage.setItem('chilly_stars', JSON.stringify(Game_LevelStars)); } catch(e) {}
  }
}

function Game_LoadLevelStars()
{
  try
  {
    var saved = localStorage.getItem('chilly_stars');
    if (saved) Game_LevelStars = JSON.parse(saved);
  }
  catch(e) { Game_LevelStars = {}; }
}

function Game_ShowLevelStarsResult(stars)
{
  // This is now handled by Game_ShowStatsScreen which includes stars.
  // Keep as a no-op for backward compatibility.
}

// ============================================
// ENDLESS/SURVIVAL MODE
// ============================================
var Game_EndlessMode = false;
var Game_EndlessWave = 0;
var Game_EndlessScore = 0;

function Game_StartEndlessMode()
{
  Game_EndlessMode = true;
  Game_EndlessWave = 0;
  Game_EndlessScore = 0;
  Game_CurrentLevel = 1;
  // Game_Start handles screen switching, array init, rendering, camera
  Game_Start(true);
}

function Game_SpawnEndlessWave()
{
  Game_EndlessWave++;
  var baseZombies = 5 + Game_EndlessWave * 3;
  var bossEvery = 5;

  Game_LevelTotalZombies = baseZombies;
  Game_ZombieSpawnList = [];

  var zombiePool = ['Snowman', 'NormalZombie', 'Zombiess', 'SnowZombie1', 'SnowZombie2', 'SnowZombie3', 'SnowZombie4', 'SnowZombie5'];
  var bossPool = ['Boss1', 'Boss2', 'Boss3', 'Boss4', 'Boss5', 'Boss6', 'Boss7', 'Boss8'];

  for (var i = 0; i < baseZombies; i++)
  {
    var type = zombiePool[Math.floor(Math.random() * Math.min(zombiePool.length, 2 + Game_EndlessWave))];
    Game_ZombieSpawnList.push([type, Math.floor(Math.random() * 3)]);
  }

  // Add boss every N waves
  if (Game_EndlessWave % bossEvery === 0)
  {
    var bossIdx = Math.min(Math.floor(Game_EndlessWave / bossEvery) - 1, bossPool.length - 1);
    Game_ZombieSpawnList.push([bossPool[bossIdx], 0]);
    Game_LevelTotalZombies++;
  }

  Game_ZombieTotalSpawnCount = 0;
  Game_ZombiesInGame = 0;
  Game_ZombiesKilledThisLevel = 0;
  Game_SnowStock += 30 + Game_EndlessWave * 5;
  ReplaceHTML('id_snowstock', Game_SnowStock);
  Game_UpdateProgressBar();
  Game_ShowFloatingText('WAVE ' + Game_EndlessWave, '#FF4400', null);
}

// ============================================
// TURRET SYSTEM: automated defenses
// ============================================
var Game_Turrets = [];
var Game_TurretCost = 75; // snow stock cost

function Game_BuildTurret(x, y)
{
  if (Game_SnowStock < Game_TurretCost) {
    Game_ShowFloatingText('NEED ' + Game_TurretCost + ' SNOW!', '#FF4444', {X: x, Y: y});
    return false;
  }
  Game_SnowStock -= Game_TurretCost;
  ReplaceHTML('id_snowstock', Game_SnowStock);

  var turret = {
    x: x,
    y: y,
    range: 120,
    fireRate: Math.floor(g_FramesPerSecond * 1.5),
    fireTimer: 0,
    weaponType: 'Weapon01',
    sprite: null
  };

  // Create visual element - tall ice tower
  var el = document.createElement('div');
  el.style.cssText = 'position:absolute;width:24px;height:36px;z-index:10;pointer-events:none;margin-left:-12px;margin-top:-36px;';
  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 36');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '36');
  svg.setAttribute('shape-rendering', 'crispEdges');
  var rects = [
    // Base foundation
    [2,30,20,6,'#3878a8'],[3,31,18,4,'#4898c0'],
    // Main tower body
    [4,10,16,20,'#60b8e8'],[5,11,14,18,'#78cef8'],
    // Tower top platform
    [2,8,20,3,'#4898c0'],[3,8,18,2,'#60b8e8'],
    // Battlements (crenellations)
    [2,4,4,4,'#60b8e8'],[3,5,2,2,'#90daf0'],
    [10,4,4,4,'#60b8e8'],[11,5,2,2,'#90daf0'],
    [18,4,4,4,'#60b8e8'],[19,5,2,2,'#90daf0'],
    // Ice highlights
    [5,12,2,1,'#a0e8ff'],[5,14,1,3,'#a0e8ff'],[6,18,1,1,'#b8f0ff'],
    // Ice texture
    [8,15,5,1,'#90daf0'],[10,20,6,1,'#90daf0'],[7,25,4,1,'#90daf0'],[13,23,3,1,'#90daf0'],
    // Sparkles
    [7,13,1,1,'#d0f8ff'],[14,17,1,1,'#d0f8ff'],[9,24,1,1,'#d0f8ff'],[16,22,1,1,'#c0f0ff'],
    // Shadow right side
    [18,11,1,18,'#58a8d0'],
    // Bottom edge
    [4,29,16,1,'#4898c0'],
    // Weapon slot (window)
    [10,18,4,3,'#3070a0'],[11,19,2,1,'#206090']
  ];
  for (var ri = 0; ri < rects.length; ri++) {
    var r = document.createElementNS(svgNS, 'rect');
    r.setAttribute('x', rects[ri][0]); r.setAttribute('y', rects[ri][1]);
    r.setAttribute('width', rects[ri][2]); r.setAttribute('height', rects[ri][3]);
    r.setAttribute('fill', rects[ri][4]);
    svg.appendChild(r);
  }
  el.appendChild(svg);
  if (window.g_ViewPort_X !== undefined)
  {
    el.style.left = (x + g_ViewPort_X) + 'px';
    el.style.top = (y + g_ViewPort_Y) + 'px';
  }
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  turret.sprite = el;

  Game_Turrets.push(turret);
  Game_ShowFloatingText('TURRET BUILT!', '#4488CC', {X: x, Y: y});
  return true;
}

function Game_UpdateTurrets()
{
  if (!Game_LevelStarted || Game_GameIsOver) return;

  for (var i = 0; i < Game_Turrets.length; i++)
  {
    var turret = Game_Turrets[i];
    turret.fireTimer++;

    // Update position with camera
    if (turret.sprite && window.g_ViewPort_X !== undefined)
    {
      turret.sprite.style.left = (turret.x + g_ViewPort_X) + 'px';
      turret.sprite.style.top = (turret.y + g_ViewPort_Y) + 'px';
    }

    if (turret.fireTimer < turret.fireRate) continue;

    // Find nearest zombie in range
    var nearestZ = null;
    var nearestDist = turret.range * turret.range;
    for (var zid in Game_Zombies)
    {
      var z = Game_Zombies[zid];
      if (!z || z.LivingState !== 0) continue;
      var dx = z.X - turret.x;
      var dy = z.Y - turret.y;
      var dist = dx * dx + dy * dy;
      if (dist < nearestDist) { nearestZ = z; nearestDist = dist; }
    }

    // Turrets consume ammo from the player's ammo supply
    var turretAmmo = Game_Ammo[turret.weaponType];
    if (nearestZ && turretAmmo && turretAmmo.Count > 0 && Game_NumberShotWeapons < Game_MaxShotWeapons + Game_Turrets.length)
    {
      turret.fireTimer = 0;
      turretAmmo.Count--;
      Game_UpdateAmmoScreenIfo(turret.weaponType);
      var weapon = Game_CreateAndPlaceWeapon(turret.x, turret.y, turret.weaponType);
      if (weapon)
      {
        Game_SpriteProjectileEffect(weapon);
        SetSpriteTarget(weapon, nearestZ.X, nearestZ.Y, null, false, false);
        weapon.Target = -1;
        weapon.moveToTarget();
        Game_NumberShotWeapons++;
      }
    }
  }
}

function Game_ClearTurrets()
{
  for (var i = 0; i < Game_Turrets.length; i++)
  {
    if (Game_Turrets[i].sprite && Game_Turrets[i].sprite.parentNode)
    {
      Game_Turrets[i].sprite.parentNode.removeChild(Game_Turrets[i].sprite);
    }
  }
  Game_Turrets = [];
}

// ============================================
// #1 SNOW PARTICLES - atmospheric falling snow
// ============================================
function Game_InitSnowParticles()
{
  Game_SnowParticles = [];
  for (var i = 0; i < 40; i++)
  {
    Game_SnowParticles.push({
      x: Math.random() * 960,
      y: Math.random() * 520,
      size: 1 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.7,
      wind: (Math.random() - 0.5) * 0.3,
      opacity: 0.3 + Math.random() * 0.5
    });
  }
}

function Game_UpdateSnowParticles()
{
  var canvas = document.getElementById('snow-canvas');
  if (!canvas)
  {
    canvas = document.createElement('canvas');
    canvas.id = 'snow-canvas';
    canvas.width = 960;
    canvas.height = 520;
    canvas.style.cssText = 'position:absolute;top:0;left:0;z-index:1;pointer-events:none;opacity:0.6;';
    var container = document.getElementById('div_moviescreenframe');
    if (container) container.appendChild(canvas);
    Game_InitSnowParticles();
  }

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 960, 520);

  for (var i = 0; i < Game_SnowParticles.length; i++)
  {
    var p = Game_SnowParticles[i];
    p.y += p.speed;
    p.x += p.wind;
    if (p.y > 520) { p.y = -5; p.x = Math.random() * 960; }
    if (p.x > 960) p.x = 0;
    if (p.x < 0) p.x = 960;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
    ctx.fill();
  }
}

// ============================================
// #2 DAMAGE NUMBERS - floating damage on hits
// ============================================
function Game_ShowDamageNumber(damage, sprite, isCritical)
{
  if (!sprite || window.g_ViewPort_X === undefined) return;
  var el = document.createElement('div');
  var color = isCritical ? '#FFD700' : '#FF4444';
  var size = isCritical ? '16px' : '12px';
  el.textContent = '-' + damage;
  el.style.cssText = 'position:absolute;z-index:200;font-family:"Courier New",monospace;font-weight:bold;font-size:' + size + ';color:' + color + ';text-shadow:1px 1px 0 #000;pointer-events:none;transition:all 0.6s ease-out;opacity:1;';
  var startX = sprite.X + g_ViewPort_X + (Math.random() - 0.5) * 10;
  var startY = sprite.Y + g_ViewPort_Y - 5;
  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  setTimeout(function() { el.style.top = (startY - 25) + 'px'; el.style.opacity = '0'; }, 30);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 650);
}

// ============================================
// #3 TRAIL EFFECT - projectile trails
// ============================================
function Game_UpdateProjectileTrails()
{
  if (window.g_ViewPort_X === undefined) return;
  for (var wid in Game_Weapons)
  {
    var w = Game_Weapons[wid];
    if (!w || w.ScheduleDestruction) continue;
    if (!w._trailTimer) w._trailTimer = 0;
    w._trailTimer++;
    if (w._trailTimer % 3 !== 0) continue; // Every 3 frames

    var dot = document.createElement('div');
    var colors = { 'Weapon01': '#FF6600', 'Weapon02': '#66CCFF', 'Weapon03': '#FF00AA' };
    var c = colors[w.WeaponType] || '#FFCC00';
    dot.style.cssText = 'position:absolute;width:4px;height:4px;background:' + c + ';border-radius:50%;z-index:5;pointer-events:none;opacity:0.7;transition:opacity 0.3s;';
    dot.style.left = (w.X + g_ViewPort_X) + 'px';
    dot.style.top = (w.Y + g_ViewPort_Y) + 'px';
    var container = document.getElementById('div_moviescreenframe');
    if (container) container.appendChild(dot);
    setTimeout(function(d) { d.style.opacity = '0'; }.bind(null, dot), 50);
    setTimeout(function(d) { if (d.parentNode) d.parentNode.removeChild(d); }.bind(null, dot), 350);
  }
}

// ============================================
// #4 SHOP BETWEEN LEVELS
// ============================================
function Game_LoadShopUpgrades()
{
  try {
    var saved = localStorage.getItem('chilly_shop');
    if (saved) Game_ShopUpgrades = JSON.parse(saved);
  } catch(e) {}
}

function Game_SaveShopUpgrades()
{
  try { localStorage.setItem('chilly_shop', JSON.stringify(Game_ShopUpgrades)); } catch(e) {}
}

function Game_ApplyShopUpgrades()
{
  // Apply persistent upgrades to all players
  for (var pid in Game_PlayersArray)
  {
    var p = Game_PlayersArray[pid];
    if (!p || p._shopApplied) continue;
    p.Strength += Game_ShopUpgrades.playerHP;
    p.VelLimit *= (1 + Game_ShopUpgrades.playerSpeed * 0.1);
    p._shopApplied = true;
  }
  // Weapon damage boost
  for (var wt in Game_WeaponTypes)
  {
    if (!Game_WeaponTypes[wt]._shopBoosted)
    {
      Game_WeaponTypes[wt].Strength += Game_ShopUpgrades.weaponDmg;
      Game_WeaponTypes[wt]._shopBoosted = true;
    }
  }
}

function Game_ShowShop(onContinue)
{
  var overlay = document.createElement('div');
  overlay.id = 'shop-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:600;display:flex;align-items:center;justify-content:center;';

  var panel = document.createElement('div');
  panel.className = 'retro-dialog';
  panel.style.cssText = 'max-width:400px;min-width:300px;';

  var title = document.createElement('div');
  title.className = 'retro-dialog-title';
  title.textContent = 'UPGRADE SHOP';
  panel.appendChild(title);

  var scoreDiv = document.createElement('div');
  scoreDiv.style.cssText = 'color:#88CCFF;font-size:14px;padding:10px 20px 5px;font-family:"Courier New",monospace;';
  scoreDiv.textContent = 'SCORE: ' + Game_Score;
  panel.appendChild(scoreDiv);

  var body = document.createElement('div');
  body.style.cssText = 'padding:5px 20px 10px;';

  var items = [
    { key: 'playerHP', name: '+1 PLAYER HP', cost: 1500, max: 5 },
    { key: 'playerSpeed', name: '+10% SPEED', cost: 1000, max: 3 },
    { key: 'weaponDmg', name: '+1 WEAPON DMG', cost: 2500, max: 3 },
    { key: 'gatherSpeed', name: '+20% GATHER', cost: 1200, max: 3 },
    { key: 'turretDiscount', name: '-20 TURRET COST', cost: 2000, max: 3 }
  ];

  var currentOnContinue = onContinue;

  for (var i = 0; i < items.length; i++)
  {
    (function(item) {
      var row = document.createElement('div');
      row.className = 'retro-stat-row';
      row.style.cssText = 'align-items:center;padding:5px 0;';
      var label = document.createElement('span');
      label.style.cssText = 'color:#fff;font-size:12px;font-family:"Courier New",monospace;';
      var lvl = Game_ShopUpgrades[item.key] || 0;
      label.textContent = item.name + ' [' + lvl + '/' + item.max + ']';
      var btn = document.createElement('span');
      var canBuy = Game_Score >= item.cost && lvl < item.max;
      btn.style.cssText = 'cursor:pointer;padding:3px 10px;font-size:11px;font-weight:bold;border:1px solid;font-family:"Courier New",monospace;' + (canBuy ? 'color:#00FF88;border-color:#00FF88;' : 'color:#555;border-color:#555;');
      btn.textContent = item.cost + ' PTS';
      if (canBuy)
      {
        btn.onmousedown = function(e) {
          e.preventDefault();
          Game_Score -= item.cost;
          Game_ShopUpgrades[item.key]++;
          if (item.key === 'turretDiscount') Game_TurretCost = Math.max(20, 100 - Game_ShopUpgrades.turretDiscount * 20);
          Game_SaveShopUpgrades();
          Game_SynthSFX('shop');
          // Refresh shop keeping the same callback
          var old = document.getElementById('shop-overlay');
          if (old) old.parentNode.removeChild(old);
          Game_ShowShop(currentOnContinue);
        };
      }
      row.appendChild(label);
      row.appendChild(btn);
      body.appendChild(row);
    })(items[i]);
  }
  panel.appendChild(body);

  var btnWrap = document.createElement('div');
  btnWrap.className = 'retro-dialog-buttons';
  var closeBtn = document.createElement('div');
  closeBtn.className = 'retro-btn-action';
  closeBtn.textContent = 'CONTINUE';
  closeBtn.onmousedown = function(e) {
    e.preventDefault();
    var ol = document.getElementById('shop-overlay');
    if (ol) ol.parentNode.removeChild(ol);
    if (currentOnContinue) currentOnContinue();
  };
  btnWrap.appendChild(closeBtn);
  panel.appendChild(btnWrap);

  overlay.appendChild(panel);
  var container = document.getElementById('div_moviescreenframe') || document.body;
  container.appendChild(overlay);
}

// Show shop between levels - blocks level advancement until CONTINUE
function Game_ShowShop_BeforeNextLevel()
{
  Game_ShowShop(function() {
    // NOW load and transition to the next level
    Game_ShowLevelTransition(Game_CurrentLevel, null);
    Game_LoadLevel(Game_CurrentLevel, true);

    if (Game_Camera)
    {
      Game_Camera.setCamera();
      if (g_isMobileSafari)
      {
        SetAnimationFPS(gc_MobileInitialFramesPerSecond);
      }
      SetSpriteTarget(Game_Camera, Game_LevelCameraX, Game_LevelCameraY, null, false, false);
    }

    TimeLine_SpritePlay(true);
  });
}

// ============================================
// #5 SPECIAL WAVES every 5 levels
// ============================================
function Game_ApplySpecialWaveModifiers()
{
  if (Game_EndlessMode) return;
  var level = Game_CurrentLevel;
  if (level % 5 !== 0) return;

  var waveType = Math.floor(level / 5) % 4;
  var msg = '';

  if (waveType === 0)
  {
    // Boss Rush: replace all zombies with bosses
    msg = 'BOSS RUSH!';
    if (Game_ZombieSpawnList)
    {
      var bossPool = ['Boss1','Boss2','Boss3'];
      for (var i = 0; i < Game_ZombieSpawnList.length; i++)
      {
        var bossIdx = Math.min(Math.floor(level / 10), bossPool.length - 1);
        Game_ZombieSpawnList[i][0] = bossPool[Math.floor(Math.random() * (bossIdx + 1))];
      }
    }
  }
  else if (waveType === 1)
  {
    // Speed Rush: all zombies become fast
    msg = 'SPEED RUSH!';
    if (Game_ZombieSpawnList)
    {
      for (var j = 0; j < Game_ZombieSpawnList.length; j++)
      {
        Game_ZombieSpawnList[j][0] = 'SnowZombie1'; // Fast type
      }
    }
  }
  else if (waveType === 2)
  {
    // Zombie Horde: double the zombies, but weaker
    msg = 'ZOMBIE HORDE!';
    if (Game_ZombieSpawnList)
    {
      var extra = Game_ZombieSpawnList.slice();
      for (var k = 0; k < extra.length; k++) Game_ZombieSpawnList.push([extra[k][0], extra[k][1]]);
      Game_LevelTotalZombies *= 2;
    }
  }
  else
  {
    // Tank Wave: all tanky
    msg = 'TANK WAVE!';
    if (Game_ZombieSpawnList)
    {
      for (var m = 0; m < Game_ZombieSpawnList.length; m++)
      {
        Game_ZombieSpawnList[m][0] = 'SnowZombie2'; // Tank type
      }
    }
  }

  if (msg)
  {
    setTimeout(function() { Game_ShowFloatingText(msg, '#FF4400', null); }, 1000);
  }
}

// ============================================
// #6 ACHIEVEMENTS SYSTEM
// ============================================
var Game_AchievementDefs = [
  { id: 'first_blood', name: 'First Blood', desc: 'Kill your first zombie', check: function() { return Game_TotalKills >= 1; } },
  { id: 'killer_50', name: 'Veteran', desc: 'Kill 50 zombies', check: function() { return Game_TotalKills >= 50; } },
  { id: 'killer_100', name: 'Centurion', desc: 'Kill 100 zombies', check: function() { return Game_TotalKills >= 100; } },
  { id: 'killer_500', name: 'Destroyer', desc: 'Kill 500 zombies', check: function() { return Game_TotalKills >= 500; } },
  { id: 'combo_5', name: 'Combo Master', desc: 'Get a x5 combo', check: function() { return Game_ComboMultiplier >= 5; } },
  { id: 'combo_10', name: 'Combo Legend', desc: 'Get a x10 combo', check: function() { return Game_ComboMultiplier >= 10; } },
  { id: 'streak_20', name: 'On Fire', desc: '20 kill streak', check: function() { return Game_KillStreakBest >= 20; } },
  { id: 'level_10', name: 'Explorer', desc: 'Reach level 10', check: function() { return Game_CurrentLevel >= 10; } },
  { id: 'level_34', name: 'Champion', desc: 'Complete all levels', check: function() { return Game_CurrentLevel > Game_MaxLevels; } },
  { id: 'no_damage', name: 'Untouchable', desc: 'Complete a level with no deaths', check: function() { return Game_LevelDamageTaken === 0 && Game_ZombiesKilledThisLevel > 0; } },
  { id: 'turret_builder', name: 'Engineer', desc: 'Build 3 turrets in one level', check: function() { return Game_Turrets.length >= 3; } },
  { id: 'sniper', name: 'Sniper', desc: '90%+ accuracy in a level', check: function() { return Game_LevelShotsFired >= 10 && (Game_LevelShotsHit / Game_LevelShotsFired) > 0.9; } }
];

function Game_LoadAchievements()
{
  try {
    var saved = localStorage.getItem('chilly_achievements');
    if (saved) Game_Achievements = JSON.parse(saved);
    var kills = localStorage.getItem('chilly_totalkills');
    if (kills) Game_TotalKills = parseInt(kills) || 0;
  } catch(e) {}
}

function Game_SaveAchievements()
{
  try {
    localStorage.setItem('chilly_achievements', JSON.stringify(Game_Achievements));
    localStorage.setItem('chilly_totalkills', Game_TotalKills);
  } catch(e) {}
}

function Game_CheckAchievements()
{
  for (var i = 0; i < Game_AchievementDefs.length; i++)
  {
    var ach = Game_AchievementDefs[i];
    if (Game_Achievements[ach.id]) continue;
    if (ach.check())
    {
      Game_Achievements[ach.id] = { unlocked: true, time: Date.now() };
      Game_ShowAchievementNotification(ach);
      Game_SaveAchievements();
    }
  }
}

function Game_ShowAchievementNotification(ach)
{
  Game_SynthSFX('achievement');
  var el = document.createElement('div');
  el.style.cssText = 'position:absolute;bottom:40px;right:10px;z-index:400;background:#0f0c29;border:2px solid #FFD700;padding:10px 15px;font-family:"Courier New",monospace;opacity:1;transition:opacity 0.5s;';
  var badge = document.createElement('div');
  badge.style.cssText = 'color:#FFD700;font-size:11px;font-weight:bold;';
  badge.textContent = '\u2605 ACHIEVEMENT UNLOCKED';
  var name = document.createElement('div');
  name.style.cssText = 'color:#fff;font-size:14px;font-weight:bold;margin-top:4px;';
  name.textContent = ach.name;
  var desc = document.createElement('div');
  desc.style.cssText = 'color:#88CCFF;font-size:10px;margin-top:2px;';
  desc.textContent = ach.desc;
  el.appendChild(badge);
  el.appendChild(name);
  el.appendChild(desc);
  var container = document.getElementById('div_moviescreenframe') || document.body;
  container.appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; }, 3000);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 3500);
}

// ============================================
// #7 SPEED CONTROL x1/x2/x3
// ============================================
function Game_CycleSpeed()
{
  if (Game_BaseFramesPerSecond === 0) Game_BaseFramesPerSecond = g_FramesPerSecond;

  if (Game_SpeedMultiplier === 1) Game_SpeedMultiplier = 2;
  else if (Game_SpeedMultiplier === 2) Game_SpeedMultiplier = 3;
  else Game_SpeedMultiplier = 1;

  g_FramesPerSecond = Game_BaseFramesPerSecond * Game_SpeedMultiplier;

  var btn = document.getElementById('speed-btn');
  if (btn) btn.textContent = 'x' + Game_SpeedMultiplier;
}

// ============================================
// #8 AUTO-SHOOT: shooter fires at nearest zombie
// ============================================
function Game_UpdateAutoShoot()
{
  if (!Game_AutoShootEnabled || !Game_PlayerShooter || !Game_LevelStarted || Game_GameIsOver) return;

  Game_AutoShootTimer++;
  var fireInterval = Math.floor(g_FramesPerSecond * 0.8 / Game_SpeedMultiplier);
  if (Game_AutoShootTimer < fireInterval) return;
  Game_AutoShootTimer = 0;

  // Find nearest zombie to shooter
  var nearest = null;
  var nearestDist = 999999;
  for (var zid in Game_Zombies)
  {
    var z = Game_Zombies[zid];
    if (!z || z.LivingState !== 0) continue;
    var dx = z.X - Game_PlayerShooter.X;
    var dy = z.Y - Game_PlayerShooter.Y;
    var dist = dx * dx + dy * dy;
    if (dist < nearestDist) { nearest = z; nearestDist = dist; }
  }

  if (nearest)
  {
    Game_PlayerLookWhereToShoot(Game_PlayerShooter, nearest.X, nearest.Y);
    Game_PlayerShoot(Game_PlayerShooter.X, Game_PlayerShooter.Y, nearest.X, nearest.Y);
  }
}

function Game_ToggleAutoShoot()
{
  Game_AutoShootEnabled = !Game_AutoShootEnabled;
  Game_AutoShootTimer = 0;
  var btn = document.getElementById('autoshoot-btn');
  if (btn) btn.style.borderColor = Game_AutoShootEnabled ? '#00FF88' : '#4488CC';
}

// ============================================
// #9 STATS SCREEN at level end (retro Atari style)
// ============================================
function Game_ShowStatsScreen(isEndless)
{
  var elapsedMs = Date.now() - Game_LevelStartTime;
  var elapsedSec = Math.floor(elapsedMs / 1000);
  var minutes = Math.floor(elapsedSec / 60);
  var seconds = elapsedSec % 60;
  var precision = Game_LevelShotsFired > 0 ? Math.round((Game_LevelShotsHit / Game_LevelShotsFired) * 100) : 0;
  var stars = Game_LevelStars[Game_CurrentLevel] || 0;

  var overlay = document.createElement('div');
  overlay.id = 'stats-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:500;display:flex;align-items:center;justify-content:center;';

  var panel = document.createElement('div');
  panel.className = 'stats-panel';
  panel.style.cssText = 'text-align:center;';

  // Title bar
  var titleBar = document.createElement('div');
  titleBar.className = 'stats-title-bar';
  titleBar.textContent = isEndless ? 'WAVE ' + Game_EndlessWave + ' CLEAR' : 'LEVEL ' + Game_CurrentLevel + ' CLEAR';
  panel.appendChild(titleBar);

  // Stars with sequential pop animation
  var starsDiv = document.createElement('div');
  starsDiv.className = 'stats-stars';
  for (var s = 0; s < 3; s++)
  {
    var starSpan = document.createElement('span');
    starSpan.className = 'star-animate';
    starSpan.style.animationDelay = (0.3 + s * 0.25) + 's';
    if (s < stars) {
      starSpan.textContent = '\u2605';
    } else {
      starSpan.textContent = '\u2606';
      starSpan.className += ' star-empty';
    }
    starsDiv.appendChild(starSpan);
  }
  panel.appendChild(starsDiv);

  // Separator
  var sep = document.createElement('div');
  sep.className = 'stats-sep';
  panel.appendChild(sep);

  // Stats body
  var body = document.createElement('div');
  body.className = 'stats-body';

  var stats = [
    ['TIME',     minutes + ':' + (seconds < 10 ? '0' : '') + seconds],
    ['KILLS',    Game_ZombiesKilledThisLevel],
    ['ACCURACY', precision + '%'],
    ['COMBO',    'x' + Math.max(1, Game_ComboMultiplier)],
    ['STREAK',   Game_KillStreakBest],
    ['SCORE',    Game_Score]
  ];

  for (var i = 0; i < stats.length; i++)
  {
    var row = document.createElement('div');
    row.className = 'stats-row';
    var lbl = document.createElement('span');
    lbl.className = 'stats-row-label';
    lbl.textContent = stats[i][0];
    var val = document.createElement('span');
    val.className = 'stats-row-value';
    val.textContent = stats[i][1];
    row.appendChild(lbl);
    row.appendChild(val);
    body.appendChild(row);
  }
  panel.appendChild(body);

  // Bottom separator
  var sep2 = document.createElement('div');
  sep2.className = 'stats-sep';
  panel.appendChild(sep2);

  // Continue button
  var closeBtn = document.createElement('div');
  closeBtn.className = 'stats-btn';
  closeBtn.textContent = 'CONTINUE';
  closeBtn.onmousedown = function(e) {
    e.preventDefault();
    var ol = document.getElementById('stats-overlay');
    if (ol) ol.parentNode.removeChild(ol);
    Game_GameIsOver = false;
    if (isEndless) {
      Game_SpawnEndlessWave();
    } else {
      Game_LevelComplete = 1;
    }
  };
  panel.appendChild(closeBtn);

  overlay.appendChild(panel);
  var container = document.getElementById('div_moviescreenframe') || document.body;
  container.appendChild(overlay);
}

// ============================================
// #53 LEVEL TRANSITIONS - fade in/out
// ============================================
function Game_ShowLevelTransition(levelNum, callback)
{
  var container = document.getElementById('div_moviescreenframe');
  if (!container) { if (callback) callback(); return; }

  var overlay = document.getElementById('level-transition-overlay');
  if (!overlay)
  {
    overlay = document.createElement('div');
    overlay.id = 'level-transition-overlay';
    var txt = document.createElement('div');
    txt.className = 'transition-text';
    overlay.appendChild(txt);
    container.appendChild(overlay);
  }

  var txt = overlay.querySelector('.transition-text');
  txt.textContent = 'LEVEL ' + levelNum;

  // Fade in
  setTimeout(function() { overlay.className = 'fade-in'; }, 10);

  // After fade in, call callback then fade out
  setTimeout(function() {
    if (callback) callback();
    setTimeout(function() {
      overlay.className = '';
    }, 600);
  }, 800);
}

// ============================================
// #54 SCREEN SNOW - animated snow on splash & menu
// ============================================
var Game_SnowSystems = {};

function Game_CreateSnowSystem(systemId, containerSelector, buttonSelector, particleCount)
{
  Game_StopSnowSystem(systemId);

  var container = document.querySelector(containerSelector);
  if (!container) return;

  // Ensure container has relative positioning for the canvas
  var cs = window.getComputedStyle(container);
  if (cs.position === 'static') container.style.position = 'relative';

  var canvasId = systemId + '-snow-canvas';
  var canvas = document.getElementById(canvasId);
  if (!canvas)
  {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;';
    container.appendChild(canvas);
  }

  var W = container.offsetWidth || 960;
  var H = container.offsetHeight || 520;
  canvas.width = W;
  canvas.height = H;

  // Create falling particles
  var particles = [];
  for (var i = 0; i < (particleCount || 50); i++)
  {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 1.2,
      wind: (Math.random() - 0.5) * 0.4,
      opacity: 0.2 + Math.random() * 0.6,
      wobble: Math.random() * Math.PI * 2
    });
  }

  // Snow accumulation on buttons - small piles
  var piles = [];
  var maxPileSnow = 40;

  function getButtonRects()
  {
    var rects = [];
    if (!buttonSelector) return rects;
    var btns = container.querySelectorAll(buttonSelector);
    var cRect = container.getBoundingClientRect();
    for (var b = 0; b < btns.length; b++)
    {
      var br = btns[b].getBoundingClientRect();
      rects.push({
        left: br.left - cRect.left,
        right: br.right - cRect.left,
        top: br.top - cRect.top,
        width: br.width
      });
    }
    return rects;
  }

  // Initialize pile spots from button positions
  var btnRects = getButtonRects();
  for (var b = 0; b < btnRects.length; b++)
  {
    piles.push({ rect: btnRects[b], flakes: [] });
  }

  var sys = { animId: null, canvas: canvas };
  Game_SnowSystems[systemId] = sys;
  var frameCount = 0;

  function drawMound(ctx, cx, cy, rx, ry)
  {
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.quadraticCurveTo(cx - rx * 0.5, cy - ry * 2, cx, cy - ry);
    ctx.quadraticCurveTo(cx + rx * 0.5, cy - ry * 2, cx + rx, cy);
    ctx.closePath();
    ctx.fill();
  }

  function animate()
  {
    var ctx = canvas.getContext('2d');

    // Resize check every 120 frames
    if (frameCount % 120 === 0)
    {
      var nw = container.offsetWidth || W;
      var nh = container.offsetHeight || H;
      if (nw !== W || nh !== H) { W = nw; H = nh; canvas.width = W; canvas.height = H; }
      // Refresh button positions
      btnRects = getButtonRects();
      for (var pb = 0; pb < piles.length && pb < btnRects.length; pb++)
        piles[pb].rect = btnRects[pb];
    }
    frameCount++;

    ctx.clearRect(0, 0, W, H);

    // Draw falling snowflakes
    for (var j = 0; j < particles.length; j++)
    {
      var p = particles[j];
      p.y += p.speed;
      p.wobble += 0.02;
      p.x += p.wind + Math.sin(p.wobble) * 0.3;

      // Check if flake landed on a button
      var landed = false;
      if (piles.length > 0)
      {
        for (var k = 0; k < piles.length; k++)
        {
          var r = piles[k].rect;
          if (p.x >= r.left && p.x <= r.right && p.y >= r.top - 2 && p.y <= r.top + 3)
          {
            if (piles[k].flakes.length < maxPileSnow)
            {
              piles[k].flakes.push({
                x: p.x,
                y: r.top - Math.random() * 3,
                size: 1 + Math.random() * 1.5,
                opacity: 0.5 + Math.random() * 0.4
              });
            }
            landed = true;
            break;
          }
        }
      }

      if (landed || p.y > H) { p.y = -5; p.x = Math.random() * W; }
      if (p.x > W) p.x = 0;
      if (p.x < 0) p.x = W;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
      ctx.fill();
    }

    // Draw accumulated snow on buttons
    for (var m = 0; m < piles.length; m++)
    {
      var pile = piles[m];
      for (var n = 0; n < pile.flakes.length; n++)
      {
        var sf = pile.flakes[n];
        ctx.beginPath();
        ctx.arc(sf.x, sf.y, sf.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230,240,255,' + sf.opacity + ')';
        ctx.fill();
      }

      // Draw mini snow-mound shapes on button edges if enough flakes
      if (pile.flakes.length >= 8)
      {
        var r2 = pile.rect;
        ctx.fillStyle = 'rgba(220,235,255,0.25)';
        drawMound(ctx, r2.left + r2.width * 0.15, r2.top, r2.width * 0.1, 3);
        drawMound(ctx, r2.left + r2.width * 0.85, r2.top, r2.width * 0.08, 2.5);
        drawMound(ctx, r2.left + r2.width * 0.5, r2.top, r2.width * 0.12, 3.5);
      }
    }

    sys.animId = requestAnimationFrame(animate);
  }

  animate();
}

function Game_StopSnowSystem(systemId)
{
  var sys = Game_SnowSystems[systemId];
  if (sys)
  {
    if (sys.animId) cancelAnimationFrame(sys.animId);
    if (sys.canvas && sys.canvas.parentNode) sys.canvas.parentNode.removeChild(sys.canvas);
    delete Game_SnowSystems[systemId];
  }
}

function Game_StartMenuSnow()
{
  Game_CreateSnowSystem('menu', '#id_div_mainmenu .mainmenu-screen',
    '.mainmenu-btn, .mainmenu-btn-sm', 55);
}

function Game_StopMenuSnow()
{
  Game_StopSnowSystem('menu');
}

function Game_StartSplashSnow()
{
  Game_CreateSnowSystem('splash', '.splash-screen', '.splash-bar-border', 40);
}

function Game_StopSplashSnow()
{
  Game_StopSnowSystem('splash');
}

// ============================================
// #56 NEW WEAPON TYPES - Laser, AreaBomb, IceWall
// ============================================
var Game_UnlockedWeapons = { Weapon04: false, Weapon05: false, Weapon06: false };
var Game_WeaponUnlockThresholds = { Weapon04: 100, Weapon05: 200, Weapon06: 400 };

function Game_CheckWeaponUnlocks()
{
  var changed = false;
  if (!Game_UnlockedWeapons.Weapon04 && Game_TotalKills >= Game_WeaponUnlockThresholds.Weapon04)
  {
    Game_UnlockedWeapons.Weapon04 = true;
    Game_ShowFloatingText('LASER UNLOCKED!', '#00FFCC', null);
    changed = true;
  }
  if (!Game_UnlockedWeapons.Weapon05 && Game_TotalKills >= Game_WeaponUnlockThresholds.Weapon05)
  {
    Game_UnlockedWeapons.Weapon05 = true;
    Game_ShowFloatingText('AREA BOMB UNLOCKED!', '#FF6600', null);
    changed = true;
  }
  if (!Game_UnlockedWeapons.Weapon06 && Game_TotalKills >= Game_WeaponUnlockThresholds.Weapon06)
  {
    Game_UnlockedWeapons.Weapon06 = true;
    Game_ShowFloatingText('ICE WALL UNLOCKED!', '#66CCFF', null);
    changed = true;
  }
  if (changed) { Game_SaveWeaponUnlocks(); Game_UpdateWeaponUI(); }
}

function Game_SaveWeaponUnlocks()
{
  try { localStorage.setItem('chilly_weapon_unlocks', JSON.stringify(Game_UnlockedWeapons)); } catch(e) {}
}

function Game_LoadWeaponUnlocks()
{
  try {
    var saved = localStorage.getItem('chilly_weapon_unlocks');
    if (saved) Game_UnlockedWeapons = JSON.parse(saved);
  } catch(e) {}
}

function Game_InitNewWeapons()
{
  if (!Game_WeaponTypes['Weapon04'])
  {
    Game_WeaponTypes['Weapon04'] = { LifeSpan: 60, Strength: 3, Name: 'Laser' };
    Game_WeaponTypes['Weapon05'] = { LifeSpan: 20, Strength: 5, Name: 'AreaBomb' };
    Game_WeaponTypes['Weapon06'] = { LifeSpan: 100, Strength: 0, Name: 'IceWall' };
  }
  if (!Game_Ammo['Weapon04'])
  {
    Game_Ammo['Weapon04'] = { Count: 0, BuildDifficulty: 30 };
    Game_Ammo['Weapon05'] = { Count: 0, BuildDifficulty: 50 };
    Game_Ammo['Weapon06'] = { Count: 0, BuildDifficulty: 40 };
  }
}

function Game_UpdateWeaponUI()
{
  // Weapon04/05/06 are not fully implemented yet - disabled
}

function Game_HandleSpecialWeaponEffect(weapon, zombie)
{
  if (!weapon || !weapon.WeaponType) return;
  if (weapon.WeaponType === 'Weapon05')
  {
    for (var zid in Game_Zombies)
    {
      var z = Game_Zombies[zid];
      if (!z || z.LivingState !== 0 || z === zombie) continue;
      var dx = z.X - zombie.X;
      var dy = z.Y - zombie.Y;
      if (dx * dx + dy * dy < 6400)
      {
        z.ZombieStrength -= 2;
        Game_SpriteHitFlash(z);
        Game_ShowDamageNumber(2, z, false);
        if (z.ZombieStrength <= 0)
        {
          z.doAction('die'); z.setGhost(true);
          Game_SpriteDyingEffect(z);
          Game_ZombiesInGame--; Game_ZombiesKilledThisLevel++; Game_TotalKills++;
          Game_UpdateProgressBar();
        }
      }
    }
    Game_ShowFloatingText('BOOM!', '#FF6600', zombie);
    Game_CheckLevelCompletion();
  }
  else if (weapon.WeaponType === 'Weapon06')
  {
    if (zombie && zombie.LivingState === 0)
    {
      zombie._frozen = true;
      zombie._frozenTimer = 150;
      zombie.setVelocity(0);
    }
  }
}

// ============================================
// #57 WAVE COUNTDOWN - 3...2...1...GO!
// ============================================
function Game_ShowWaveCountdown(callback)
{
  var container = document.getElementById('div_moviescreenframe');
  if (!container) { if (callback) callback(); return; }

  var el = document.getElementById('wave-countdown');
  if (!el)
  {
    el = document.createElement('div');
    el.id = 'wave-countdown';
    container.appendChild(el);
  }

  var counts = ['3', '2', '1', 'GO!'];
  var idx = 0;

  function showNext()
  {
    if (idx >= counts.length)
    {
      el.className = '';
      el.textContent = '';
      if (callback) callback();
      return;
    }
    el.textContent = counts[idx];
    el.className = '';
    void el.offsetWidth;
    el.className = 'visible';
    Game_SynthSFX('countdown');
    idx++;
    setTimeout(showNext, 600);
  }
  showNext();
}

// ============================================
// #58 ACTIVE ABILITIES with cooldowns
// ============================================
var Game_Abilities = {
  freezeAll: { name: 'Freeze', key: 'F', cooldown: 750, timer: 0, color: '#66CCFF' },
  snowStorm: { name: 'Storm', key: 'S', cooldown: 1500, timer: 0, color: '#AADDFF' },
  healPlayer: { name: 'Heal', key: 'H', cooldown: 1800, timer: 0, color: '#00FF88' }
};

function Game_UseAbility(abilityKey)
{
  var ab = Game_Abilities[abilityKey];
  if (!ab || ab.timer > 0 || !Game_LevelStarted || Game_GameIsOver) return;

  ab.timer = ab.cooldown;
  Game_SynthSFX('ability');

  var btn = document.getElementById('ability-' + abilityKey);
  if (btn) btn.classList.add('on-cooldown');

  if (abilityKey === 'freezeAll')
  {
    for (var zid in Game_Zombies)
    {
      var z = Game_Zombies[zid];
      if (!z || z.LivingState !== 0) continue;
      z._frozen = true;
      z._frozenTimer = 150;
      z.setVelocity(0);
    }
    Game_ShowFloatingText('FREEZE ALL!', '#66CCFF', null);
  }
  else if (abilityKey === 'snowStorm')
  {
    for (var zid2 in Game_Zombies)
    {
      var z2 = Game_Zombies[zid2];
      if (!z2 || z2.LivingState !== 0) continue;
      var stormDmg = Math.max(1, Math.ceil(z2.ZombieStrength * 0.3));
      z2.ZombieStrength -= stormDmg;
      Game_SpriteHitFlash(z2);
      Game_SpawnHitSparks(z2);
      Game_ShowDamageNumber(stormDmg, z2, false);
      if (z2.ZombieStrength <= 0)
      {
        z2.doAction('die'); z2.setGhost(true);
        Game_SpriteDyingEffect(z2);
        Game_ZombiesInGame--; Game_ZombiesKilledThisLevel++; Game_TotalKills++;
        Game_UpdateProgressBar();
      }
    }
    Game_ShowFloatingText('SNOW STORM!', '#AADDFF', null);
    Game_CheckLevelCompletion();
  }
  else if (abilityKey === 'healPlayer')
  {
    for (var pid in Game_PlayersArray)
    {
      var p = Game_PlayersArray[pid];
      if (p && p.LivingState !== 0)
      {
        p.doResurrect();
        p.Strength = Game_Sprite_TypeProperties[p.Type].Strength;
        p.setVelocity(Game_Sprite_TypeProperties[p.Type].VelLimit);
        p.setGhost(false);
        Game_NumberOfPlayers++;
        Game_ShowFloatingText('PLAYER REVIVED!', '#00FF88', null);
        break;
      }
    }
  }
}

function Game_UpdateAbilityCooldowns()
{
  for (var key in Game_Abilities)
  {
    var ab = Game_Abilities[key];
    if (ab.timer > 0)
    {
      ab.timer--;
      var btn = document.getElementById('ability-' + key);
      if (btn)
      {
        var pct = (ab.timer / ab.cooldown) * 100;
        var overlay = btn.querySelector('.cooldown-overlay');
        if (overlay) overlay.style.height = pct + '%';
        if (ab.timer <= 0) btn.classList.remove('on-cooldown');
      }
    }
  }
}

// ============================================
// #59 DYNAMIC DIFFICULTY
// ============================================
var Game_DifficultyMultiplier = 1.0;
var Game_DifficultyCheckTimer = 0;

function Game_UpdateDynamicDifficulty()
{
  Game_DifficultyCheckTimer++;
  if (Game_DifficultyCheckTimer < 300) return;
  Game_DifficultyCheckTimer = 0;
  if (Game_LevelShotsFired < 5) return;

  var accuracy = Game_LevelShotsHit / Game_LevelShotsFired;
  var deathRate = Game_LevelDamageTaken / Math.max(1, Game_ZombiesKilledThisLevel);

  if (accuracy > 0.8 && deathRate < 0.1)
  {
    Game_DifficultyMultiplier = Math.min(Game_DifficultyMultiplier + 0.05, 2.0);
    Game_MaxZombiesInGame = Math.min(15, 9 + Math.floor(Game_DifficultyMultiplier * 3));
  }
  else if (accuracy < 0.3 || deathRate > 0.5)
  {
    Game_DifficultyMultiplier = Math.max(Game_DifficultyMultiplier - 0.05, 0.5);
    Game_MaxZombiesInGame = Math.max(5, Math.floor(9 * Game_DifficultyMultiplier));
  }
}

// ============================================
// #60 CHARACTER UNLOCK SYSTEM
// ============================================
var Game_CharacterUnlocks = {};
var Game_CharacterUnlockCosts = {
  'player4': 5, 'player5': 10, 'player6': 15,
  'player7': 25, 'player8': 35, 'player9': 50
};

function Game_LoadCharacterUnlocks()
{
  try {
    var saved = localStorage.getItem('chilly_char_unlocks');
    if (saved) Game_CharacterUnlocks = JSON.parse(saved);
  } catch(e) {}
}

function Game_SaveCharacterUnlocks()
{
  try { localStorage.setItem('chilly_char_unlocks', JSON.stringify(Game_CharacterUnlocks)); } catch(e) {}
}

function Game_GetTotalStars()
{
  var total = 0;
  for (var lvl in Game_LevelStars) total += (Game_LevelStars[lvl] || 0);
  return total;
}

function Game_ShowCharacterSelect()
{
  var totalStars = Game_GetTotalStars();
  var overlay = document.createElement('div');
  overlay.id = 'charselect-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:700;display:flex;align-items:center;justify-content:center;';

  var panel = document.createElement('div');
  panel.style.cssText = 'background:#0f0c29;border:3px solid #FFD700;padding:20px;font-family:"Courier New",monospace;text-align:center;max-width:450px;width:90%;';

  var title = document.createElement('div');
  title.style.cssText = 'color:#FFD700;font-size:18px;font-weight:bold;margin-bottom:5px;text-shadow:2px 2px 0 #000';
  title.textContent = 'CHARACTERS';
  panel.appendChild(title);

  var starsInfo = document.createElement('div');
  starsInfo.style.cssText = 'color:#88CCFF;font-size:12px;margin-bottom:15px;';
  starsInfo.textContent = 'Total Stars: ' + totalStars + ' \u2605';
  panel.appendChild(starsInfo);

  var chars = ['player4','player5','player6','player7','player8','player9'];
  var charNames = ['Red Scout', 'Teal Ranger', 'Purple Knight', 'Gold Captain', 'Lime Sniper', 'Pink Mage'];

  for (var i = 0; i < chars.length; i++)
  {
    (function(charId, charName, cost) {
      var isUnlocked = Game_CharacterUnlocks[charId];
      var canUnlock = totalStars >= cost;
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:6px 0;padding:6px;border:1px solid ' + (isUnlocked ? '#00FF88' : '#333') + ';';
      var left = document.createElement('span');
      left.style.cssText = 'color:' + (isUnlocked ? '#fff' : '#666') + ';font-size:12px;';
      left.textContent = charName;
      var right = document.createElement('span');
      if (isUnlocked)
      {
        right.style.cssText = 'color:#00FF88;font-size:11px;font-weight:bold;';
        right.textContent = 'UNLOCKED';
      }
      else
      {
        right.style.cssText = 'cursor:pointer;padding:3px 10px;font-size:10px;font-weight:bold;border:1px solid;' + (canUnlock ? 'color:#FFD700;border-color:#FFD700;' : 'color:#555;border-color:#555;');
        right.textContent = cost + ' \u2605';
        if (canUnlock)
        {
          right.onmousedown = function(e) {
            e.preventDefault();
            Game_CharacterUnlocks[charId] = true;
            Game_SaveCharacterUnlocks();
            var old = document.getElementById('charselect-overlay');
            if (old) old.parentNode.removeChild(old);
            Game_ShowCharacterSelect();
          };
        }
      }
      row.appendChild(left);
      row.appendChild(right);
      panel.appendChild(row);
    })(chars[i], charNames[i], Game_CharacterUnlockCosts[chars[i]]);
  }

  var closeBtn = document.createElement('div');
  closeBtn.style.cssText = 'margin-top:15px;cursor:pointer;color:#FFD700;font-size:14px;font-weight:bold;padding:8px;border:2px solid #FFD700;';
  closeBtn.textContent = 'CLOSE';
  closeBtn.onmousedown = function(e) {
    e.preventDefault();
    var ol = document.getElementById('charselect-overlay');
    if (ol) ol.parentNode.removeChild(ol);
  };
  panel.appendChild(closeBtn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

// ============================================
// #61 SKILL TREE
// ============================================
var Game_SkillPoints = 0;
var Game_SkillTree = {
  weaponPower: { name: '+1 Weapon Damage', branch: 'Attack', level: 0, max: 3, cost: 3 },
  critChance: { name: '+5% Crit Chance', branch: 'Attack', level: 0, max: 3, cost: 4 },
  piercing: { name: '+10 Weapon Range', branch: 'Attack', level: 0, max: 3, cost: 5 },
  extraHP: { name: '+1 Player HP', branch: 'Defense', level: 0, max: 3, cost: 3 },
  shieldDur: { name: '+3s Shield', branch: 'Defense', level: 0, max: 3, cost: 4 },
  autoHeal: { name: 'Auto-Revive 1/level', branch: 'Defense', level: 0, max: 1, cost: 12 },
  gatherBoost: { name: '+25% Gather', branch: 'Utility', level: 0, max: 3, cost: 3 },
  snowBonus: { name: '+10 Start Snow', branch: 'Utility', level: 0, max: 3, cost: 2 },
  turretHP: { name: '+50 Turret Life', branch: 'Utility', level: 0, max: 3, cost: 4 }
};

function Game_LoadSkillTree()
{
  try {
    var saved = localStorage.getItem('chilly_skilltree');
    if (saved)
    {
      var data = JSON.parse(saved);
      Game_SkillPoints = data.points || 0;
      for (var k in data.skills) { if (Game_SkillTree[k]) Game_SkillTree[k].level = data.skills[k]; }
    }
  } catch(e) {}
}

function Game_SaveSkillTree()
{
  var skills = {};
  for (var k in Game_SkillTree) skills[k] = Game_SkillTree[k].level;
  try { localStorage.setItem('chilly_skilltree', JSON.stringify({ points: Game_SkillPoints, skills: skills })); } catch(e) {}
}

function Game_ApplySkillTree()
{
  for (var wt in Game_WeaponTypes)
  {
    if (!Game_WeaponTypes[wt]._skillApplied)
    {
      Game_WeaponTypes[wt].Strength += Game_SkillTree.weaponPower.level;
      Game_WeaponTypes[wt].LifeSpan += Game_SkillTree.piercing.level * 10;
      Game_WeaponTypes[wt]._skillApplied = true;
    }
  }
  Game_CriticalHitChance = 0.15 + Game_SkillTree.critChance.level * 0.05;
  for (var pid in Game_PlayersArray)
  {
    var p = Game_PlayersArray[pid];
    if (p && !p._skillApplied)
    {
      p.Strength += Game_SkillTree.extraHP.level * 2;
      p._skillApplied = true;
    }
  }
}

function Game_EarnSkillPoints(stars)
{
  Game_SkillPoints += stars;
  Game_SaveSkillTree();
}

function Game_ShowSkillTree()
{
  var overlay = document.createElement('div');
  overlay.id = 'skilltree-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:700;display:flex;align-items:center;justify-content:center;';

  var panel = document.createElement('div');
  panel.className = 'skilltree-panel';

  var title = document.createElement('div');
  title.style.cssText = 'color:#FFD700;font-size:18px;font-weight:bold;margin-bottom:5px;text-shadow:2px 2px 0 #000;text-align:center;';
  title.textContent = 'SKILL TREE';
  panel.appendChild(title);

  var pointsDiv = document.createElement('div');
  pointsDiv.style.cssText = 'color:#88CCFF;font-size:12px;margin-bottom:15px;text-align:center;';
  pointsDiv.textContent = 'Skill Points: ' + Game_SkillPoints;
  panel.appendChild(pointsDiv);

  var branches = ['Attack', 'Defense', 'Utility'];
  var branchColors = { Attack: '#FF4444', Defense: '#00FF88', Utility: '#88CCFF' };

  for (var b = 0; b < branches.length; b++)
  {
    var branchDiv = document.createElement('div');
    branchDiv.className = 'skilltree-branch';
    var branchTitle = document.createElement('div');
    branchTitle.className = 'skilltree-branch-title';
    branchTitle.style.color = branchColors[branches[b]];
    branchTitle.textContent = branches[b].toUpperCase();
    branchDiv.appendChild(branchTitle);

    for (var sk in Game_SkillTree)
    {
      if (Game_SkillTree[sk].branch !== branches[b]) continue;
      (function(skillKey) {
        var skill = Game_SkillTree[skillKey];
        var node = document.createElement('div');
        node.className = 'skilltree-node';
        var nameSpan = document.createElement('span');
        nameSpan.className = 'skilltree-node-name';
        nameSpan.textContent = skill.name + ' [' + skill.level + '/' + skill.max + ']';
        var btn = document.createElement('span');
        btn.className = 'skilltree-node-btn';
        var canBuy = Game_SkillPoints >= skill.cost && skill.level < skill.max;
        btn.style.cssText = canBuy ? 'color:#FFD700;border-color:#FFD700;cursor:pointer;' : 'color:#555;border-color:#555;';
        btn.textContent = skill.cost + ' SP';
        if (canBuy)
        {
          btn.onmousedown = function(e) {
            e.preventDefault();
            Game_SkillPoints -= skill.cost;
            skill.level++;
            Game_SaveSkillTree();
            var old = document.getElementById('skilltree-overlay');
            if (old) old.parentNode.removeChild(old);
            Game_ShowSkillTree();
          };
        }
        node.appendChild(nameSpan);
        node.appendChild(btn);
        branchDiv.appendChild(node);
      })(sk);
    }
    panel.appendChild(branchDiv);
  }

  var closeBtn = document.createElement('div');
  closeBtn.style.cssText = 'margin-top:15px;cursor:pointer;color:#FFD700;font-size:14px;font-weight:bold;padding:8px;border:2px solid #FFD700;text-align:center;';
  closeBtn.textContent = 'CLOSE';
  closeBtn.onmousedown = function(e) {
    e.preventDefault();
    var ol = document.getElementById('skilltree-overlay');
    if (ol) ol.parentNode.removeChild(ol);
  };
  panel.appendChild(closeBtn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

// ============================================
// #62 ONLINE LEADERBOARD
// ============================================
function Game_SubmitOnlineScore()
{
  if (!window.OnlineAPI) return;
  var name = 'PLR';
  try { var hsName = localStorage.getItem('chilly_player_name'); if (hsName) name = hsName; } catch(e) {}
  OnlineAPI.submitScore(name, Game_Score, Game_CurrentLevel, function(success) {
    if (success) console.log('[ONLINE] Score submitted:', Game_Score);
  });
}

function Game_ShowOnlineLeaderboard()
{
  if (!window.OnlineAPI)
  {
    Game_ShowFloatingText('Online not available', '#FF4444', null);
    return;
  }
  OnlineAPI.getHighScores(20, function(scores) {
    var overlay = document.createElement('div');
    overlay.id = 'leaderboard-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:800;display:flex;align-items:center;justify-content:center;';
    var panel = document.createElement('div');
    panel.style.cssText = 'background:#0f0c29;border:3px solid #FFD700;padding:20px;font-family:"Courier New",monospace;text-align:center;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;';
    var title = document.createElement('div');
    title.style.cssText = 'color:#FFD700;font-size:18px;font-weight:bold;margin-bottom:15px;text-shadow:2px 2px 0 #000';
    title.textContent = 'ONLINE LEADERBOARD';
    panel.appendChild(title);
    if (scores && scores.length > 0)
    {
      for (var i = 0; i < scores.length; i++)
      {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;font-size:12px;';
        var rank = document.createElement('span');
        rank.style.color = i < 3 ? '#FFD700' : '#88CCFF';
        rank.textContent = '#' + (i + 1) + ' ' + (scores[i].name || 'AAA');
        var score = document.createElement('span');
        score.style.cssText = 'color:#fff;font-weight:bold;';
        score.textContent = scores[i].score;
        row.appendChild(rank);
        row.appendChild(score);
        panel.appendChild(row);
      }
    }
    else
    {
      var noData = document.createElement('div');
      noData.style.cssText = 'color:#666;font-size:12px;padding:20px;';
      noData.textContent = 'No scores yet!';
      panel.appendChild(noData);
    }
    var closeBtn = document.createElement('div');
    closeBtn.style.cssText = 'margin-top:15px;cursor:pointer;color:#FFD700;font-size:14px;font-weight:bold;padding:8px;border:2px solid #FFD700;';
    closeBtn.textContent = 'CLOSE';
    closeBtn.onmousedown = function(e) {
      e.preventDefault();
      var ol = document.getElementById('leaderboard-overlay');
      if (ol) ol.parentNode.removeChild(ol);
    };
    panel.appendChild(closeBtn);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  });
}

// ============================================
// #63 SYNTHESIZED SOUND EFFECTS
// ============================================
function Game_SynthSFX(type)
{
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    var now = ctx.currentTime;

    if (type === 'critical')
    {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    }
    else if (type === 'combo')
    {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.06);
      osc.frequency.setValueAtTime(784, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    }
    else if (type === 'achievement')
    {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.1);
      osc.frequency.setValueAtTime(784, now + 0.2);
      osc.frequency.setValueAtTime(1047, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now); osc.stop(now + 0.5);
    }
    else if (type === 'levelup')
    {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    }
    else if (type === 'shop')
    {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    }
    else if (type === 'ability')
    {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    }
    else if (type === 'countdown')
    {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    }
    setTimeout(function() { ctx.close(); }, 1000);
  } catch(e) {}
}

// ============================================
// #64 PROCEDURAL BACKGROUND MUSIC
// ============================================
var Game_MusicContext = null;
var Game_MusicPlaying = false;
var Game_MusicOscillators = [];
var Game_MusicGeneration = 0;

function Game_StartBackgroundMusic(levelGroup)
{
  Game_StopBackgroundMusic();
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    Game_MusicContext = new AudioCtx();
  } catch(e) { return; }

  Game_MusicPlaying = true;
  var scales = [
    [261, 294, 330, 349, 392, 440, 494],
    [261, 294, 311, 349, 392, 415, 466],
    [261, 293, 311, 349, 370, 415, 466],
    [261, 311, 349, 370, 466, 523, 587]
  ];
  var group = Math.min(levelGroup || 0, scales.length - 1);
  var scale = scales[group];
  var ctx = Game_MusicContext;
  var masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
  masterGain.connect(ctx.destination);

  var bass = ctx.createOscillator();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(scale[0] / 2, ctx.currentTime);
  var bassGain = ctx.createGain();
  bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
  bass.connect(bassGain);
  bassGain.connect(masterGain);
  bass.start();
  Game_MusicOscillators.push(bass);

  var melody = ctx.createOscillator();
  melody.type = 'triangle';
  var melodyGain = ctx.createGain();
  melodyGain.gain.setValueAtTime(0.15, ctx.currentTime);
  melody.connect(melodyGain);
  melodyGain.connect(masterGain);
  melody.start();
  Game_MusicOscillators.push(melody);

  var noteIdx = 0;
  var bpm = 100 + group * 20;
  var beatTime = 60 / bpm;
  var myGeneration = Game_MusicGeneration;

  function scheduleNotes()
  {
    if (!Game_MusicPlaying || myGeneration !== Game_MusicGeneration) return;
    var now = ctx.currentTime;
    for (var i = 0; i < 8; i++)
    {
      var t = now + i * beatTime;
      var noteFreq = scale[(noteIdx + i) % scale.length];
      melody.frequency.setValueAtTime(noteFreq, t);
    }
    noteIdx += 8;
    setTimeout(scheduleNotes, beatTime * 8 * 1000);
  }
  scheduleNotes();
}

function Game_StopBackgroundMusic()
{
  Game_MusicPlaying = false;
  Game_MusicGeneration++;
  for (var i = 0; i < Game_MusicOscillators.length; i++)
  {
    try { Game_MusicOscillators[i].stop(); } catch(e) {}
  }
  Game_MusicOscillators = [];
  if (Game_MusicContext)
  {
    try { Game_MusicContext.close(); } catch(e) {}
    Game_MusicContext = null;
  }
}

// ============================================
// EFFECTS CANVAS - Unified particle system
// ============================================
var Game_EffectsParticles = [];
var Game_EffectsCanvas = null;
var Game_EffectsCtx = null;

function Game_GetEffectsCanvas()
{
  if (Game_EffectsCanvas) return Game_EffectsCtx;
  Game_EffectsCanvas = document.createElement('canvas');
  Game_EffectsCanvas.id = 'effects-canvas';
  Game_EffectsCanvas.width = 960;
  Game_EffectsCanvas.height = 520;
  Game_EffectsCanvas.style.cssText = 'position:absolute;top:0;left:0;z-index:150;pointer-events:none;';
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(Game_EffectsCanvas);
  Game_EffectsCtx = Game_EffectsCanvas.getContext('2d');
  return Game_EffectsCtx;
}

function Game_UpdateEffectsCanvas()
{
  if (!Game_EffectsCanvas || Game_EffectsParticles.length === 0)
  {
    if (Game_EffectsCanvas && Game_EffectsParticles.length === 0)
    {
      Game_EffectsCtx.clearRect(0, 0, 960, 520);
    }
    return;
  }

  var ctx = Game_EffectsCtx;
  ctx.clearRect(0, 0, 960, 520);

  for (var i = Game_EffectsParticles.length - 1; i >= 0; i--)
  {
    var p = Game_EffectsParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    p.vy += (p.gravity || 0);

    if (p.life <= 0)
    {
      Game_EffectsParticles.splice(i, 1);
      continue;
    }

    var alpha = p.life / p.maxLife;
    var size = p.size * (0.5 + alpha * 0.5);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;

    if (p.shape === 'circle')
    {
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    else
    {
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

// #70 DEATH PARTICLE BURST
function Game_SpawnDeathParticles(sprite)
{
  if (!sprite || window.g_ViewPort_X === undefined) return;
  Game_GetEffectsCanvas();
  var sx = sprite.X + g_ViewPort_X + (sprite.Width || 32) / 2;
  var sy = sprite.Y + g_ViewPort_Y + (sprite.Height || 32) / 2;
  var colors = ['#FF4444', '#FF6600', '#FFCC00', '#FF0066', '#FFFFFF'];
  for (var i = 0; i < 12; i++)
  {
    var angle = (Math.PI * 2 / 12) * i + (Math.random() - 0.5) * 0.5;
    var speed = 1.5 + Math.random() * 3;
    Game_EffectsParticles.push({
      x: sx + (Math.random() - 0.5) * 6,
      y: sy + (Math.random() - 0.5) * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.08,
      size: 2 + Math.random() * 3,
      life: 20 + Math.floor(Math.random() * 15),
      maxLife: 35,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: 'square'
    });
  }
}

// #73 HIT IMPACT SPARKS
function Game_SpawnHitSparks(sprite)
{
  if (!sprite || window.g_ViewPort_X === undefined) return;
  Game_GetEffectsCanvas();
  var sx = sprite.X + g_ViewPort_X + (sprite.Width || 32) / 2;
  var sy = sprite.Y + g_ViewPort_Y + (sprite.Height || 32) / 2;
  var colors = ['#FFFFFF', '#FFEE88', '#FFD700'];
  for (var i = 0; i < 6; i++)
  {
    var angle = Math.random() * Math.PI * 2;
    var speed = 1 + Math.random() * 2;
    Game_EffectsParticles.push({
      x: sx,
      y: sy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.05,
      size: 1.5 + Math.random() * 2,
      life: 10 + Math.floor(Math.random() * 8),
      maxLife: 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: 'circle'
    });
  }
}

// #71 BOSS HEALTH BARS
function Game_UpdateBossHealthBars()
{
  if (!Game_EffectsCanvas || window.g_ViewPort_X === undefined) return;
  var ctx = Game_EffectsCtx;

  for (var zid in Game_Zombies)
  {
    var z = Game_Zombies[zid];
    if (!z || z.LivingState !== 0) continue;

    var typeInfo = Game_ZombieTypes[z.ZombieType];
    if (!typeInfo) continue;

    // Only show for bosses and tanks (strength > 1)
    var maxHP = typeInfo.Strength;
    if (maxHP <= 1) continue;

    var currentHP = z.Strength;
    if (currentHP <= 0) continue;

    var sx = z.X + g_ViewPort_X;
    var sy = z.Y + g_ViewPort_Y - 6;
    var barW = (z.Width || 32) * 0.8;
    var barH = 3;
    var ratio = currentHP / maxHP;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(sx, sy, barW, barH);

    // HP fill
    ctx.fillStyle = ratio > 0.5 ? '#00FF88' : ratio > 0.25 ? '#FFD700' : '#FF4444';
    ctx.fillRect(sx, sy, barW * ratio, barH);

    // Border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(sx, sy, barW, barH);
  }
}

// #72 COMBO SCREEN FLASH
function Game_ComboScreenFlash(multiplier)
{
  var container = document.getElementById('div_moviescreenframe');
  if (!container) return;

  var flash = document.getElementById('combo-flash');
  if (!flash)
  {
    flash = document.createElement('div');
    flash.id = 'combo-flash';
    flash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:180;pointer-events:none;opacity:0;transition:opacity 0.1s;';
    container.appendChild(flash);
  }

  var intensity = Math.min(multiplier / 10, 1);
  flash.style.boxShadow = 'inset 0 0 ' + (30 + intensity * 50) + 'px rgba(255,215,0,' + (0.3 + intensity * 0.4) + ')';
  flash.style.opacity = '1';
  setTimeout(function() { flash.style.opacity = '0'; }, 150);
}

// #74 SCORE POPUP AT KILL LOCATION
function Game_ShowScorePopup(points, sprite)
{
  if (!sprite || window.g_ViewPort_X === undefined) return;
  var el = document.createElement('div');
  el.textContent = '+' + points;
  el.style.cssText = 'position:absolute;z-index:210;font-family:"Courier New",monospace;font-weight:bold;font-size:' + (points >= 300 ? '16px' : '11px') + ';color:#00FF88;text-shadow:1px 1px 0 #000,0 0 8px rgba(0,255,136,0.5);pointer-events:none;transition:all 0.8s ease-out;opacity:1;letter-spacing:1px;';
  var sx = sprite.X + g_ViewPort_X + (Math.random() - 0.5) * 20;
  var sy = sprite.Y + g_ViewPort_Y - 10;
  el.style.left = sx + 'px';
  el.style.top = sy + 'px';
  var container = document.getElementById('div_moviescreenframe');
  if (container) container.appendChild(el);
  setTimeout(function() { el.style.top = (sy - 40) + 'px'; el.style.opacity = '0'; }, 30);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 850);
}
