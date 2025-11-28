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
                Dinosaur:     { SpriteType: 'Dinosaur', Worth: 1000, Strength: 7, SpawnSound: 'spawned_dinosaur'  }
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
                Player3: { Killed: 'bouncewall' }
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
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02'], // Types of Sprites that will always be ignored as obstacles when calculating target paths.
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
        SmartTargetVision : 100, // In percentage.  How far this sprite can see the world
                                 // at the time of doing smart-gototarget calculations.
                                 // 100% = the whole world.  50% = about a quarter of it (half width and half height).
        
        SmartTargetSearchLimit : 250, // How many animation frames must pass before the Sprite gives up finding a path.
                                     // Don't make this value dependant of g_FramesPerSecond.
                                     // Programs with more framerate would have more advantage over the rest.
        
        StopToCalculatePath : true, // If StopToCalculatePath is true, the Sprite will stop any movement
                                    // when assigned a smart-gototarget.
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02'], // Types of Sprites that will always be ignored as obstacles when calculating target paths.
        SmartPAttmptBeforeGivingUp : -1, // Number of attempts before a Sprite gives up going through an object, 
                                        // considers it an obstacle and tries to find another path.
                                        // 0:  Give up immediately.  -1:  Never give up.
                                        // N: Try N more times.
        
        Camera       : -1,  // -1:  Sprite is not a Camera.  0:  Sprite is a Camera, but the Camera is not active.
                            //  1:  Sprite is a Camera, and it's active (the view port follows it).
        
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
        ExcludeObstacleTypeList : ['Player','Player2','Player3','AmmoStation','Material','ShootingSpot','Prop01','Prop02'], // Types of Sprites that will always be ignored as obstacles when calculating target paths.
        SmartPAttmptBeforeGivingUp : -1, // Number of attempts before a Sprite gives up going through an object, 
                                        // considers it an obstacle and tries to find another path.
                                        // 0:  Give up immediately.  -1:  Never give up.
                                        // N: Try N more times.
        
        Camera       : -1,  // -1:  Sprite is not a Camera.  0:  Sprite is a Camera, but the Camera is not active.
                            //  1:  Sprite is a Camera, and it's active (the view port follows it).
        
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
                        img_walk03:    'anim_snowman_walk_02.gif',
                        img_walk04:    'anim_snowman_walk_01.gif',
                        img_dead:      'anim_snowman_dead.gif'
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
  Game_NewHighScoreNoticeAtGameOver = document.getElementById('span_gameover_newhighscore');
  Game_PauseLevelScreen      = document.getElementById('id_div_pauselevelscreen');
  Game_MainMenu_HighScore    = document.getElementById('id_mainmenu_highscore');
  
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
  Game_NewHighScoreNoticeAtGameOver.className = 'gameover_newhighscore span_hidden';
  Game_PauseLevelScreen.className = 'pauselevel div_hidden';
}

function Game_FromGameToMainMenu(TriggerFrameStop)
{
  Game_GameIsOver = false;
  if (TriggerFrameStop)
  {
    Game_TriggerFrameStop = true;
  }
  Game_CurrentLevel = 1;
  Game_ShowMainMenu();
}

function Game_Start(KickstartTimer)
{
  Game_MainScreen.className = 'div_shown';
  Game_MainMenu.className   = 'div_hidden';
  Game_SelectLevelScreen.className = 'div_hidden';
  Game_QuitLevelConfirmation.className = 'quitlevelconfirm div_hidden';
  Game_NewHighScoreNoticeAtGameOver.className = 'gameover_newhighscore span_hidden';
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
  Game_ZombieSpawnCount  = 0;
  Game_NumberShotWeapons = 0;
  Game_Score             = 0;
  
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
  Game_UpdateScreenScoreInfo();
}

