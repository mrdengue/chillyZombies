// Level 1: Intro.
// Level 2: Intro to ammo building + ice blocks.  Snow zombies only.
// Level 3: Intro to material gathering + ice blocks.  Snow zombies only.
// Level 4: Intro to Normal Zombie - Blocks blocking the material gathering part.
// Level 5: More Normal Zombies.
// Level 6: Intro to Zombiess.  A couple of ice blocks, little ammo, tons of stock.
// Level 7: No Zombiess here - ice blocks.
// Level 8: Snow Zombies + SnowZombie variants + Sheep + blocks.
// Level 9: Normal Zombies + Sheep + Zombiess + Blocks.
// Level 10: Normal Zombies + Sheep + Ice Blocks.
// Level 11: Zombiesses + players in the middle.  They come from both sides.
// Level 12: Zombiesses + Sheep + players in the middle.
// Level 13: SnowZombie variants + Zombiesses + players in the bottom center.
// Level 14: Snow Zombies + SnowZombie variants + Normal Zombies + Sheep.
// Level 15: Block Labyrinth to the material.
// Level 16: Ice Block Labyrinth to the material.
// Level 17: SnowZombie variants close to you (add Zombiesses).  Material close.
// Level 18: SnowZombie variants close to you.  Material far.
// Level 19: Blocks appear/disappear intermittently, material on same side.
// Level 20: SnowZombie variants + blocks appear/disappear, material on opposite side.
// Level 21: BOSS1 (Ice Golem).  With useless blocks.
// Level 22: Tons of Zombiesses + 1 sheep in the middle.
// Level 23: Sheep only.  Tons of them.  Block protection.
// Level 24: Sheep only.  Tons of them.  Ice block protection.
// Level 25: Sheep only.  Tons of them.  No protection.
// Level 26: (Same place as last level, no position change). Sheep only.  Tons of them.  No protection.
// Level 27: (Same place as last level, no position change). Sheep only.  Just a few of them.  Joke level.
// Level 28: BOSS2 (Snow Wraith).
// Level 29: SnowZombie4-5 appear between you and material gathering.
// Level 30: SnowZombie3-5 + intermittent ice block walls.
// Level 31: Few sheep appear between you and material gathering, plus intermittent block walls.
// Level 32: Tons of sheep appear between you and material gathering, plus intermittent block walls.
// Level 33: Two Dinosaurs + BOSS3 (Frost Giant) + little ammo.
// Level 34: BOSS4 + all zombie types + dinosaur finale.