function Game_RestartLevel()
{
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
  
  var LevelData = Game_LevelData[Level - 1];
  
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
  for (var PropIndex in LevelData.Props)
  {
    var ThisPropSprite = Game_CreateAndPlaceSprite(LevelData.Props[PropIndex].X,LevelData.Props[PropIndex].Y,LevelData.Props[PropIndex].Type)
    if (ThisPropSprite)
    {
      Game_Props.push(ThisPropSprite);
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
            Game_BaseY2 = ThisPlayerInfo.BaseY + parseInt(g_AnimTypes['Player'].idle.Image.height);
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
        ThisPlayerInfo = LevelData.PlayersList[PlayerInfo];
        
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
  
  SetSpriteTarget(Player,BaseX,BaseY,null,true,false);
  
  return Player;
}

function Game_CreateAndPlaceZombie(X,Y,ZombieType)
{
  var Zombie = Game_CreateAndPlaceSprite(X,Y,Game_ZombieTypes[ZombieType].SpriteType);
  Zombie.isPlayer   = false;
  Zombie.isZombie     = true;
  Zombie.isDinosaur   = (ZombieType == 'Dinosaur');
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
    if (SelectedSprite.isMaterial)
    {
      Game_PrintStatusBar('Junkyard: Source for ammo parts.');
    
      SelectSprite(SelectedSprite,false);
      
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        var ThisPlayer = PreviouslySelectedSprite;
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
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        var ThisPlayer = PreviouslySelectedSprite;
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
      if (PreviouslySelectedSprite && PreviouslySelectedSprite.isPlayer)
      {
        var ThisPlayer = PreviouslySelectedSprite;
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
      if (--Game_UpdateZombieObjectives <= 0)
      {
        Game_UpdateZombieObjectives = Math.floor(g_FramesPerSecond * 0.5);
        Game_UpdateZombieTargets();
      }
      
      if (--Game_ZombieSpawnCount <= 0)
      {
        Game_ZombieSpawnCount = Game_ZombieSpawnCountMax;
        
        if ((Game_ZombiesInGame < Game_MaxZombiesInGame) && (Game_ZombieTotalSpawnCount < Game_LevelTotalZombies))
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
              TheZombie.findTarget();
            }
            Game_ZombieTotalSpawnCount++;
            Game_ZombiesInGame++;
            SoundPlay(Game_ZombieTypes[Game_CurrentZombieSpawnType].SpawnSound);
          }
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
          
          Game_LoadLevel(Game_CurrentLevel,true);
          
          // Current level is 28?  Reload previous ammo stocks.
          
          if (Game_Camera)
          {
            Game_Camera.setCamera();
            if (g_isMobileSafari)
            {
              SetAnimationFPS(gc_MobileInitialFramesPerSecond);
            }
            SetSpriteTarget(Game_Camera,Game_LevelCameraX,Game_LevelCameraY,null,false,false);
          }
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
  ReplaceHTML('span_scoreboard',': ' + '<span class="scoreamount">' + Game_Score + '</span>');
}

function Game_UpdateAmmoScreenIfo(AmmoType)
{
  ReplaceHTML(Game_Ammo[AmmoType].CountId,Game_Ammo[AmmoType].Count);
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
        delete Game_PlayersArray[ThisPlayer.Id];
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

      if (Sprite2.ZombieStrength > Sprite1.WeaponStrength)
      {
        Sprite2.ZombieStrength -= Sprite1.WeaponStrength;
        Sprite1.WeaponStrength = 0;
      }
      else
      {
        Sprite1.WeaponStrength -= Sprite2.ZombieStrength;
        Sprite2.ZombieStrength = 0;
      }
      
      if (Sprite2.ZombieStrength <= 0)
      {
        DeadZombie   = Sprite2;
      }
      else
      {
        SoundPlay('zombiehit');
        WeaponFailed = true;
      }
    }
    
    Result = false;
  }
  else if (Sprite2.isWeapon)
  {
    if (Sprite1.isZombie && (Sprite1.LivingState == 0))
    {
      KillerWeapon = Sprite2;
      
      if (Sprite1.ZombieStrength > Sprite2.WeaponStrength)
      {
        Sprite1.ZombieStrength -= Sprite2.WeaponStrength;
        Sprite2.WeaponStrength = 0;
      }
      else
      {
        Sprite2.WeaponStrength -= Sprite1.ZombieStrength;
        Sprite1.ZombieStrength = 0;
      }
      
      if (Sprite1.ZombieStrength <= 0)
      {
        DeadZombie   = Sprite1;
      }
      else
      {
        SoundPlay('zombiehit');
        WeaponFailed = true;
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
    }
    
    Game_ZombiesInGame--;
    
    if (DeadZombie)
    {
      Game_Score += Game_ZombieTypes[DeadZombie.ZombieType].Worth;
      
      if (Game_HighScore < Game_Score)
      {
        Game_HighScore = Game_Score;
        Game_NewHighScore = true;
      }
      
      Game_UpdateScreenScoreInfo();
    }
    
    if ((Game_ZombieTotalSpawnCount >= Game_LevelTotalZombies) && (Game_ZombiesInGame <= 0) && !Game_GameIsOver)
    {
      Game_LevelComplete = 1;
    }
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
      SetSpriteTarget(Weapon,TargetX,TargetY,null,false,false);
      Weapon.Target = -1;
      Weapon.moveToTarget();
      
      Game_Ammo[WeaponType].Count--;
      
      Game_UpdateAmmoScreenIfo(WeaponType);
      Game_NumberShotWeapons++;
      SoundPlay('weaponlaunched');
    }
  }
}

function Game_GroundClicked(X,Y,PreviouslySelectedSprite)
{
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
  
  for (var j in Game_Players)
  {
    if (Game_Players[j])
    {
      Game_Players[j].Strength = Game_Sprite_TypeProperties[Game_Players[j].Type].Strength;
      Game_Players[j].setVelocity(Game_Sprite_TypeProperties[Game_Players[j].Type].VelLimit);
    }
  }
}

function Game_TheEnd()
{
  Game_GameEndScreen.className = 'gameend div_shown';
}

function Game_GameOver()
{
  Game_GameIsOver = true;
  
  if (Game_NewHighScore)
  {
    Game_NewHighScoreNoticeAtGameOver.className = 'gameover_newhighscore span_shown';
  }
  
  Game_GameOverScreen.className = 'gameover div_shown';
  SoundPlay('gameover');
}

function Game_LevelSelection()
{
  Game_SelectLevelScreen.className = 'selectlevel div_shown';
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

function Game_SmartTargetGivenUp(Sprite)
{
  // Continuous restart of target seeking, until conditions are given.
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
  Game_PauseLevelScreen.className = 'quitlevelconfirm div_hidden';
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
      
      Game_g_ControlBar_SelectIndicator.style.top  = 0;
      Game_g_ControlBar_SelectIndicator.style.left = ButtonDivDimensions.left;
      
      Game_g_ControlBar_SelectIndicator.className  = 'control_selectedbutton img_shown';
    }
    
    if (ShowTooltip)
    {
      Game_PrintStatusBar(Game_WeaponTypes[Weapon].Tooltip);
    }
  }
}

function Game_ControlBar_DeselectButton()
{
  if (Game_g_ControlBar_SelectedButton)
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