var Game_LevelData =
[
  {
    LevelNumber          : 1, // For easy ID and location purposes.
    LevelComments        : 'Intro - Learn the basics',
    FramesPerSecond      : gc_MobileInitialFramesPerSecond, // (or gc_MobileInitialFramesPerSecond_Slow,gc_MobileInitialFramesPerSecond_Fast)
    LevelTotalZombies    : 3,
    StartSpawnTimeInSecs : 1,
    ZombieMaxSpawnTime   : 1,
    ZombieSpawnList : [
                       ['Snowman',1],
                       ['Snowman',1],
                       ['Snowman',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [28 * 480,0 * 260 + 20],
                         [28 * 480,0 * 260 + 60],
                         [28 * 480,0 * 260 + 100],
                         [28 * 480,0 * 260 + 150],
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 28 * 480 + 400,
    ShootingSpotY : 0  * 260 + 70,
    
    LevelCameraX : 28 * 480 + 240,
    LevelCameraY : 0  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 28 * 480,
                             X2: 28 * 480 + 480,
                             Y1: 0 * 260  + 25,
                             Y2: 0 * 260  + 260
                           },
    PlayersList :
    {
      1:  {
            X     : 28 * 480 + 400,
            Y     : 0  * 260 + 50,
            BaseX : 28 * 480 + 400,
            BaseY : 0  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 28 * 480 + 360,
            Y     : 0  * 260 + 50,
            BaseX : 28 * 480 + 430,
            BaseY : 0  * 260 + 205,
            Type  : 'Player2'
          },
      3:  {
            X     : 28 * 480 + 320,
            Y     : 0  * 260 + 50,
            BaseX : 28 * 480 + 460,
            BaseY : 0  * 260 + 205,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 20,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 28 * 480 + 20,
                             Y: 20
             },
             {Type: 'Prop02',
                             X: 28 * 480 + 120,
                             Y: 70
             },
             {Type: 'Prop01',
                             X: 28 * 480 + 320,
                             Y: 200
             }
            ],
            
    Blocks : [
            ],
            
   InGameTip  : 'Tap on or around the Zombies to shoot at them.',
   InGameTipX : 28 * 480 + 300,
   InGameTipY : 0  * 260 + 25
  }
  ,
  {
    LevelNumber          : 2,
    LevelComments        : 'Intro to Ammo building',
    LevelTotalZombies    : 5,
    StartSpawnTimeInSecs : 1,
    ZombieMaxSpawnTime   : 1.5,
    ZombieSpawnList : [
                       ['Snowman',1],
                       ['Snowman',1],
                       ['Snowman',1],
                       ['NormalZombie',1],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [27 * 480,0 * 260 + 20],
                         [27 * 480,0 * 260 + 60],
                         [27 * 480,0 * 260 + 100],
                         [27 * 480,0 * 260 + 150],
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 27 * 480 + 350,
    AmmoY : 150,
    
    ShootingSpotX : 27 * 480 + 400,
    ShootingSpotY : 0  * 260 + 70,
    
    LevelCameraX : 27 * 480 + 240,
    LevelCameraY : 0  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 27 * 480,
                             X2: 27 * 480 + 480,
                             Y1: 0 * 260  + 25,
                             Y2: 0 * 260  + 260
                           },
    PlayersList :
    {
      1:  {
            X     : 27 * 480 + 400,
            Y     : 0  * 260 + 50,
            BaseX : 27 * 480 + 400,
            BaseY : 0  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 27 * 480 + 360,
            Y     : 0  * 260 + 50,
            BaseX : 27 * 480 + 430,
            BaseY : 0  * 260 + 205,
            Type  : 'Player2'
          }
    },
    
    SnowStock : 300,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 27 * 480 + 20,
                             Y: 20
             }
             ,
             {Type: 'Prop02',
                             X: 27 * 480 + 380,
                             Y: 150
             }
            ],
            
    Blocks : [
              {Type: 'IceBlockx2v',X: 27 * 480 + 100,Y: 50},
              {Type: 'IceBlockx2v',X: 27 * 480 + 100,Y: 100},
              {Type: 'IceBlockx2v',X: 27 * 480 + 100,Y: 150},
              {Type: 'IceBlockx2v',X: 27 * 480 + 100,Y: 200},
              {Type: 'IceBlock',   X: 27 * 480 + 160,Y: 110},
              {Type: 'IceBlock',   X: 27 * 480 + 160,Y: 170}
            ],
            
   InGameTip  : 'No ammo! Build more here at the Ammo Station.',
   InGameTipX : 27 * 480 + 220,
   InGameTipY : 180
  }
  ,
  {
    LevelNumber          : 3,
    LevelComments        : 'Intro to Material gathering',
    LevelTotalZombies    : 6,
    StartSpawnTimeInSecs : 7,
    ZombieMaxSpawnTime   : 0.5,
    ZombieSpawnList : [
                       ['Snowman',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [26 * 480,0 * 260 + 20],
                         [26 * 480,0 * 260 + 60],
                         [26 * 480,0 * 260 + 100],
                         [26 * 480,0 * 260 + 150],
                        ],
    
    MaterialPositionX : 26 * 480 + 250,
    MaterialPositionY : 20,
    
    AmmoX : 26 * 480 + 330,
    AmmoY : 170,
    
    ShootingSpotX : 26 * 480 + 400,
    ShootingSpotY : 0  * 260 + 70,
    
    LevelCameraX : 26 * 480 + 240,
    LevelCameraY : 0  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 26 * 480,
                             X2: 26 * 480 + 480,
                             Y1: 0 * 260  + 25,
                             Y2: 0 * 260  + 260
                           },
    
    PlayersList : 
    {
      1:  {
            X     : 26 * 480 + 400,
            Y     : 0  * 260 + 120,
            BaseX : 26 * 480 + 400,
            BaseY : 0  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 26 * 480 + 360,
            Y     : 0  * 260 + 120,
            BaseX : 26 * 480 + 430,
            BaseY : 0  * 260 + 205,
            Type  : 'Player2'
          },
      3:  {
            X     : 26 * 480 + 320,
            Y     : 0  * 260 + 120,
            BaseX : 26 * 480 + 460,
            BaseY : 0  * 260 + 205,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 26 * 480 + 20,
                             Y: 20
             },
             {Type: 'Prop02',
                             X: 26 * 480 + 120,
                             Y: 130
             },
             {Type: 'Prop01',
                             X: 26 * 480 + 180,
                             Y: 220
             }
            ],
            
    Blocks : [
              {Type: 'IceBlockx2v',X: 26 * 480 + 120,Y: 60},
              {Type: 'IceBlockx2v',X: 26 * 480 + 120,Y: 103},
              {Type: 'IceBlockx2v',X: 26 * 480 + 145,Y: 80},
              {Type: 'IceBlockx2v',X: 26 * 480 + 170,Y: 60},
              {Type: 'IceBlockx2v',X: 26 * 480 + 170,Y: 103},
              {Type: 'IceBlockx2v',X: 26 * 480 + 195,Y: 80}
            ],
            
   InGameTip  : 'Get more material to build Ammo here.',
   InGameTipX : 26 * 480 + 220,
   InGameTipY : 80
  }
  ,
  {
    LevelNumber          : 4,
    LevelComments        : 'Intro to normal zombies, plus blocks blocking the junkyard.',
    LevelTotalZombies    : 6,
    StartSpawnTimeInSecs : 10,
    ZombieMaxSpawnTime   : 0.5,
    ZombieSpawnList : [
                       ['Snowman',3],
                       ['NormalZombie',5],
                       ['Snowman',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [25 * 480,0 * 260 + 20],
                         [25 * 480,0 * 260 + 60],
                         [25 * 480,0 * 260 + 100],
                         [25 * 480,0 * 260 + 150],
                        ],
    
    MaterialPositionX : 25 * 480 + 165,
    MaterialPositionY : 20,
    
    AmmoX : 25 * 480 + 320,
    AmmoY : 180,
    
    ShootingSpotX : 25 * 480 + 400,
    ShootingSpotY : 0  * 260 + 70,
    
    LevelCameraX : 25 * 480 + 240,
    LevelCameraY : 0  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 25 * 480,
                             X2: 25 * 480 + 480,
                             Y1: 0 * 260  + 25,
                             Y2: 0 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 25 * 480 + 400,
            Y     : 0  * 260 + 120,
            BaseX : 25 * 480 + 400,
            BaseY : 0  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 25 * 480 + 360,
            Y     : 0  * 260 + 120,
            BaseX : 25 * 480 + 430,
            BaseY : 0  * 260 + 205,
            Type  : 'Player2'
          },
      3:  {
            X     : 25 * 480 + 320,
            Y     : 0  * 260 + 120,
            BaseX : 25 * 480 + 460,
            BaseY : 0  * 260 + 205,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 25 * 480 + 25,
                             Y: 40
             },
             {Type: 'Prop02',
                             X: 25 * 480 + 120,
                             Y: 130
             },
             {Type: 'Prop01',
                             X: 25 * 480 + 180,
                             Y: 220
             },
             {Type: 'Prop01',
                             X: 25 * 480 + 80,
                             Y: 160
             }
            ],
            
    Blocks : [
              {Type: 'Blockx3v',X: 25 * 480 + 135,Y: 28},
              {Type: 'Blockx3h',X: 25 * 480 + 135,Y: 88},
              {Type: 'Blockx2h',X: 25 * 480 + 195,Y: 88},
              {Type: 'Blockx3h',X: 25 * 480 + 235,Y: 88}
            ],
            
   InGameTip  : null,
   InGameTipX : 0,
   InGameTipY : 0
  }
  ,
  {
    LevelNumber          : 5,
    LevelComments        : 'All Normal Zombies, plus a more difficult way to get to the Material',
    LevelTotalZombies    : 10,
    StartSpawnTimeInSecs : 20,
    ZombieMaxSpawnTime   : 0.3,
    ZombieSpawnList : [
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [24 * 480 - 5,0 * 260 + 100],
                         [24 * 480 - 5,0 * 260 + 140],
                         [24 * 480 - 5,0 * 260 + 180],
                         [24 * 480 - 5,0 * 260 + 220],
                        ],
    
    MaterialPositionX : 24 * 480 + 205,
    MaterialPositionY : 20,
    
    AmmoX : 24 * 480 + 330,
    AmmoY : 170,
    
    ShootingSpotX : 24 * 480 + 400,
    ShootingSpotY : 0  * 260 + 70,
    
    LevelCameraX : 24 * 480 + 240,
    LevelCameraY : 0  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 24 * 480,
                             X2: 24 * 480 + 480,
                             Y1: 0 * 260  + 25,
                             Y2: 0 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 24 * 480 + 400,
            Y     : 0  * 260 + 120,
            BaseX : 24 * 480 + 400,
            BaseY : 0  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 24 * 480 + 360,
            Y     : 0  * 260 + 120,
            BaseX : 24 * 480 + 430,
            BaseY : 0  * 260 + 205,
            Type  : 'Player2'
          },
      3:  {
            X     : 24 * 480 + 320,
            Y     : 0  * 260 + 120,
            BaseX : 24 * 480 + 460,
            BaseY : 0  * 260 + 205,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 24 * 480 + 20,
                             Y: 20
             },
             {Type: 'Prop02',
                             X: 24 * 480 + 120,
                             Y: 150
             },
             {Type: 'Prop01',
                             X: 24 * 480 + 170,
                             Y: 200
             },
             {Type: 'Prop01',
                             X: 24 * 480 + 320,
                             Y: 50
             }
            ],
            
    Blocks : [
              {Type: 'Blockx2h',X: 24 * 480 + 155,Y: 90},
              {Type: 'Blockx2h',X: 24 * 480 + 195,Y: 80},
              {Type: 'Blockx3h',X: 24 * 480 + 235,Y: 80},
              {Type: 'Blockx3v',X: 24 * 480 + 275,Y: 5},
              {Type: 'Block',   X: 24 * 480 + 275,Y: 65}
            ],
            
   InGameTip  : 'You can send more than one fighter to the same station.',
   InGameTipX : 24 * 480 + 160,
   InGameTipY : 120
  }
  ,
  {
    LevelNumber          : 6,
    LevelComments        : 'Intro to the Zombiess',
    LevelTotalZombies    : 12,
    StartSpawnTimeInSecs : 12,
    ZombieMaxSpawnTime   : 0.8,
    ZombieSpawnList : [
                       ['NormalZombie',5],
                       ['Zombiess',6],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [24 * 480 + 150, 1 * 260 + 230],
                         [24 * 480 + 250,1 * 260 + 230],
                         [24 * 480 + 350,1 * 260 + 230]
                        ],
    
    MaterialPositionX : 24 * 480 + 400,
    MaterialPositionY : 1  * 260 + 100,
    
    AmmoX : 24 * 480 + 30,
    AmmoY : 1  * 260 + 60,
    
    ShootingSpotX : 24 * 480 + 90,
    ShootingSpotY : 1  * 260 + 35,
    
    LevelCameraX : 24 * 480 + 240,
    LevelCameraY : 1  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 24 * 480,
                             X2: 24 * 480 + 480,
                             Y1: 1  * 260  + 25,
                             Y2: 1  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 24 * 480 + 30,
            Y     : 1  * 260 + 25,
            BaseX : 24 * 480 + 190,
            BaseY : 1  * 260 + 100,
            Type  : 'Player'
          },
      2:  {
            X     : 24 * 480 + 60,
            Y     : 1  * 260 + 25,
            BaseX : 24 * 480 + 170,
            BaseY : 1  * 260 + 60,
            Type  : 'Player2'
          },
      3:  {
            X     : 24 * 480 + 90,
            Y     : 1  * 260 + 25,
            BaseX : 24 * 480 + 200,
            BaseY : 1  * 260 + 60,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 24 * 480 + 20,
                             Y: 1 * 260 + 90
             },
             {Type: 'Prop02',
                             X: 24 * 480 + 120,
                             Y: 1 * 260 + 140
             },
             {Type: 'Prop02',
                             X: 24 * 480 + 180,
                             Y: 1 * 260 + 120
             },
             {Type: 'Prop02',
                             X: 24 * 480 + 320,
                             Y: 1 * 260 + 230
             }
            ],
            
    Blocks : [
              {Type: 'Blockx2h',X: 24 * 480 + 145,Y: 1 * 260 + 190}
             ]
  }
  ,
  {
    LevelNumber          : 7,
    LevelComments        : 'Normal Zombies + Ice Blocks',
    LevelTotalZombies    : 15,
    StartSpawnTimeInSecs : 10,
    ZombieMaxSpawnTime   : 0.6,
    ZombieSpawnList : [
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [23 * 480 + 460,1 * 260 + 100],
                         [23 * 480 + 460,1 * 260 + 200]
                        ],
    
    MaterialPositionX : 23 * 480 + 20,
    MaterialPositionY : 1  * 260 + 100,
    
    AmmoX : 23 * 480 + 180,
    AmmoY : 1  * 260 + 70,
    
    ShootingSpotX : 23 * 480 + 220,
    ShootingSpotY : 1  * 260 + 25,
    
    LevelCameraX : 23 * 480 + 240,
    LevelCameraY : 1  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 23 * 480,
                             X2: 23 * 480 + 480,
                             Y1: 1  * 260  + 25,
                             Y2: 1  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 23 * 480 + 30,
            Y     : 1  * 260 + 25,
            BaseX : 23 * 480 + 190,
            BaseY : 1  * 260 + 100,
            Type  : 'Player'
          },
      2:  {
            X     : 23 * 480 + 60,
            Y     : 1  * 260 + 25,
            BaseX : 23 * 480 + 170,
            BaseY : 1  * 260 + 60,
            Type  : 'Player2'
          },
      3:  {
            X     : 23 * 480 + 90,
            Y     : 1  * 260 + 25,
            BaseX : 23 * 480 + 200,
            BaseY : 1  * 260 + 60,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 23 * 480 + 20,
                             Y: 1 * 260 + 190
             },
             {Type: 'Prop02',
                             X: 23 * 480 + 150,
                             Y: 1 * 260 + 170
             },
             {Type: 'Prop01',
                             X: 23 * 480 + 300,
                             Y: 1 * 260 + 70
             },
             {Type: 'Prop02',
                             X: 23 * 480 + 400,
                             Y: 1 * 260 + 230
             }
            ],
            
    Blocks : [
              {Type: 'IceBlockx4v',X: 23 * 480 + 400,Y: 1 * 260 + 60},
              {Type: 'IceBlockx4v',X: 23 * 480 + 380,Y: 1 * 260 + 60},
              {Type: 'IceBlockx4v',X: 23 * 480 + 400,Y: 1 * 260 + 140},
              {Type: 'IceBlockx4v',X: 23 * 480 + 380,Y: 1 * 260 + 140}
             ]
  }
  ,
  {
    LevelNumber          : 8,
    LevelComments        : 'Snow Zombies + Sheep',
    LevelTotalZombies    : 25,
    StartSpawnTimeInSecs : 5,
    ZombieMaxSpawnTime   : 0.40,
    ZombieSpawnList : [
                       ['Snowman',5],
                       ['Sheep',9],
                       ['SnowZombie1',13],
                       ['Sheep',17],
                       ['SnowZombie2',20],
                       ['Sheep',-1]
                      ],

    ZombieSpawnSpots  : [
                         [22 * 480 + 180,1 * 260 + 25],
                         [22 * 480 + 330,1 * 260 + 25]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 22 * 480 + 380,
    ShootingSpotY : 1  * 260 + 150,
    
    LevelCameraX : 22 * 480 + 240,
    LevelCameraY : 1  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 22 * 480,
                             X2: 22 * 480 + 480,
                             Y1: 1  * 260  + 25,
                             Y2: 1  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 22 * 480 + 380,
            Y     : 1  * 260 + 85,
            BaseX : 22 * 480 + 450,
            BaseY : 1  * 260 + 100,
            Type  : 'Player'
          },
      2:  {
            X     : 22 * 480 + 380,
            Y     : 1  * 260 + 25,
            BaseX : 22 * 480 + 450,
            BaseY : 1  * 260 + 140,
            Type  : 'Player2'
          },
      3:  {
            X     : 22 * 480 + 380,
            Y     : 1  * 260 + 55,
            BaseX : 22 * 480 + 450,
            BaseY : 1  * 260 + 180,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 40,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 22 * 480 + 10,
                             Y: 1 * 260 + 90
             },
             {Type: 'Prop01',
                             X: 22 * 480 + 100,
                             Y: 1 * 260 + 170
             },
             {Type: 'Prop01',
                             X: 22 * 480 + 270,
                             Y: 1 * 260 + 200
             },
             {Type: 'Prop01',
                             X: 22 * 480 + 410,
                             Y: 1 * 260 + 90
             }
            ],
            
    Blocks : [
             ],
             
   InGameTip  : 'Quick!  Tap on the Killer Snowball weapon!',
   InGameTipX : 22 * 480 + 180,
   InGameTipY : 1 * 260 + 50
  }
  ,
  {
    LevelNumber          : 9,
    LevelComments        : 'Normal Zombies + 2 Sheep + Blocks',
    LevelTotalZombies    : 20,
    StartSpawnTimeInSecs : 1,
    ZombieMaxSpawnTime   : 0.4,
    ZombieSpawnList : [
                       ['NormalZombie',12],
                       ['Sheep',14],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [21 * 480 + 130,1 * 260 + 25],
                         [21 * 480 + 440,1 * 260 + 25]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 21 * 480 + 280,
    ShootingSpotY : 1  * 260 + 130,
    
    LevelCameraX : 21 * 480 + 240,
    LevelCameraY : 1  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 21 * 480,
                             X2: 21 * 480 + 480,
                             Y1: 1  * 260  + 25,
                             Y2: 1  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 21 * 480 + 380,
            Y     : 1  * 260 + 75,
            BaseX : 21 * 480 + 360,
            BaseY : 1  * 260 + 140,
            Type  : 'Player'
          },
      2:  {
            X     : 21 * 480 + 380,
            Y     : 1  * 260 + 35,
            BaseX : 21 * 480 + 360,
            BaseY : 1  * 260 + 180,
            Type  : 'Player2'
          },
      3:  {
            X     : 21 * 480 + 380,
            Y     : 1  * 260 + 55,
            BaseX : 21 * 480 + 360,
            BaseY : 1  * 260 + 220,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 25
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 21 * 480 + 10,
                             Y: 1 * 260 + 90
             },
             {Type: 'Prop01',
                             X: 21 * 480 + 100,
                             Y: 1 * 260 + 170
             },
             {Type: 'Prop01',
                             X: 21 * 480 + 270,
                             Y: 1 * 260 + 100
             },
             {Type: 'Prop02',
                             X: 21 * 480 + 410,
                             Y: 1 * 260 + 90
             }
            ],
            
    Blocks : [
              {Type: 'Blockx3h',X: 21 * 480 + 210,Y: 1 * 260 + 160},
              {Type: 'Blockx3h',X: 21 * 480 + 380,Y: 1 * 260 + 140}
             ],
             
   InGameTip  : 'Quick!  Tap on the FireGift weapon!',
   InGameTipX : 21 * 480 + 180,
   InGameTipY : 1 * 260 + 50
  }
  ,
  {
    LevelNumber          : 10,
    LevelComments        : 'Normal Zombies + 3 Sheep + Zombiess + Ice blocks',
    LevelTotalZombies    : 25,
    StartSpawnTimeInSecs : 3,
    ZombieMaxSpawnTime   : 0.2,
    ZombieSpawnList : [
                       ['NormalZombie',10],
                       ['Sheep',15],
                       ['NormalZombie',18],
                       ['Sheep',22],
                       ['Zombiess',23],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [20 * 480 + 70,1 * 260 + 25],
                         [20 * 480 + 470,1 * 260 + 25]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 20 * 480 + 250,
    ShootingSpotY : 1  * 260 + 120,
    
    LevelCameraX : 20 * 480 + 240,
    LevelCameraY : 1  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 20 * 480,
                             X2: 20 * 480 + 480,
                             Y1: 1  * 260  + 25,
                             Y2: 1  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 20 * 480 + 240,
            Y     : 1  * 260 + 85,
            BaseX : 20 * 480 + 340,
            BaseY : 1  * 260 + 140,
            Type  : 'Player'
          },
      2:  {
            X     : 20 * 480 + 240,
            Y     : 1  * 260 + 25,
            BaseX : 20 * 480 + 340,
            BaseY : 1  * 260 + 180,
            Type  : 'Player2'
          },
      3:  {
            X     : 20 * 480 + 240,
            Y     : 1  * 260 + 55,
            BaseX : 20 * 480 + 340,
            BaseY : 1  * 260 + 220,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 35,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 20 * 480 + 30,
                             Y: 1 * 260 + 90
             },
             {Type: 'Prop02',
                             X: 20 * 480 + 120,
                             Y: 1 * 260 + 170
             },
             {Type: 'Prop02',
                             X: 20 * 480 + 290,
                             Y: 1 * 260 + 100
             },
             {Type: 'Prop01',
                             X: 20 * 480 + 410,
                             Y: 1 * 260 + 90
             }
            ],
            
    Blocks : [
              {Type: 'IceBlock',X: 20 * 480 + 120,Y: 1 * 260 + 90},
              {Type: 'IceBlock',X: 20 * 480 + 142,Y: 1 * 260 + 90},
              {Type: 'IceBlock',X: 20 * 480 + 378,Y: 1 * 260 + 90},
              {Type: 'IceBlock',X: 20 * 480 + 400,Y: 1 * 260 + 90}
             ]
  }
  ,
  {
    LevelNumber          : 11,
    LevelComments        : 'Zombiesses, players in the middle.',
    LevelTotalZombies    : 15,
    StartSpawnTimeInSecs : 2.5,
    ZombieMaxSpawnTime   : 0.6,
    ZombieSpawnList : [
                       ['Zombiess',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [20 * 480 + 50,2 * 260 + 100],
                         [20 * 480 + 450,2 * 260 + 90]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 20 * 480 + 220,
    ShootingSpotY : 2  * 260 + 70,
    
    LevelCameraX : 20 * 480 + 240,
    LevelCameraY : 2  * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 20 * 480,
                             X2: 20 * 480 + 480,
                             Y1: 2  * 260  + 25,
                             Y2: 2  * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 20 * 480 + 220,
            Y     : 2  * 260 + 50,
            BaseX : 20 * 480 + 220,
            BaseY : 2  * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 20 * 480 + 240,
            Y     : 2  * 260 + 25,
            BaseX : 20 * 480 + 260,
            BaseY : 2  * 260 + 180,
            Type  : 'Player2'
          },
      3:  {
            X     : 20 * 480 + 260,
            Y     : 2  * 260 + 55,
            BaseX : 20 * 480 + 280,
            BaseY : 2  * 260 + 180,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 4,
            Weapon02: 13,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 20 * 480 + 180,
                             Y: 2 * 260 + 25
             },
             {Type: 'Prop02',
                             X: 20 * 480 + 205,
                             Y: 2 * 260 + 25
             },
             {Type: 'Prop02',
                             X: 20 * 480 + 230,
                             Y: 2 * 260 + 30
             },
             {Type: 'Prop02',
                             X: 20 * 480 + 255,
                             Y: 2 * 260 + 30
             }
            ],
            
    Blocks : [
             ]
  }
  ,
  {
    LevelNumber          : 12,
    LevelComments        : 'Zombiesses and sheep, players in the middle.',
    LevelTotalZombies    : 20,
    StartSpawnTimeInSecs : 2,
    ZombieMaxSpawnTime   : 0.3,
    ZombieSpawnList : [
                       ['Zombiess',2],
                       ['Sheep',6],
                       ['Zombiess',9],
                       ['Sheep',13],
                       ['Zombiess',15],
                       ['Sheep',17],
                       ['Zombiess',18],
                       ['Sheep',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [19 * 480 + 50,2 * 260 + 100],
                         [19 * 480 + 450,2 * 260 + 90]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 19 * 480 + 220,
    ShootingSpotY : 2 * 260 + 70,
    
    LevelCameraX : 19 * 480 + 240,
    LevelCameraY : 2 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 19 * 480,
                             X2: 19 * 480 + 480,
                             Y1: 2 * 260  + 25,
                             Y2: 2 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 19 * 480 + 220,
            Y     : 2 * 260 + 50,
            BaseX : 19 * 480 + 190,
            BaseY : 2 * 260 + 180,
            Type  : 'Player'
          },
      2:  {
            X     : 19 * 480 + 240,
            Y     : 2 * 260 + 25,
            BaseX : 19 * 480 + 230,
            BaseY : 2 * 260 + 180,
            Type  : 'Player2'
          },
      3:  {
            X     : 19 * 480 + 260,
            Y     : 2 * 260 + 55,
            BaseX : 19 * 480 + 260,
            BaseY : 2 * 260 + 180,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 40,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 19 * 480 + 125,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 19 * 480 + 185,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 19 * 480 + 240,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 19 * 480 + 300,
                             Y: 2 * 260 + 230
             }
            ],
            
    Blocks : [
             ]
  }
  ,
  {
    LevelNumber          : 13,
    LevelComments        : 'Zombiesses and Snow Zombies.  Players in the bottom center',
    LevelTotalZombies    : 10,
    StartSpawnTimeInSecs : 1.5,
    ZombieMaxSpawnTime   : 0.2,
    ZombieSpawnList : [
                       ['SnowZombie2',2],
                       ['Zombiess',4],
                       ['Snowman',6],
                       ['SnowZombie3',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [18 * 480 + 50,2 * 260 + 100],
                         [18 * 480 + 50,2 * 260 + 200],
                         [18 * 480 + 450,2 * 260 + 90],
                         [18 * 480 + 450,2 * 260 + 190],
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 18 * 480 + 220,
    ShootingSpotY : 2 * 260 + 135,
    
    LevelCameraX : 18 * 480 + 240,
    LevelCameraY : 2 * 260 + 130, // Minor adjustment.
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 18 * 480,
                             X2: 18 * 480 + 480,
                             Y1: 2 * 260  + 25,
                             Y2: 2 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 18 * 480 + 220,
            Y     : 2 * 260 + 50,
            BaseX : 18 * 480 + 310,
            BaseY : 2 * 260 + 190,
            Type  : 'Player'
          },
      2:  {
            X     : 18 * 480 + 240,
            Y     : 2 * 260 + 25,
            BaseX : 18 * 480 + 200,
            BaseY : 2 * 260 + 230,
            Type  : 'Player2'
          },
      3:  {
            X     : 18 * 480 + 260,
            Y     : 2 * 260 + 55,
            BaseX : 18 * 480 + 310,
            BaseY : 2 * 260 + 230,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 22,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 18 * 480 + 125,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 18 * 480 + 155,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 18 * 480 + 300,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop02',
                             X: 18 * 480 + 380,
                             Y: 2 * 260 + 230
             }
            ],
            
    Blocks : [
             ]
  }
  ,
  {
    LevelNumber          : 14,
    LevelComments        : 'Snow Zombies, Normal Zombies and Sheep - Ammo building',
    LevelTotalZombies    : 40,
    StartSpawnTimeInSecs : 15,
    ZombieMaxSpawnTime   : 0.2,
    ZombieSpawnList : [
                       ['Snowman',5],
                       ['NormalZombie',10],
                       ['SnowZombie1',18],
                       ['NormalZombie',26],
                       ['SnowZombie3',27],
                       ['Sheep',32],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [17 * 480 +  50,2 * 260 + 20],
                         [17 * 480 + 450,2 * 260 + 90],
                         [17 * 480 + 450,2 * 260 + 230],
                         [17 * 480 + 220,2 * 260 + 20],
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 17 * 480 + 160,
    AmmoY : 2 * 260 + 200,
    
    ShootingSpotX : 17 * 480 + 60,
    ShootingSpotY : 2 * 260 + 155,
    
    LevelCameraX : 17 * 480 + 240,
    LevelCameraY : 2 * 260 + 130, // Minor adjustment.
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 17 * 480,
                             X2: 17 * 480 + 480,
                             Y1: 2 * 260  + 25,
                             Y2: 2 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 17 * 480 + 20,
            Y     : 2 * 260 + 70,
            BaseX : 17 * 480 + 150,
            BaseY : 2 * 260 + 220,
            Type  : 'Player'
          },
      2:  {
            X     : 17 * 480 + 60,
            Y     : 2 * 260 + 75,
            BaseX : 17 * 480 + 40,
            BaseY : 2 * 260 + 230,
            Type  : 'Player2'
          },
      3:  {
            X     : 17 * 480 + 100,
            Y     : 2 * 260 + 70,
            BaseX : 17 * 480 + 40,
            BaseY : 2 * 260 + 200,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 800,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 17 * 480 + 125,
                             Y: 2 * 260 + 30
             },
             {Type: 'Prop01',
                             X: 17 * 480 + 155,
                             Y: 2 * 260 + 120
             },
             {Type: 'Prop02',
                             X: 17 * 480 + 300,
                             Y: 2 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 17 * 480 + 380,
                             Y: 2 * 260 + 130
             }
            ],
            
    Blocks : [
             ],
             
   InGameTip  : 'No ammo available. Build as much as you can!',
   InGameTipX : 17 * 480 + 140,
   InGameTipY : 2 * 260 + 130
             
  }
  ,
  {
    LevelNumber          : 15,
    LevelComments        : 'Block Labyrinth to the material',
    LevelTotalZombies    : 15,
    StartSpawnTimeInSecs : 12,
    ZombieMaxSpawnTime   : 1,
    ZombieSpawnList : [
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [16 * 480 +  30,2 * 260 + 20],
                         [16 * 480 +  30,2 * 260 + 200],
                        ],
    
    MaterialPositionX : 16 * 480 + 360,
    MaterialPositionY :  2 * 260 + 20,
    
    AmmoX : 16 * 480 + 280,
    AmmoY : 2 * 260 + 200,
    
    ShootingSpotX : 16 * 480 + 330,
    ShootingSpotY : 2 * 260 + 155,
    
    LevelCameraX : 16 * 480 + 240,
    LevelCameraY : 2 * 260 + 130, // Minor adjustment.
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 16 * 480,
                             X2: 16 * 480 + 480,
                             Y1: 2 * 260  + 25,
                             Y2: 2 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 16 * 480 + 20,
            Y     : 2 * 260 +  200,
            BaseX : 16 * 480 + 430,
            BaseY : 2 * 260 + 200,
            Type  : 'Player'
          },
      2:  {
            X     : 16 * 480 + 70,
            Y     : 2 * 260 +  205,
            BaseX : 16 * 480 + 430,
            BaseY : 2 * 260 + 230,
            Type  : 'Player2'
          },
      3:  {
            X     : 16 * 480 + 110,
            Y     : 2 * 260 +  200,
            BaseX : 16 * 480 + 400,
            BaseY : 2 * 260 + 230,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 3,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 16 * 480 + 125,
                             Y: 2 * 260 + 30
             },
             {Type: 'Prop02',
                             X: 16 * 480 + 155,
                             Y: 2 * 260 + 130
             },
             {Type: 'Prop02',
                             X: 16 * 480 + 300,
                             Y: 2 * 260 + 220
             },
             {Type: 'Prop01',
                             X: 16 * 480 + 420,
                             Y: 2 * 260 + 130
             }
            ],
            
    Blocks : [
               {Type: 'Blockx4h',X: 16 * 480 + 340,Y: 2 * 260 + 100},
               {Type: 'Blockx4h',X: 16 * 480 + 260,Y: 2 * 260 + 100},
               {Type: 'Blockx3h',X: 16 * 480 + 200,Y: 2 * 260 + 120},
               {Type: 'Blockx3v',X: 16 * 480 + 420,Y: 2 * 260 + 60},
               {Type: 'Blockx2v',X: 16 * 480 + 420,Y: 2 * 260 + 20},
               {Type: 'Blockx2v',X: 16 * 480 + 330,Y: 2 * 260 + 0},
               {Type: 'Blockx4h',X: 16 * 480 + 350,Y: 2 * 260 + 0}
             ]
  }
  ,
  {
    LevelNumber          : 16,
    LevelComments        : 'Ice Block Labyrinth to the material',
    LevelTotalZombies    : 15,
    StartSpawnTimeInSecs : 14,
    ZombieMaxSpawnTime   : 0.6,
    ZombieSpawnList : [
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [16 * 480 +  10,3 * 260 + 240],
                         [16 * 480 +  80,3 * 260 + 240],
                        ],
    
    MaterialPositionX : 16 * 480 + 260,
    MaterialPositionY :  3 * 260 + 155,
    
    AmmoX : 16 * 480 + 130,
    AmmoY : 3 * 260 + 60,
    
    ShootingSpotX : 16 * 480 + 50,
    ShootingSpotY : 3 * 260 + 0,
    
    LevelCameraX : 16 * 480 + 240,
    LevelCameraY : 3 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 16 * 480,
                             X2: 16 * 480 + 480,
                             Y1: 3 * 260  + 25,
                             Y2: 3 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 16 * 480 + 220,
            Y     : 3 * 260 +  50,
            BaseX : 16 * 480 + 120,
            BaseY : 3 * 260 + 30,
            Type  : 'Player'
          },
      2:  {
            X     : 16 * 480 + 270,
            Y     : 3 * 260 +  50,
            BaseX : 16 * 480 + 30,
            BaseY : 3 * 260 + 30,
            Type  : 'Player2'
          },
      3:  {
            X     : 16 * 480 + 310,
            Y     : 3 * 260 +  50,
            BaseX : 16 * 480 + 30,
            BaseY : 3 * 260 + 60,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 5,
            Weapon03: 1
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 16 * 480 + 125,
                             Y: 3 * 260 + 30
             },
             {Type: 'Prop02',
                             X: 16 * 480 + 175,
                             Y: 3 * 260 + 165
             },
             {Type: 'Prop02',
                             X: 16 * 480 + 300,
                             Y: 3 * 260 + 220
             },
             {Type: 'Prop01',
                             X: 16 * 480 + 420,
                             Y: 3 * 260 + 130
             }
            ],
            
    Blocks : [
               {Type: 'IceBlockx4h',X: 16 * 480 +  0,Y: 3 * 260 + 120},
               {Type: 'IceBlockx4h',X: 16 * 480 +  80,Y: 3 * 260 + 120},
               {Type: 'IceBlockx4h',X: 16 * 480 + 160,Y: 3 * 260 + 120},
               {Type: 'IceBlockx4h',X: 16 * 480 +  0,Y: 3 * 260 + 143},
               {Type: 'IceBlockx4h',X: 16 * 480 +  80,Y: 3 * 260 + 143},
               {Type: 'IceBlockx4h',X: 16 * 480 + 160,Y: 3 * 260 + 143},
               {Type: 'IceBlockx4h',X: 16 * 480 + 240,Y: 3 * 260 + 143},
               {Type: 'IceBlockx4h',X: 16 * 480 + 320,Y: 3 * 260 + 143}
             ]
  }
  ,
  {
    LevelNumber          : 17,
    LevelComments        : 'Zombies really close to players. One Zombiess.',
    LevelTotalZombies    : 30,
    StartSpawnTimeInSecs : 3.5,
    ZombieMaxSpawnTime   : 0.2,
    ZombieSpawnList : [
                       ['NormalZombie',5],
                       ['SnowZombie2',10],
                       ['NormalZombie',15],
                       ['Zombiess',16],
                       ['SnowZombie4',21],
                       ['NormalZombie',26],
                       ['SnowZombie1',-1]
                      ],

    ZombieSpawnSpots  : [
                         [15 * 480 +  300,3 * 260 + 70],
                         [15 * 480 +  300,3 * 260 + 100],
                         [15 * 480 +  300,3 * 260 + 170],
                         [15 * 480 +  300,3 * 260 + 200],
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 15 * 480 + 400,
    AmmoY : 3 * 260 + 120,
    
    ShootingSpotX : 15 * 480 + 400,
    ShootingSpotY : 3 * 260 + 25,
    
    LevelCameraX : 15 * 480 + 240,
    LevelCameraY : 3 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 15 * 480,
                             X2: 15 * 480 + 480,
                             Y1: 3 * 260  + 25,
                             Y2: 3 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 15 * 480 + 320,
            Y     : 3 * 260 +  50,
            BaseX : 15 * 480 + 460,
            BaseY : 3 * 260 + 160,
            Type  : 'Player'
          },
      2:  {
            X     : 15 * 480 + 370,
            Y     : 3 * 260 +  50,
            BaseX : 15 * 480 + 390,
            BaseY : 3 * 260 + 120,
            Type  : 'Player2'
          },
      3:  {
            X     : 15 * 480 + 350,
            Y     : 3 * 260 +  50,
            BaseX : 15 * 480 + 460,
            BaseY : 3 * 260 + 120,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 300,

    Ammo :
          {
            Weapon01: 30,
            Weapon02: 5,
            Weapon03: 2
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 15 * 480 + 125,
                             Y: 3 * 260 + 230
             },
             {Type: 'Prop02',
                             X: 15 * 480 + 175,
                             Y: 3 * 260 + 65
             },
             {Type: 'Prop02',
                             X: 15 * 480 + 300,
                             Y: 3 * 260 + 220
             },
             {Type: 'Prop02',
                             X: 15 * 480 + 420,
                             Y: 3 * 260 + 30
             }
            ],
            
    Blocks : [
             ]
  }
  ,
  {
    LevelNumber          : 18,
    LevelComments        : 'Zombies really close to players. One Zombiess.  Material far.',
    LevelTotalZombies    : 25,
    StartSpawnTimeInSecs : 3.5,
    ZombieMaxSpawnTime   : 0.25,
    ZombieSpawnList : [
                       ['NormalZombie',5],
                       ['SnowZombie3',10],
                       ['NormalZombie',15],
                       ['Zombiess',16],
                       ['SnowZombie5',21],
                       ['NormalZombie',-1]
                      ],

    ZombieSpawnSpots  : [
                         [14 * 480 +  300,3 * 260 + 70],
                         [14 * 480 +  300,3 * 260 + 200]
                        ],
    
    MaterialPositionX : 14 * 480 +  30,
    MaterialPositionY : 3 * 260 + 130,
    
    AmmoX : 14 * 480 + 400,
    AmmoY : 3 * 260 + 120,
    
    ShootingSpotX : 14 * 480 + 400,
    ShootingSpotY : 3 * 260 + 25,
    
    LevelCameraX : 14 * 480 + 240,
    LevelCameraY : 3 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 14 * 480,
                             X2: 14 * 480 + 480,
                             Y1: 3 * 260  + 25,
                             Y2: 3 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 14 * 480 + 320,
            Y     : 3 * 260 +  50,
            BaseX : 14 * 480 + 460,
            BaseY : 3 * 260 + 160,
            Type  : 'Player'
          },
      2:  {
            X     : 14 * 480 + 370,
            Y     : 3 * 260 +  50,
            BaseX : 14 * 480 + 390,
            BaseY : 3 * 260 + 120,
            Type  : 'Player2'
          },
      3:  {
            X     : 14 * 480 + 350,
            Y     : 3 * 260 +  50,
            BaseX : 14 * 480 + 460,
            BaseY : 3 * 260 + 120,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 300,

    Ammo :
          {
            Weapon01: 30,
            Weapon02: 5,
            Weapon03: 2
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 14 * 480 + 125,
                             Y: 3 * 260 + 230
             },
             {Type: 'Prop01',
                             X: 14 * 480 + 175,
                             Y: 3 * 260 + 65
             },
             {Type: 'Prop01',
                             X: 14 * 480 + 300,
                             Y: 3 * 260 + 220
             },
             {Type: 'Prop01',
                             X: 14 * 480 + 420,
                             Y: 3 * 260 + 30
             }
            ],
            
    Blocks : [
             ]
  }
  ,
  {
    LevelNumber          : 19,
    LevelComments        : 'Blocks appear/disappear intermittently, material on same side.',
    LevelTotalZombies    : 9,
    StartSpawnTimeInSecs : 3.5,
    ZombieMaxSpawnTime   : 1,
    ZombieSpawnList : [
                       ['Snowman',4],
                       ['NormalZombie',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [13 * 480 +  10,3 * 260 + 70],
                         [13 * 480 +  10,3 * 260 + 200]
                        ],
    
    MaterialPositionX : 13 * 480 +  330,
    MaterialPositionY : 3 * 260 + 30,
    
    AmmoX : 13 * 480 + 400,
    AmmoY : 3 * 260 + 170,
    
    ShootingSpotX : 13 * 480 + 400,
    ShootingSpotY : 3 * 260 + 75,
    
    LevelCameraX : 13 * 480 + 240,
    LevelCameraY : 3 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 13 * 480,
                             X2: 13 * 480 + 480,
                             Y1: 3 * 260  + 25,
                             Y2: 3 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 13 * 480 + 320,
            Y     : 3 * 260 +  50,
            BaseX : 13 * 480 + 460,
            BaseY : 3 * 260 + 210,
            Type  : 'Player'
          },
      2:  {
            X     : 13 * 480 + 370,
            Y     : 3 * 260 +  50,
            BaseX : 13 * 480 + 390,
            BaseY : 3 * 260 + 170,
            Type  : 'Player2'
          },
      3:  {
            X     : 13 * 480 + 350,
            Y     : 3 * 260 +  50,
            BaseX : 13 * 480 + 460,
            BaseY : 3 * 260 + 190,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 13 * 480 + 125,
                             Y: 3 * 260 + 30
             },
             {Type: 'Prop01',
                             X: 13 * 480 + 175,
                             Y: 3 * 260 + 165
             },
             {Type: 'Prop01',
                             X: 13 * 480 + 300,
                             Y: 3 * 260 + 120
             },
             {Type: 'Prop02',
                             X: 13 * 480 + 420,
                             Y: 3 * 260 + 40
             }
            ],
            
    Blocks : [
               {Type: 'Blockx4v',X: 13 * 480 +  240,Y: 3 * 260 + 20},
               {Type: 'Blockx4v',X: 13 * 480 +  240,Y: 3 * 260 + 95},
               {Type: 'Blockx4v',X: 13 * 480 +  240,Y: 3 * 260 + 175},
               {Type: 'Blockx4v',X: 13 * 480 +  280,Y: 3 * 260 + 20},
               {Type: 'Blockx4v',X: 13 * 480 +  280,Y: 3 * 260 + 95},
               {Type: 'Blockx4v',X: 13 * 480 +  280,Y: 3 * 260 + 175}
             ],
             
    IntermittentBlocks : true
  }
  ,
  {
    LevelNumber          : 20,
    LevelComments        : 'Blocks appear/disappear intermittently, material on opposite side.',
    LevelTotalZombies    : 30,
    StartSpawnTimeInSecs : 12,
    ZombieMaxSpawnTime   : 1,
    ZombieSpawnList : [
                       ['SnowZombie3',4],
                       ['NormalZombie',8],
                       ['SnowZombie4',10],
                       ['Zombiess',11],
                       ['NormalZombie',15],
                       ['Zombiess',18],
                       ['SnowZombie5',25],
                       ['Snowman',32],
                       ['NormalZombie',37],
                       ['SnowZombie1',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [12 * 480 +  10,3 * 260 + 70],
                         [12 * 480 +  10,3 * 260 + 200]
                        ],
    
    MaterialPositionX : 12 * 480 +  170,
    MaterialPositionY : 3 * 260 + 30,
    
    AmmoX : 12 * 480 + 400,
    AmmoY : 3 * 260 + 170,
    
    ShootingSpotX : 12 * 480 + 400,
    ShootingSpotY : 3 * 260 + 75,
    
    LevelCameraX : 12 * 480 + 240,
    LevelCameraY : 3 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 12 * 480,
                             X2: 12 * 480 + 480,
                             Y1: 3 * 260  + 25,
                             Y2: 3 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 12 * 480 + 320,
            Y     : 3 * 260 +  50,
            BaseX : 12 * 480 + 460,
            BaseY : 3 * 260 + 210,
            Type  : 'Player'
          },
      2:  {
            X     : 12 * 480 + 370,
            Y     : 3 * 260 +  50,
            BaseX : 12 * 480 + 390,
            BaseY : 3 * 260 + 170,
            Type  : 'Player2'
          },
      3:  {
            X     : 12 * 480 + 350,
            Y     : 3 * 260 +  50,
            BaseX : 12 * 480 + 460,
            BaseY : 3 * 260 + 190,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 12 * 480 + 125,
                             Y: 3 * 260 + 30
             },
             {Type: 'Prop02',
                             X: 12 * 480 + 175,
                             Y: 3 * 260 + 165
             },
             {Type: 'Prop02',
                             X: 12 * 480 + 300,
                             Y: 3 * 260 + 120
             },
             {Type: 'Prop01',
                             X: 12 * 480 + 420,
                             Y: 3 * 260 + 40
             }
            ],
            
    Blocks : [
               {Type: 'Blockx4v',X: 12 * 480 +  240,Y: 3 * 260 + 20},
               {Type: 'Blockx4v',X: 12 * 480 +  240,Y: 3 * 260 + 95},
               {Type: 'Blockx4v',X: 12 * 480 +  240,Y: 3 * 260 + 175},
               {Type: 'Blockx4v',X: 12 * 480 +  280,Y: 3 * 260 + 20},
               {Type: 'Blockx4v',X: 12 * 480 +  280,Y: 3 * 260 + 95},
               {Type: 'Blockx4v',X: 12 * 480 +  280,Y: 3 * 260 + 175}
             ],
             
    IntermittentBlocks : true
  },
  {
    LevelNumber          : 21,
    LevelComments        : 'Dinosaur and useless blocks.',
    LevelTotalZombies    : 20,
    StartSpawnTimeInSecs : 1,
    ZombieMaxSpawnTime   : 0.2,
    ZombieSpawnList : [
                       ['SnowZombie2',12],
                       ['Boss1',13],
                       ['SnowZombie4',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [12 * 480 +  10,4 * 260 + 70],
                         [12 * 480 +  10,4 * 260 + 200]
                        ],
    
    MaterialPositionX : 0,
    MaterialPositionY : 0,
    
    AmmoX : 0,
    AmmoY : 0,
    
    ShootingSpotX : 12 * 480 + 360,
    ShootingSpotY : 4 * 260 +35,
    
    LevelCameraX : 12 * 480 + 240,
    LevelCameraY : 4 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 12 * 480,
                             X2: 12 * 480 + 480,
                             Y1: 4 * 260  + 25,
                             Y2: 4 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 12 * 480 + 310,
            Y     : 4 * 260 +  50,
            BaseX : 12 * 480 + 350,
            BaseY : 4 * 260 + 50,
            Type  : 'Player'
          },
      2:  {
            X     : 12 * 480 + 420,
            Y     : 4 * 260 +  50,
            BaseX : 12 * 480 + 420,
            BaseY : 4 * 260 + 50,
            Type  : 'Player2'
          },
      3:  {
            X     : 12 * 480 + 420,
            Y     : 4 * 260 +  50,
            BaseX : 12 * 480 + 420,
            BaseY : 4 * 260 + 90,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 12,
            Weapon02: 0,
            Weapon03: 0
          },
    
    Props : [
             {Type: 'Prop02',
                             X: 12 * 480 + 45,
                             Y: 4 * 260 + 90
             },
             {Type: 'Prop02',
                             X: 12 * 480 + 175,
                             Y: 4 * 260 + 105
             },
             {Type: 'Prop02',
                             X: 12 * 480 + 300,
                             Y: 4 * 260 + 220
             },
             {Type: 'Prop01',
                             X: 12 * 480 + 420,
                             Y: 4 * 260 + 140
             }
            ],
            
    Blocks : [
               {Type: 'Block',X: 12 * 480 +  240,Y: 4 * 260 + 50},
               {Type: 'Block',X: 12 * 480 +  200,Y: 4 * 260 + 90},
               {Type: 'Block',X: 12 * 480 +  240,Y: 4 * 260 + 110},
               {Type: 'Block',X: 12 * 480 +  200,Y: 4 * 260 + 150},
               {Type: 'Block',X: 12 * 480 +  240,Y: 4 * 260 + 190},
               {Type: 'Block',X: 12 * 480 +  200,Y: 4 * 260 + 210}
             ]
  }
  ,
  {
    LevelNumber          : 22,
    LevelComments        : 'Tons of Zombiesses, one sheep in the middle.',
    LevelTotalZombies    : 16,
    StartSpawnTimeInSecs : 11,
    ZombieMaxSpawnTime   : 0.8,
    ZombieSpawnList : [
                       ['Zombiess',14],
                       ['Sheep',15],
                       ['Zombiess',-1]
                      ],
                      
    ZombieSpawnSpots  : [
                         [11 * 480 +  100,4 * 260 + 20],
                         [11 * 480 +  10,4 * 260 + 200]
                        ],
    
    MaterialPositionX : 11 * 480 +  220,
    MaterialPositionY : 4 * 260 + 180,
    
    AmmoX : 11 * 480 +  350,
    AmmoY : 4 * 260 + 180,
    
    ShootingSpotX : 11 * 480 + 400,
    ShootingSpotY : 4 * 260 + 90,
    
    LevelCameraX : 11 * 480 + 240,
    LevelCameraY : 4 * 260 + 120,
    
    LabyrinthConstraints : { // Related to camera/level screen position.
                             X1: 11 * 480,
                             X2: 11 * 480 + 480,
                             Y1: 4 * 260  + 25,
                             Y2: 4 * 260  + 260
                           },
    PlayersList : 
    {
      1:  {
            X     : 11 * 480 + 300,
            Y     : 4 * 260 +  20,
            BaseX : 11 * 480 + 390,
            BaseY : 4 * 260 + 90,
            Type  : 'Player'
          },
      2:  {
            X     : 11 * 480 + 330,
            Y     : 4 * 260 +  20,
            BaseX : 11 * 480 + 390,
            BaseY : 4 * 260 + 120,
            Type  : 'Player2'
          },
      3:  {
            X     : 11 * 480 + 360,
            Y     : 4 * 260 +  20,
            BaseX : 11 * 480 + 390,
            BaseY : 4 * 260 + 150,
            Type  : 'Player3'
          }
    },
    
    SnowStock : 0,

    Ammo :
          {
            Weapon01: 0,
            Weapon02: 2,
            Weapon03: 1
          },
    
    Props : [
             {Type: 'Prop01',
                             X: 11 * 480 + 45,
                             Y: 4 * 260 + 90
             },
             {Type: 'Prop01',
                             X: 11 * 480 + 175,
                             Y: 4 * 260 + 205
             },
             {Type: 'Prop01',
                             X: 11 * 480 + 300,
                             Y: 4 * 260 + 220
             },
             {Type: 'Prop02',
                             X: 11 * 480 + 420,
                             Y: 4 * 260 + 40
             }
            ],
            
    Blocks : [
             ]
  }
  ,
 {
 LevelNumber          : 23,
 LevelComments        : 'Sheep only.  Tons of them.  Block protection.',
 LevelTotalZombies    : 30,
 StartSpawnTimeInSecs : 11,
 ZombieMaxSpawnTime   : 0.4,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [10 * 480 +  10,4 * 260 + 10],
                      [10 * 480 +  10,4 * 260 + 200],
                      [10 * 480 +  470,4 * 260 + 10],
                      [10 * 480 +  470,4 * 260 + 200]
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 10 * 480 +  300,
 AmmoY : 4 * 260 + 160,
 
 ShootingSpotX : 10 * 480 + 230,
 ShootingSpotY : 4 * 260 + 100,
 
 LevelCameraX : 10 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 10 * 480,
 X2: 10 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 10 * 480 + 180,
 Y     : 4 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 4 * 260 + 130,
 Type  : 'Player'
 },
 2:  {
 X     : 10 * 480 + 290,
 Y     : 4 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 4 * 260 + 170,
 Type  : 'Player2'
 },
 3:  {
 X     : 10 * 480 + 320,
 Y     : 4 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 500,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 10,
 Weapon03: 5
 },
 
 Props : [
          {Type: 'Prop01',
          X: 10 * 480 + 40,
          Y: 4 * 260 + 100
          },
          {Type: 'Prop02',
          X: 10 * 480 + 185,
          Y: 4 * 260 + 205
          },
          {Type: 'Prop01',
          X: 10 * 480 + 300,
          Y: 4 * 260 + 200
          },
          {Type: 'Prop02',
          X: 10 * 480 + 420,
          Y: 4 * 260 + 60
          }
          ],
 
 Blocks : [
           {Type: 'Block',X: 10 * 480 +  70,Y: 4 * 260 + 200},
           {Type: 'Block',X: 10 * 480 +  100,Y: 4 * 260 + 140},
           {Type: 'Block',X: 10 * 480 +  190,Y: 4 * 260 + 90},
           {Type: 'Block',X: 10 * 480 +  260,Y: 4 * 260 + 30},
           {Type: 'Block',X: 10 * 480 +  300,Y: 4 * 260 + 90},
           {Type: 'Block',X: 10 * 480 +  380,Y: 4 * 260 + 120},
           {Type: 'Block',X: 10 * 480 +  410,Y: 4 * 260 + 160},
           {Type: 'Block',X: 10 * 480 +  400,Y: 4 * 260 + 200}
           ]
 }
 ,
 {
 LevelNumber          : 24,
 LevelComments        : 'Sheep only.  Tons of them.  Ice block protection.',
 LevelTotalZombies    : 20,
 StartSpawnTimeInSecs : 11,
 ZombieMaxSpawnTime   : 0.4,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [10 * 480 +  10,5 * 260 + 10],
                      [10 * 480 +  10,5 * 260 + 200],
                      [10 * 480 +  470,5 * 260 + 10],
                      [10 * 480 +  470,5 * 260 + 200]
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 10 * 480 +  300,
 AmmoY : 5 * 260 + 160,
 
 ShootingSpotX : 10 * 480 + 230,
 ShootingSpotY : 5 * 260 + 100,
 
 LevelCameraX : 10 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 10 * 480,
 X2: 10 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 10 * 480 + 180,
 Y     : 5 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 5 * 260 + 100,
 Type  : 'Player'
 },
 2:  {
 X     : 10 * 480 + 290,
 Y     : 5 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 5 * 260 + 150,
 Type  : 'Player2'
 },
 3:  {
 X     : 10 * 480 + 320,
 Y     : 5 * 260 +  20,
 BaseX : 10 * 480 + 200,
 BaseY : 5 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 500,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 10,
 Weapon03: 5
 },
 
 Props : [
          {Type: 'Prop02',
          X: 10 * 480 + 40,
          Y: 5 * 260 + 100
          },
          {Type: 'Prop01',
          X: 10 * 480 + 185,
          Y: 5 * 260 + 205
          },
          {Type: 'Prop02',
          X: 10 * 480 + 300,
          Y: 5 * 260 + 200
          },
          {Type: 'Prop01',
          X: 10 * 480 + 420,
          Y: 5 * 260 + 60
          }
          ],
 
 Blocks : [
           {Type: 'IceBlock',X: 10 * 480 +  70,Y: 5 * 260 + 200},
           {Type: 'IceBlock',X: 10 * 480 +  100,Y: 5 * 260 + 140},
           {Type: 'IceBlock',X: 10 * 480 +  190,Y: 5 * 260 + 90},
           {Type: 'IceBlock',X: 10 * 480 +  260,Y: 5 * 260 + 30},
           {Type: 'IceBlock',X: 10 * 480 +  300,Y: 5 * 260 + 90},
           {Type: 'IceBlock',X: 10 * 480 +  380,Y: 5 * 260 + 120},
           {Type: 'IceBlock',X: 10 * 480 +  410,Y: 5 * 260 + 160},
           {Type: 'IceBlock',X: 10 * 480 +  400,Y: 5 * 260 + 200}
           ]
 }
 ,
 {
 LevelNumber          : 25,
 LevelComments        : 'Sheep only.  Tons of them.  No protection.',
 LevelTotalZombies    : 20,
 StartSpawnTimeInSecs : 6,
 ZombieMaxSpawnTime   : 0.3,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [9 * 480 +  10,5 * 260 + 10],
                      [9 * 480 +  10,5 * 260 + 200],
                      [9 * 480 +  470,5 * 260 + 10],
                      [9 * 480 +  470,5 * 260 + 200]
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 9 * 480 +  300,
 AmmoY : 5 * 260 + 160,
 
 ShootingSpotX : 9 * 480 + 230,
 ShootingSpotY : 5 * 260 + 100,
 
 LevelCameraX : 9 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 9 * 480,
 X2: 9 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 9 * 480 + 180,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 100,
 Type  : 'Player'
 },
 2:  {
 X     : 9 * 480 + 290,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 150,
 Type  : 'Player2'
 },
 3:  {
 X     : 9 * 480 + 320,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 2000,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 10,
 Weapon03: 5
 },
 
 Props : [
          {Type: 'Prop01',
          X: 9 * 480 + 40,
          Y: 5 * 260 + 100
          },
          {Type: 'Prop01',
          X: 9 * 480 + 185,
          Y: 5 * 260 + 205
          },
          {Type: 'Prop01',
          X: 9 * 480 + 300,
          Y: 5 * 260 + 200
          },
          {Type: 'Prop01',
          X: 9 * 480 + 420,
          Y: 5 * 260 + 60
          }
          ],
 
 Blocks : [
 ]
 }
 ,
 {
 LevelNumber          : 26,
 LevelComments        : 'Sheep only.  Tons of them.  No protection (second round).',
 LevelTotalZombies    : 20,
 StartSpawnTimeInSecs : 9,
 ZombieMaxSpawnTime   : 0.3,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [9 * 480 +  10,5 * 260 + 10],
                      [9 * 480 +  10,5 * 260 + 200],
                      [9 * 480 +  470,5 * 260 + 10],
                      [9 * 480 +  470,5 * 260 + 200]
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 9 * 480 +  300,
 AmmoY : 5 * 260 + 160,
 
 ShootingSpotX : 9 * 480 + 230,
 ShootingSpotY : 5 * 260 + 100,
 
 LevelCameraX : 9 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 9 * 480,
 X2: 9 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 9 * 480 + 180,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 100,
 Type  : 'Player'
 },
 2:  {
 X     : 9 * 480 + 290,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 150,
 Type  : 'Player2'
 },
 3:  {
 X     : 9 * 480 + 320,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 1500,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 10,
 Weapon03: 5
 },
 
 Props : [
          {Type: 'Prop01',
          X: 9 * 480 + 40,
          Y: 5 * 260 + 100
          },
          {Type: 'Prop01',
          X: 9 * 480 + 185,
          Y: 5 * 260 + 205
          },
          {Type: 'Prop01',
          X: 9 * 480 + 300,
          Y: 5 * 260 + 200
          },
          {Type: 'Prop01',
          X: 9 * 480 + 420,
          Y: 5 * 260 + 60
          }
          ],
 
 Blocks : [
 ],
 
 InGameTip  : 'Hold positions! \n Here comes more. \n Build more amo!',
 InGameTipX : 9 * 480 + 200,
 InGameTipY : 5  * 260 + 55,
 
 SameAmmoAsPrevious : true,
 SameSnowStockAsPrevious : true
 }
 ,
 {
 LevelNumber          : 27,
 LevelComments        : 'Joke level.  Sheep only.  Just one.  No protection (third round).',
 LevelTotalZombies    : 1,
 StartSpawnTimeInSecs : 3,
 ZombieMaxSpawnTime   : 0.3,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [9 * 480 +  10,5 * 260 + 10],
                      [9 * 480 +  10,5 * 260 + 200],
                      [9 * 480 +  470,5 * 260 + 10],
                      [9 * 480 +  470,5 * 260 + 200]
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 9 * 480 +  300,
 AmmoY : 5 * 260 + 160,
 
 ShootingSpotX : 9 * 480 + 230,
 ShootingSpotY : 5 * 260 + 100,
 
 LevelCameraX : 9 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 9 * 480,
 X2: 9 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 9 * 480 + 180,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 100,
 Type  : 'Player'
 },
 2:  {
 X     : 9 * 480 + 290,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 150,
 Type  : 'Player2'
 },
 3:  {
 X     : 9 * 480 + 320,
 Y     : 5 * 260 +  20,
 BaseX : 9 * 480 + 200,
 BaseY : 5 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 900,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 10,
 Weapon03: 5
 },
 
 Props : [
          {Type: 'Prop01',
          X: 9 * 480 + 40,
          Y: 5 * 260 + 100
          },
          {Type: 'Prop01',
          X: 9 * 480 + 185,
          Y: 5 * 260 + 205
          },
          {Type: 'Prop01',
          X: 9 * 480 + 300,
          Y: 5 * 260 + 200
          },
          {Type: 'Prop01',
          X: 9 * 480 + 420,
          Y: 5 * 260 + 60
          }
          ],
 
 Blocks : [
 ],
 
 InGameTip  : 'Stray one!',
 InGameTipX : 9 * 480 + 200,
 InGameTipY : 5  * 260 + 55,
 
 SameAmmoAsPrevious : true,
 SameSnowStockAsPrevious : true
 }
 ,
 {
 LevelNumber          : 28,
 LevelComments        : 'Dinousaur.',
 LevelTotalZombies    : 1,
 StartSpawnTimeInSecs : 3,
 ZombieMaxSpawnTime   : 0.3,
 ZombieSpawnList : [
                    ['Boss2',-1]
                    ],

 ZombieSpawnSpots  : [
                      [8 * 480 +  10,5 * 260 + 10]
                      //,
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 8 * 480 +  420,
 AmmoY : 5 * 260 + 120,
 
 ShootingSpotX : 8 * 480 + 400,
 ShootingSpotY : 5 * 260 + 20,
 
 LevelCameraX : 8 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 8 * 480,
 X2: 8 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 8 * 480 + 220,
 Y     : 5 * 260 +  20,
 BaseX : 8 * 480 + 360,
 BaseY : 5 * 260 + 90,
 Type  : 'Player'
 },
 2:  {
 X     : 8 * 480 + 290,
 Y     : 5 * 260 +  20,
 BaseX : 8 * 480 + 360,
 BaseY : 5 * 260 + 120,
 Type  : 'Player2'
 },
 3:  {
 X     : 8 * 480 + 320,
 Y     : 5 * 260 +  20,
 BaseX : 8 * 480 + 380,
 BaseY : 5 * 260 + 150,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 100,
 
 Ammo :
 {
 Weapon01: 0,
 Weapon02: 0,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop01',
          X: 8 * 480 + 90,
          Y: 5 * 260 + 230
          },
          {Type: 'Prop01',
          X: 8 * 480 + 150,
          Y: 5 * 260 + 220
          },
          {Type: 'Prop01',
          X: 8 * 480 + 210,
          Y: 5 * 260 + 220
          },
          {Type: 'Prop01',
          X: 8 * 480 + 270,
          Y: 5 * 260 + 230
          }
          ],
 
 Blocks : [
           {Type: 'IceBlock',X: 8 * 480 +  50,Y: 5 * 260 + 30},
           {Type: 'IceBlock',X: 8 * 480 +  100,Y: 5 * 260 + 150},
           {Type: 'IceBlock',X: 8 * 480 +  200,Y: 5 * 260 + 100},
           {Type: 'Block',X: 8 * 480 +  90,Y: 5 * 260 + 80},
           {Type: 'Block',X: 8 * 480 +  130,Y: 5 * 260 + 160},
           {Type: 'Block',X: 8 * 480 +  240,Y: 5 * 260 + 200}
           ],
 
 InGameTip  : 'Deep, slow-motioned footsteps?',
 InGameTipX : 8 * 480 + 200,
 InGameTipY : 5  * 260 + 150
 
 }
 ,
 {
 LevelNumber          : 29,
 LevelComments        : 'Material between Players and Zombies.',
 LevelTotalZombies    : 12,
 StartSpawnTimeInSecs : 14,
 ZombieMaxSpawnTime   : 0.8,
 ZombieSpawnList : [
                    ['SnowZombie4',6],
                    ['SnowZombie5',-1]
                    ],

 ZombieSpawnSpots  : [
                      [8 * 480 +  250,4 * 260 + 70]
                      //,
                      ],
 
 MaterialPositionX : 8 * 480 +  360,
 MaterialPositionY : 4 * 260 + 100,
 
 AmmoX : 8 * 480 +  80,
 AmmoY : 4 * 260 + 140,
 
 ShootingSpotX : 8 * 480 + 10,
 ShootingSpotY : 4 * 260 + 80,
 
 LevelCameraX : 8 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 8 * 480,
 X2: 8 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 8 * 480 + 220,
 Y     : 4 * 260 +  20,
 BaseX : 8 * 480 + 30,
 BaseY : 4 * 260 + 190,
 Type  : 'Player'
 },
 2:  {
 X     : 8 * 480 + 280,
 Y     : 4 * 260 +  20,
 BaseX : 8 * 480 + 60,
 BaseY : 4 * 260 + 190,
 Type  : 'Player2'
 },
 3:  {
 X     : 8 * 480 + 320,
 Y     : 4 * 260 +  20,
 BaseX : 8 * 480 + 90,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 20,
 
 Ammo :
 {
 Weapon01: 3,
 Weapon02: 0,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop02',
          X: 8 * 480 + 90,
          Y: 4 * 260 + 230
          },
          {Type: 'Prop02',
          X: 8 * 480 + 150,
          Y: 4 * 260 + 30
          },
          {Type: 'Prop02',
          X: 8 * 480 + 210,
          Y: 4 * 260 + 220
          },
          {Type: 'Prop02',
          X: 8 * 480 + 270,
          Y: 4 * 260 + 30
          }
          ],
 
 Blocks : [
 ]
 }
 ,
 {
 LevelNumber          : 30,
 LevelComments        : 'Material between Players and Zombies + intermittent block walls.',
 LevelTotalZombies    : 15,
 StartSpawnTimeInSecs : 15,
 ZombieMaxSpawnTime   : 0.5,
 ZombieSpawnList : [
                    ['SnowZombie3',5],
                    ['SnowZombie5',10],
                    ['Snowman',-1]
                    ],

 ZombieSpawnSpots  : [
                      [7 * 480 +  250,4 * 260 + 70]
                      //,
                      ],
 
 MaterialPositionX : 7 * 480 +  340,
 MaterialPositionY : 4 * 260 + 100,
 
 AmmoX : 7 * 480 +  80,
 AmmoY : 4 * 260 + 140,
 
 ShootingSpotX : 7 * 480 + 10,
 ShootingSpotY : 4 * 260 + 80,
 
 LevelCameraX : 7 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 7 * 480,
 X2: 7 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 7 * 480 + 40,
 Y     : 4 * 260 +  20,
 BaseX : 7 * 480 + 30,
 BaseY : 4 * 260 + 190,
 Type  : 'Player'
 },
 2:  {
 X     : 7 * 480 + 80,
 Y     : 4 * 260 +  20,
 BaseX : 7 * 480 + 60,
 BaseY : 4 * 260 + 190,
 Type  : 'Player2'
 },
 3:  {
 X     : 7 * 480 + 120,
 Y     : 4 * 260 +  20,
 BaseX : 7 * 480 + 90,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 20,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 3,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop02',
          X: 7 * 480 + 90,
          Y: 4 * 260 + 230
          },
          {Type: 'Prop01',
          X: 7 * 480 + 150,
          Y: 4 * 260 + 30
          },
          {Type: 'Prop02',
          X: 7 * 480 + 210,
          Y: 4 * 260 + 220
          },
          {Type: 'Prop01',
          X: 7 * 480 + 270,
          Y: 4 * 260 + 30
          }
          ],
 
 Blocks : [
           {Type: 'IceBlockx4v',X: 7 * 480 +  150,Y: 4 * 260 + 60},
           {Type: 'IceBlockx4v',X: 7 * 480 +  150,Y: 4 * 260 + 150},
           {Type: 'IceBlockx4v',X: 7 * 480 +  300,Y: 4 * 260 + 60},
           {Type: 'IceBlockx4v',X: 7 * 480 +  300,Y: 4 * 260 + 150}
           ],
 
 IntermittentBlocks : true
 }
 ,
 {
 LevelNumber          : 31,
 LevelComments        : 'Material between Players and Sheep + intermittent block walls.',
 LevelTotalZombies    : 18,
 StartSpawnTimeInSecs : 15,
 ZombieMaxSpawnTime   : 0.5,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [6 * 480 +  250,4 * 260 + 70]
                      //,
                      ],
 
 MaterialPositionX : 6 * 480 +  340,
 MaterialPositionY : 4 * 260 + 100,
 
 AmmoX : 6 * 480 +  80,
 AmmoY : 4 * 260 + 140,
 
 ShootingSpotX : 6 * 480 + 10,
 ShootingSpotY : 4 * 260 + 80,
 
 LevelCameraX : 6 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 6 * 480,
 X2: 6 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 6 * 480 + 40,
 Y     : 4 * 260 +  20,
 BaseX : 6 * 480 + 30,
 BaseY : 4 * 260 + 190,
 Type  : 'Player'
 },
 2:  {
 X     : 6 * 480 + 80,
 Y     : 4 * 260 +  20,
 BaseX : 6 * 480 + 60,
 BaseY : 4 * 260 + 190,
 Type  : 'Player2'
 },
 3:  {
 X     : 6 * 480 + 120,
 Y     : 4 * 260 +  20,
 BaseX : 6 * 480 + 90,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 20,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 3,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop01',
          X: 6 * 480 + 90,
          Y: 4 * 260 + 190
          },
          {Type: 'Prop01',
          X: 6 * 480 + 150,
          Y: 4 * 260 + 30
          },
          {Type: 'Prop01',
          X: 6 * 480 + 210,
          Y: 4 * 260 + 180
          },
          {Type: 'Prop01',
          X: 6 * 480 + 270,
          Y: 4 * 260 + 90
          }
          ],
 
 Blocks : [
           {Type: 'IceBlockx4v',X: 6 * 480 +  150,Y: 4 * 260 + 60},
           {Type: 'IceBlockx4v',X: 6 * 480 +  150,Y: 4 * 260 + 150},
           {Type: 'Blockx4v',X: 6 * 480 +  300,Y: 4 * 260 + 60},
           {Type: 'Blockx4v',X: 6 * 480 +  300,Y: 4 * 260 + 150}
           ],
 
 IntermittentBlocks : true
 }
 ,
 {
 LevelNumber          : 32,
 LevelComments        : 'Material between Players and tons of Sheep + intermittent block walls.',
 LevelTotalZombies    : 16,
 StartSpawnTimeInSecs : 18,
 ZombieMaxSpawnTime   : 0.25,
 ZombieSpawnList : [
                    ['Sheep',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [5 * 480 +  250,4 * 260 + 70]
                      //,
                      ],
 
 MaterialPositionX : 5 * 480 +  340,
 MaterialPositionY : 4 * 260 + 100,
 
 AmmoX : 5 * 480 +  80,
 AmmoY : 4 * 260 + 140,
 
 ShootingSpotX : 5 * 480 + 10,
 ShootingSpotY : 4 * 260 + 80,
 
 LevelCameraX : 5 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 5 * 480,
 X2: 5 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 5 * 480 + 40,
 Y     : 4 * 260 +  20,
 BaseX : 5 * 480 + 30,
 BaseY : 4 * 260 + 190,
 Type  : 'Player'
 },
 2:  {
 X     : 5 * 480 + 80,
 Y     : 4 * 260 +  20,
 BaseX : 5 * 480 + 60,
 BaseY : 4 * 260 + 190,
 Type  : 'Player2'
 },
 3:  {
 X     : 5 * 480 + 120,
 Y     : 4 * 260 +  20,
 BaseX : 5 * 480 + 90,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 20,
 
 Ammo :
 {
 Weapon01: 5,
 Weapon02: 3,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop01',
          X: 5 * 480 + 90,
          Y: 4 * 260 + 190
          },
          {Type: 'Prop02',
          X: 5 * 480 + 150,
          Y: 4 * 260 + 30
          },
          {Type: 'Prop01',
          X: 5 * 480 + 210,
          Y: 4 * 260 + 120
          },
          {Type: 'Prop01',
          X: 5 * 480 + 270,
          Y: 4 * 260 + 90
          }
          ],
 
 Blocks : [
           {Type: 'Blockx4v',X: 5 * 480 +  150,Y: 4 * 260 + 60},
           {Type: 'Blockx4v',X: 5 * 480 +  150,Y: 4 * 260 + 150},
           {Type: 'Blockx4v',X: 5 * 480 +  300,Y: 4 * 260 + 60},
           {Type: 'Blockx4v',X: 5 * 480 +  300,Y: 4 * 260 + 150}
           ],
 
 IntermittentBlocks : true
 }
 ,
 {
 LevelNumber          : 33,
 LevelComments        : 'Three Dinosaurs, plus exact ammo to kill them.',
 LevelTotalZombies    : 3,
 StartSpawnTimeInSecs : 23,
 ZombieMaxSpawnTime   : 0.25,
 ZombieSpawnList : [
                    ['Dinosaur',2],
                    ['Boss3',-1]
                    ],
 
 ZombieSpawnSpots  : [
                      [4 * 480 +  250,4 * 260 + 30],
                      [4 * 480 +  250,4 * 260 + 170]
                      //,
                      ],
 
 MaterialPositionX : 0,
 MaterialPositionY : 0,
 
 AmmoX : 0,
 AmmoY : 0,
 
 ShootingSpotX : 4 * 480 + 10,
 ShootingSpotY : 4 * 260 + 80,
 
 LevelCameraX : 4 * 480 + 240,
 LevelCameraY : 4 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 4 * 480,
 X2: 4 * 480 + 480,
 Y1: 4 * 260  + 25,
 Y2: 4 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 4 * 480 + 40,
 Y     : 4 * 260 +  20,
 BaseX : 4 * 480 + 30,
 BaseY : 4 * 260 + 190,
 Type  : 'Player'
 },
 2:  {
 X     : 4 * 480 + 80,
 Y     : 4 * 260 +  20,
 BaseX : 4 * 480 + 60,
 BaseY : 4 * 260 + 190,
 Type  : 'Player2'
 },
 3:  {
 X     : 4 * 480 + 120,
 Y     : 4 * 260 +  20,
 BaseX : 4 * 480 + 90,
 BaseY : 4 * 260 + 190,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 0,
 
 Ammo :
 {
 Weapon01: 0,
 Weapon02: 32,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop02',
          X: 4 * 480 + 90,
          Y: 4 * 260 + 190
          },
          {Type: 'Prop02',
          X: 4 * 480 + 150,
          Y: 4 * 260 + 30
          },
          {Type: 'Prop02',
          X: 4 * 480 + 210,
          Y: 4 * 260 + 120
          },
          {Type: 'Prop01',
          X: 4 * 480 + 270,
          Y: 4 * 260 + 90
          }
          ],
 
 Blocks : [
 ],
 
 InGameTip  : 'Many deep, slow-motioned footsteps...',
 InGameTipX : 4 * 480 + 100,
 InGameTipY : 4  * 260 + 150
 }
 ,
 {
 LevelNumber          : 34, // Final level!
 LevelComments        : 'One dinosaur, lots of zombies (all types), and stations are far apart.',
 LevelTotalZombies    : 40,
 StartSpawnTimeInSecs : 17,
 ZombieMaxSpawnTime   : 0.20,
 ZombieSpawnList : [
                    ['NormalZombie',6],
                    ['SnowZombie3',7],
                    ['SnowZombie5',14],
                    ['Zombiess',15],
                    ['SnowZombie1',20],
                    ['Sheep',27],
                    ['SnowZombie4',31],
                    ['Boss4',32],
                    ['Sheep',39],
                    ['Dinosaur',-1],
                    ],
 
 ZombieSpawnSpots  : [
                      [4 * 480 +  10,5 * 260 + 30],
                      [4 * 480 +  10,5 * 260 + 70],
                      [4 * 480 +  10,5 * 260 + 120],
                      [4 * 480 +  10,5 * 260 + 160],
                      [4 * 480 +  10,5 * 260 + 220]
                      //,
                      ],
 
 MaterialPositionX : 4 * 480 + 150,
 MaterialPositionY : 5 * 260 + 30,
 
 AmmoX : 4 * 480 + 350,
 AmmoY : 5 * 260 + 160,
 
 ShootingSpotX : 4 * 480 + 350,
 ShootingSpotY : 5 * 260 + 60,
 
 LevelCameraX : 4 * 480 + 240,
 LevelCameraY : 5 * 260 + 120,
 
 LabyrinthConstraints : { // Related to camera/level screen position.
 X1: 4 * 480,
 X2: 4 * 480 + 480,
 Y1: 5 * 260  + 25,
 Y2: 5 * 260  + 260
 },
 PlayersList : 
 {
 1:  {
 X     : 4 * 480 + 255,
 Y     : 5 * 260 +  20,
 BaseX : 4 * 480 + 420,
 BaseY : 5 * 260 + 90,
 Type  : 'Player'
 },
 2:  {
 X     : 4 * 480 + 280,
 Y     : 5 * 260 +  20,
 BaseX : 4 * 480 + 420,
 BaseY : 5 * 260 + 120,
 Type  : 'Player2'
 },
 3:  {
 X     : 4 * 480 + 260,
 Y     : 5 * 260 +  20,
 BaseX : 4 * 480 + 420,
 BaseY : 5 * 260 + 170,
 Type  : 'Player3'
 }
 },
 
 SnowStock : 0,
 
 Ammo :
 {
 Weapon01: 0,
 Weapon02: 0,
 Weapon03: 0
 },
 
 Props : [
          {Type: 'Prop01',
          X: 4 * 480 + 150,
          Y: 5 * 260 + 130
          }
          ],
 
 Blocks : [
           {Type: 'Blockx4h',X: 4 * 480 +  150,Y: 5 * 260 + 100}
           ],
 
 InGameTip  : 'You should stock up for this one.',
 InGameTipX : 4 * 480 + 100,
 InGameTipY : 5 * 260 + 150
 }
 //,
];
