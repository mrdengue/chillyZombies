// SpriteEngine - (C) 2008 - 2010 Rafael Pacheco
// This is non-published work.  You may NOT make profit or redistribute this file
// without the author's explicit consent.
// 

//  Globals.

// Constants:
var gc_InitialFramesPerSecond            = 30; // 1 <= gc_InitialFramesPerSecond <= 100
var gc_MobileInitialFramesPerSecond_Slow = 50; // 1 <= gc_MobileInitialFramesPerSecond <= 100
var gc_MobileInitialFramesPerSecond      = 75; // 1 <= gc_MobileInitialFramesPerSecond <= 100
var gc_MobileInitialFramesPerSecond_Fast = 100; // 1 <= gc_MobileInitialFramesPerSecond <= 100

var gc_GroundFriction   = 20;   // 0 <= gc_GroundFriction <= 100
var gc_TargetThreshold  = 0.5;  // >=0
var gc_WallBounceLoss   = 0.5;  // <=1
var gc_ObjectBounceLoss = 0.9;  // <=1
var gc_WalkFactor       = 6;
var gc_IdleFactor       = 0.05;
var gc_MaxRot           = 1000; // In milliseconds.
var gc_TargetSeekSleepTimeInFrames = Math.round(gc_InitialFramesPerSecond * 0.01);
var gc_TargetPathDefLoopThreshold  = 20;
var gc_TargetPathDefFSThreshold    = 8; // Separation between one node and the other in a free-style target path.
var gc_SmartTargetRecalcTriggerThreshold = 85; // Distance (in world pixels) a smart target sprite must move before its pursuer
                                                // requires to recalculate its smart path.
                                                // It must be a relatively high number, depending on 
                                                // the size of the sprites involved and the size of the world
                                                // (about 5 or 10 times the average size of the seeker and the pursuer),
                                                // because if the target is constantly moving, the seeker will constantly 
                                                // stop to recalculate, which degrades the quality of the operation.

var gc_UseInfoScreen_Edit = true;
var gc_UseInfoScreen_Play = true;

var gc_ActiveSpriteThresholdX = 600; // Size in pixels of the area surrounding the movie screen position (taken into account from the center of it)
                                    // in which the Sprite is considered active (for interactions, physics, etc).
                                    // Beyond that point, it's as if the Sprite is dead.
var gc_ActiveSpriteThresholdY = 600;

var g_AnimationMode = false;

var g_BackgroundLoaded = true;

var g_FramesPerSecond;
var g_Timer_TimeOut; // Main animation timer object parameter.  Set by InitSpriteEngine(), which in turn calls SetAnimationFPS().
var g_NFramesOffCameraBeforeDestroying; // Number of frames before a Sprite image is destroyed after 
                                        // falling off-camera.  That way, if a camera movement is too dynamic
                                        // (i.e., "wavy"), the image of a Sprite placed right in the border of 
                                        // the won't be created/destroyed that often.

var g_SoundAvailable = false;

// Dependant of constants.
var g_Initial_GroundFriction = gc_GroundFriction * 0.01;
var g_GroundFriction   = g_Initial_GroundFriction;
var g_TargetThreshold  = gc_TargetThreshold;
var g_WallBounceLoss   = gc_WallBounceLoss;
var g_ObjectBounceLoss = gc_ObjectBounceLoss;
var g_WalkFactor       = gc_WalkFactor;
var g_IdleFactor       = gc_IdleFactor;

// Browser detection (ugh!).  It's just for very few workarounds with Opera and Safari.
var g_isSafari = false;
if (document.defaultView)
{
  g_isSafari = (!window.getComputedStyle && !document.currentStyle && document.defaultView.getComputedStyle);
}

var g_isMobileSafari = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));

var g_ObjectsToLoadAtStart = 0;
var g_TotalObjectsLoaded   = 0;
var g_SoundsToLoadAtStart  = 0;
var g_TotalSoundsLoaded    = 0;
var g_AtLeastOneSoundToLoad  = false;
var g_LoadingErrorsOccurred     = false;
var g_SndLoadingErrorsOccurred  = false;

var g_TimeLine_Paused = true;

var g_SystemTime = new Date();
var g_BackgroundMusicInitTime = -1;
var g_BackgroundMusicCurrent = null;

// Objects and animations.
var g_SpriteScheduleForceDrawing     = false;

// Used in Labyrinth solvng calculations (smart gototarget tool).
var g_Labyrinth_ObjectThickness = 1.25;
var g_Labyrinth_LimitedVisionMode = 1; // When a target is out of sight:
                                       // 0: Make partial calculations.
                                       // 1: Give up (assume unsolvable labyrinth).

var g_ImageUnknown = 'anim_unknown.gif';
                    
var g_SpriteImageAnimNames = 
[
    'idle',
    'walk01',
    'walk02',
    'walk03',
    'walk04',
    'selector',
    'dead',
    'active'
    //,
];

var g_SoundLoop      = new Object();

var g_AnimTypes      = new Object();

var g_BackgroundImageName = null;
var g_BackgroundImage = null;

// Sprite selection.
var g_SelectedSprite = null;

// Sprites data.
var g_NextSpriteId;
var g_SpritePool;
var g_Sprites_ScheduleDeleteImagesList = new Array();
var g_SpritesWithTargetSprite;
var g_SpritesWithSmartTarget;

// g_SpriteIdPool is an object with Sprite Ids as keys.  Each Id will contain the index of corresponding 
// Sprite in g_SpritePool.
var g_SpriteIdPool         = new Object();

var g_TimerCounter_Object;

var g_MainWorld_Width    = 600;
var g_MainWorld_Height   = 500;

var g_FixedScreen_Width  = 480;
var g_FixedScreen_HalfWidth  = Math.round(g_FixedScreen_Width * 0.5);
var g_FixedScreen_Height = 260;
var g_FixedScreen_HalfHeight  = Math.round(g_FixedScreen_Height * 0.5);
var g_FixedScreen_Top    = 25;
var g_FixedScreen_Left   = 0;

var g_SpriteDivMovieScreenFrame;

var g_ViewPort_X;
var g_ViewPort_Y;
var g_ViewX;
var g_ViewY;

var g_ViewPort_OldX;
var g_ViewPort_OldY;

var g_TargetPathEdit_ShowNodes;  // True:  When defining a target path, nodes will be shown. False:  No nodes shown.

var g_CurrentActiveCameraSprite;
var g_CameraIndexList;

var g_ControlBar;

var g_DivTimelineBar;

var g_CurrentSpeed = 100;

var g_formfocus = false;

// Text bubbles.
var g_TextBubbleSpriteSelected = null;
var g_TextBubbleSpritePrevious = null;

// Other
var g_TriggerSaving           = false;
var g_TimeLine_TriggerPause   = false;
var g_TimeLine_TriggerPlay = false;

// Functions.
// Let's keep this function always on top of the others.
function InitGlobals()
{
  g_SpritePool         = new Array();
  
  InitializeSpriteLists();
  
  g_NextSpriteId       = 1;
  g_TimeLine_Paused   = true;
  g_TimeLine_TriggerPause   = false;
  g_TimeLine_TriggerPlay = false;
  
  g_TimerCounter_Object = null;

  g_TargetPathEdit_ShowNodes = true;
  
  g_ViewPort_X = 0;
  g_ViewPort_Y = 0;
  g_ViewPort_OldX = 0;
  g_ViewPort_OldY = 0;
  
  g_CurrentActiveCameraSprite = null;
  
}

function SetInitialHTMLDivDimensions()
{
  g_MovieScreenFrame    = getDimensions(g_SpriteDivMovieScreenFrame);
}

function ResetSpeed()
{
  DestroySpritePool(true);
  
  InitGlobals();

  // Dirty trick to avoid initial camera flicking at the very beginning of a rendering phase.
  SetViewPort(-g_FixedScreen_Width,g_FixedScreen_Width);
  
  if (g_SoundAvailable)
  {
    StopAllSounds();
  }
}

function InitializeSpriteLists()
{
  g_CameraIndexList       = new Array();
  g_SpritesWithTargetSprite = new Object();
  g_SpritesWithSmartTarget = new Object();
}

function LoadAnimImages()
{
  for (var Name in Game_Sprite_TypeProperties)
  {
    g_AnimTypes[Name] = Game_Sprite_TypeProperties[Name].ImageList;
    
    var ImageDirectory = '';
    
    var ImageListNames = new Array();
    
    for (var i in g_SpriteImageAnimNames)
    {
      var ImageName = g_SpriteImageAnimNames[i];
      
      g_AnimTypes[Name][ImageName] = new Object();
      g_AnimTypes[Name][ImageName].Image = new Image();
      if (g_AnimTypes[Name]['img_' + ImageName])
      {
        g_AnimTypes[Name][ImageName].Image.onload = function() { return HandleLoading(false,false); };
   		  g_AnimTypes[Name][ImageName].Image.onerror = function() { return HandleLoading(false,true); };
        ImageListNames.push({Image:g_AnimTypes[Name][ImageName].Image,src:ImageDirectory + g_AnimTypes[Name]['img_' + ImageName]});
        g_ObjectsToLoadAtStart++;
      }
      else
      {
        g_AnimTypes[Name][ImageName].Image.src = g_ImageUnknown;
      }
    }
    
    // This loop must be separate from the rest, due to asynchronous nature of the code.
    for (var ThisImage in ImageListNames)
    {
      ImageListNames[ThisImage].Image.src = ImageListNames[ThisImage].src;
    }
  }
  
  if (g_BackgroundImageName)
  {
    g_BackgroundImage = new Image();
    g_BackgroundImage.onload = function() { return HandleLoading(false,false); };
   	g_BackgroundImage.onerror = function() { return HandleLoading(false,true); };
    g_ObjectsToLoadAtStart++;
    g_BackgroundImage.src = g_BackgroundImageName;
  }
}

// If DeleteImages is true, the associated images will be removed from the HTML body
// immediately.  Otherwise, they will be deferred to be removed just before rendering the Sprites.
function DestroySpritePool(DeleteImages)
{
  for (var i in g_SpritePool)
  {
    DestroyPoolSprite(i,false,DeleteImages);
  }
  
  InitializeSpriteLists();
}

// Drag-n-drop functions.
function DragDrop_GetPosition(target,IncludeOffset)
{
  var left = 0;
  var top  = 0;

  if (IncludeOffset)
  {
    while (target.offsetParent)
    {
      left  += target.offsetLeft;
      top   += target.offsetTop;
      target = target.offsetParent;
    }
  }
  
  left += target.offsetLeft;
  top  += target.offsetTop;

  return {x:left,y:top};
}

function DragDrop_MouseCoordinates(e)
{
  var Coordinates;
  
  e = e || window.event;

  if (e)
  {
    if(e.pageX || e.pageY)
    {
      Coordinates = {x:e.pageX,y:e.pageY};
    }
    else
    {
      Coordinates = {x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
                     y:e.clientY + document.body.scrollTop  - document.body.clientTop};
    }
  }
  
  return Coordinates;
}

function DragDrop_MakeSelectable(object,targetobject,SpriteObjectAssociated,GroupDefListIndex,ButtonSize)
{
  if (object)
  {
    object.onmousedown = function(e)
    {
      var PreviouslySelected = g_SelectedSprite;
      
      SelectSprite(SpriteObjectAssociated,true);
      Game_SpriteSelected(g_SelectedSprite,PreviouslySelected);
      
      g_SpriteScheduleForceDrawing = true;

      return false;
    }
  }
}

function SpriteDivMain_MouseDown(e)
{
  var ShowHelp = false;

  e = e || window.event;
 
  var PreviouslySelectedSprite = g_SelectedSprite;
  SelectSprite(null,false);
  var MousePosition = DragDrop_MouseCoordinates(e);
  var DropCoordinatesX = MousePosition.x - g_FixedScreen_Left - g_ViewPort_X;
  var DropCoordinatesY = MousePosition.y - g_FixedScreen_Top - g_ViewPort_Y;
  Game_GroundClicked(DropCoordinatesX,DropCoordinatesY,PreviouslySelectedSprite);
  
  return false;
}

// Sprites functions.

function PlaceSprite(X,Y,Type,Selected)
{
  var NewSprite  = CreateSpriteObject(Type,X,Y);
  var NewSpriteIndex = -1;
  
  var ProcessMarkInvalidation = false;
  
  if (NewSprite)
  {
    if (Selected)
    {
      SelectSprite(NewSprite,true);
    }

    g_SpritePool.push(NewSprite);
    NewSpriteIndex = g_SpritePool.length - 1;
    
    if (g_SpritePool[NewSpriteIndex].Camera >= 0)
    {
      // Since this is a new Sprite, we know it's not in the cameras pool.
      // Let's add it directly.
      g_CameraIndexList.push(NewSpriteIndex);
    }
    g_SpriteIdPool[NewSprite.Id]            = NewSpriteIndex;
  }
  
  return NewSprite;
}

function InitSpriteEngine()
{
  Game_PreInitEngine();
  
  document.getElementById('id_div_loading').style.visibility = 'visible'; // Firefox needs this.

  if (g_isMobileSafari)
  {
    SetAnimationFPS(gc_MobileInitialFramesPerSecond);
  }
  else
  {
    SetAnimationFPS(gc_InitialFramesPerSecond);
  }

  LoadAnimImages();
  
  if (Game_Sounds)
  {
    for (var SoundName in Game_Sounds)
    {
      // Quick way to find out if the Game_Sounds object is not empty.
      g_AtLeastOneSoundToLoad = true;
      
      if (Game_Sounds[SoundName].soundaction)
      {
        g_SoundLoop[SoundName] = false;
      }
    }
  }

  g_SpriteDivMovieScreenFrame = document.getElementById('div_moviescreenframe');
  
  if (g_BackgroundImageName)
  {
    LoadBackgroundImage(g_BackgroundImageName);
  }
  
  ResetSpeed();

  g_SpriteDivMovieScreenFrame.onmousedown = SpriteDivMain_MouseDown;
  
  if (g_isMobileSafari)
  {
    document.onclick     = function(e) {e.preventDefault(); return false;};
    document.addEventListener('touchstart', touchHandler, true);
    document.addEventListener('touchmove', touchHandler, true);
    document.addEventListener('touchend', touchHandler, true);
    document.addEventListener('touchcancel', touchHandler, true);
  }
  InitSound();
}

function SpriteHandler()
{
  var SpriteForceDrawing = g_SpriteScheduleForceDrawing;
  // Let's process one by one.
  
  CheckBackgroundMusic();
	
  // Let's initiate the first part of the bounce calculation mechanism.
  for (var j in g_SpritePool)
  {
    g_SpritePool[j].PreBounceVelX   = g_SpritePool[j].VelX;
    g_SpritePool[j].PreBounceVelY   = g_SpritePool[j].VelY;
    g_SpritePool[j].AgainstUnbounceable = false;
  }
  
  for (var i in g_SpritePool)
  {
    var ThisSprite = g_SpritePool[i];
    var Destroyed = false;
    
    if (ThisSprite)
    {
      Destroyed = ThisSprite.ScheduleDestruction;
    }
    
    if (Destroyed)
    {
      DestroyPoolSprite(i,true,false);
    }
    else if (ThisSprite)
    {
      if (ThisSprite.isActive)
      {
        var Live = true;
        
        if ((ThisSprite.Camera == 1) && ThisSprite.UpdateView)
        {
          SetViewPort(ThisSprite.X,ThisSprite.Y);
          ThisSprite.UpdateView = false;
          Game_CameraMoved();
        }
        
        if ((ThisSprite.LivingState > 0) && !g_TimeLine_Paused)
        {
          Live = false;
          
          if (ThisSprite.LivingState == 1)
          {
            ThisSprite.AccelX = 0;
            ThisSprite.AccelY = 0;
            ThisSprite.setStateImage('dead',0);

            ThisSprite.LivingState = 2;
          }
          
          ThisSprite.Rot++;
          
          if (ThisSprite.Rot >= ((gc_MaxRot * 0.001) * g_FramesPerSecond))
          {
            Game_SpriteDead(ThisSprite);
            ThisSprite.ScheduleDestruction = true;
          }
        }

        if (ThisSprite.CameraFollowsTarget && (ThisSprite.Camera != -1))
        {
          if (ThisSprite.TargetSprite)
          {
            if (ThisSprite.Target == 0)
            {
              ThisSprite.TargetSprite = null;
              if (g_SpritesWithTargetSprite[ThisSprite.Id])
              {
                delete g_SpritesWithTargetSprite[ThisSprite.Id];
              }
              ThisSprite.clearSmartTarget(true);
            }
            else
            {
              ThisSprite.X = ThisSprite.TargetSprite.X;
              ThisSprite.Y = Math.round(ThisSprite.TargetSprite.Y - parseInt(ThisSprite.TargetSprite.RealImageHeight) * 0.75);
            }
          }
        }
        else if (!g_TimeLine_Paused)
        {
          Sprite_ApplyInteractions(ThisSprite,i,g_AnimationMode || ThisSprite.Ghost);
        }
        
        // Trying to find a smart path to a target?
        if (ThisSprite.CalculatingSmartPath && !g_TimeLine_Paused)
        {
          ThisSprite.SmartTargetTimeoutCount--;
          
          if (ThisSprite.SmartTargetTimeoutCount <= 0)
          {
            // Timeout.  Give up.
            ThisSprite.clearSmartTarget(true);
            Game_SmartTargetGivenUp(ThisSprite);
          }
          else
          {
            var IterationObject = Labyrinth_Solve(ThisSprite.SmartPathIterationObject,g_Labyrinth_LimitedVisionMode);
            
            if (IterationObject.FinishedCalculating)
            {
              ThisSprite.RecalculateOnEnd = IterationObject.RecalculateOnEnd;
              ThisSprite.clearSmartTarget(false); // The parameter is false in case we need data to 
                                                 // recalculate the path after hitting an unexpected obstacle.
              
              if (IterationObject.Solution)
              {
                ThisSprite.setTargetPath(TargetPath_GenerateFromLabyrinthSolution(IterationObject.Solution,IterationObject.SeekerWidth,IterationObject.SeekerHeight),false);
              }
              else
              {
                ThisSprite.clearSmartTarget(true);
                if (!ThisSprite.RecalculateOnEnd)
                {
                  Game_SmartTargetGivenUp(ThisSprite);
                }
              }
            }
            else
            {
              ThisSprite.SmartPathIterationObject = IterationObject;
            }
          }
        }
        
        // If this Sprite has a smart sprite target, if the target moves off too much, then
        // recalculate.
        if (ThisSprite.TargetIsSmart && ThisSprite.SmartTarget)
        {
          if (ThisSprite.SmartTarget.TargetSprite)
          {
            //  Both .SmartTarget.X and .SmartTarget.Y contain the old target coordinates.
            if (
                (Math.abs(ThisSprite.SmartTarget.X  - ThisSprite.SmartTarget.TargetSprite.X) > gc_SmartTargetRecalcTriggerThreshold) ||
                (Math.abs(ThisSprite.SmartTarget.Y  - ThisSprite.SmartTarget.TargetSprite.Y) > gc_SmartTargetRecalcTriggerThreshold)
               )
            {
              // Recalculate.
              ThisSprite.setTargetSprite(ThisSprite.SmartTarget.TargetSprite,false,true);
            }
          }
        }
      
        if (Live && !g_TimeLine_Paused)
        {
          // Let's move the sprite towards its target.
          if ((ThisSprite.Target == 1) && ((ThisSprite.Camera == -1) || !ThisSprite.CameraFollowsTarget))
          {
            ThisSprite.TargetSeekSleep--;
            if (ThisSprite.TargetSeekSleep <= 0)
            {
              ThisSprite.moveToTarget();
              ThisSprite.TargetSeekSleep = gc_TargetSeekSleepTimeInFrames;
            }
          }
          else
          {
            if (ThisSprite.Target == 0)
            {
              ThisSprite.AccelX = 0;
              ThisSprite.AccelY = 0;
              ThisSprite.Target = -1;
            }
          }

          ThisSprite.animate();
        }
      }
    }
  }
  
  if (!g_TimeLine_Paused)
  {
    for (var j in g_SpritePool)
    {
      g_SpritePool[j].OldX     = g_SpritePool[j].X;
      g_SpritePool[j].OldY     = g_SpritePool[j].Y;
      
      if (g_SpritePool[j].isActive)
      {
        SpriteObjectFunct_applyPhysics(g_SpritePool[j],g_AnimationMode);
      }
    }
  }
  
  for (var i in g_SpritePool)
  {
    var ThisSprite = g_SpritePool[i];
    if (ThisSprite)
    {
      if (ThisSprite.TextBubble)
      {
        if (ThisSprite.TargetSprite)
        {
          if (ThisSprite.Target == 0)
          {
            ThisSprite.TargetSprite = null;
            if (g_SpritesWithTargetSprite[ThisSprite.Id])
            {
              delete g_SpritesWithTargetSprite[ThisSprite.Id];
            }
            ThisSprite.clearSmartTarget(true);
          }
          else
          {
            ThisSprite.X = ThisSprite.TargetSprite.X - ThisSprite.TextBubbleRealX * ThisSprite.Size;
            ThisSprite.Y = ThisSprite.TargetSprite.Y - ThisSprite.TextBubbleRealY * ThisSprite.Size;
            
            if (ThisSprite.TargetSprite.Image)
            {
              ThisSprite.X += Math.round(ThisSprite.TargetSprite.RealImageWidth  * ThisSprite.TextBubbleTargetX * 0.01);
              ThisSprite.Y += Math.round(ThisSprite.TargetSprite.RealImageHeight * ThisSprite.TextBubbleTargetY * 0.01);
            }
          }
        }
      }
    }
  }
  
  for (var i in g_Sprites_ScheduleDeleteImagesList)
  {
    SpriteObject_DeleteImages(g_Sprites_ScheduleDeleteImagesList[i]);
    delete g_Sprites_ScheduleDeleteImagesList[i];
  }
  
  for (var j in g_SpritePool)
  {
    RenderSpriteObject(g_SpritePool[j],SpriteForceDrawing);
    
    g_SpritePool[j].isActive = (((Math.abs(g_ViewX - g_SpritePool[j].X) < gc_ActiveSpriteThresholdX) && (Math.abs(g_ViewY - g_SpritePool[j].Y) < gc_ActiveSpriteThresholdY)) 
                               || (g_SpritePool[j].Camera == 1));
    
    if (!g_SpritePool[j].isActive)
    {
      // Potential Sprite de-activation event handling here.
      if (g_SpritePool[j].isSelected)
      {
        SelectSprite(g_SpritePool[j],false);
      }
    }
  }
  
  if (SpriteForceDrawing)
  {
    g_SpriteScheduleForceDrawing = false;
  }

  if (g_TimeLine_TriggerPlay || g_TimeLine_TriggerPause)
  {
    g_TimeLine_Paused = g_TimeLine_TriggerPause;
    
    g_TimeLine_TriggerPlay  = false;
    g_TimeLine_TriggerPause = false;
  }
  
  if (Game_Frame())
  {
    g_TimerCounter_Object = window.setTimeout(SpriteHandler,g_Timer_TimeOut);
  }
  else
  {
    g_TimerCounter_Object = null;
  }
}

function SpriteObjectFunct_doDie(SpriteObject)
{
  if (SpriteObject.LivingState == 0)
  {
    SpriteObject.LivingState = 1;
  }
}

function SpriteObjectFunct_doResurrect(SpriteObject)
{
  if (SpriteObject.LivingState > 0)
  {
    SpriteObject.LivingState = 0;
    SpriteObject.Rot         = 0;
    SpriteObject.setStateImage('idle',0);
  }
}

function SpriteObjectFunct_interactWith(SpriteObjectTarget,SpriteObjectOrig)
{
  var TestDiffX = SpriteObjectTarget.X-SpriteObjectOrig.X;
  var TestDiffY = SpriteObjectTarget.Y-SpriteObjectOrig.Y;
  var Bounced = false;

  // Are we bouncing against this sprite?
  if (
      !SpriteObjectOrig.Ghost
      &&
      !SpriteObjectTarget.Ghost
      &&
      (
       ((0<=TestDiffX)&&(TestDiffX < SpriteObjectOrig.RealImageWidth * 0.8))
       ||
       ((0<=-TestDiffX)&&(-TestDiffX < SpriteObjectTarget.RealImageWidth * 0.8))
      )
      &&
      (
       ((0<=TestDiffY)&&(TestDiffY < SpriteObjectOrig.RealImageHeight * 0.8))
       ||
       ((0<=-TestDiffY)&&(-TestDiffY < SpriteObjectTarget.RealImageHeight * 0.8))
      )
     )
  {
    var BounceWasTarget      = false;
    Bounced = true;
    
    if (Bounced)
    {
      // Bounce!
      // Step one:  Is the object "bounceable?"
      var BounceProceed = Game_BounceCheck(SpriteObjectOrig,SpriteObjectTarget);
      if (BounceProceed)
      {
        if (SpriteObjectOrig.Bounceable || SpriteObjectTarget.Bounceable)
        {
          var SpriteTargetCanBeBounced = (SpriteObjectTarget.Bounceable && !SpriteObjectTarget.AgainstUnbounceable);
          
          if (SpriteObjectOrig.Bounceable && SpriteObjectTarget.Bounceable)
          {
            // Yes.  Transfer energy.
            var BounceVelX = Math.abs(SpriteObjectTarget.PreBounceVelX) + Math.abs(SpriteObjectOrig.PreBounceVelX);
            var BounceVelY = Math.abs(SpriteObjectTarget.PreBounceVelY) + Math.abs(SpriteObjectOrig.PreBounceVelY);
                          
            var TotalWeight = SpriteObjectTarget.Weight + SpriteObjectOrig.Weight;
                          
            var SpriteObjectOrigGain;
            if (!SpriteTargetCanBeBounced)
            {
              SpriteObjectOrigGain = 0;
            }
            else if (TotalWeight>0)
            {
              SpriteObjectOrigGain = SpriteObjectTarget.Weight / TotalWeight;
              SpriteObjectOrigGain *= g_ObjectBounceLoss;
            }
            else
            {
              SpriteObjectOrigGain = 0.5;
            }
                          
            var SpriteObjectTargetGain;
            if (!SpriteTargetCanBeBounced)
            {
              SpriteObjectTargetGain = 0;
            }
            else if (TotalWeight>0)
            {
              SpriteObjectTargetGain = 1 - SpriteObjectOrigGain;
              SpriteObjectTargetGain *= g_ObjectBounceLoss;
            }
            else
            {
              SpriteObjectTargetGain = 0.5;
            }
                          
            if ((SpriteObjectTarget.X + (SpriteObjectTarget.RealImageWidth * 0.5)) < (SpriteObjectOrig.X + (SpriteObjectOrig.RealImageWidth * 0.5)))
            {
              SpriteObjectTarget.VelX -= BounceVelX * SpriteObjectTargetGain;
              SpriteObjectOrig.VelX += BounceVelX * SpriteObjectOrigGain;
            }
            else
            {
              SpriteObjectTarget.VelX += BounceVelX * SpriteObjectTargetGain;
              SpriteObjectOrig.VelX -= BounceVelX * SpriteObjectOrigGain;
            }
                          
            if ((SpriteObjectOrig.X + (SpriteObjectOrig.RealImageWidth * 0.5)) < (SpriteObjectTarget.X + (SpriteObjectTarget.RealImageWidth * 0.5)))
            {
              SpriteObjectTarget.VelY -= BounceVelY * SpriteObjectTargetGain;
              SpriteObjectOrig.VelY += BounceVelY * SpriteObjectOrigGain;
            }
            else
            {
              SpriteObjectTarget.VelY += BounceVelY * SpriteObjectTargetGain;
              SpriteObjectOrig.VelY -= BounceVelY * SpriteObjectOrigGain;
            }
            
            Game_BounceForce(SpriteObjectOrig,SpriteObjectTarget,BounceVelX+BounceVelY);
          }
          else if (!SpriteObjectTarget.Bounceable)
          {
            // No.  No trespassing.
            
            SpriteObjectOrig.AgainstUnbounceable = true;
            
            var TestOldDiffX = SpriteObjectTarget.X-SpriteObjectOrig.OldX;
            var TestOldDiffY = SpriteObjectTarget.Y-SpriteObjectOrig.OldY;
            if (
                (
                 ((0<=TestOldDiffX)&&(TestOldDiffX < parseInt(SpriteObjectOrig.RealImageWidth)))
                 ||
                 ((0<=-TestOldDiffX)&&(-TestOldDiffX < parseInt(SpriteObjectTarget.RealImageWidth)))
                )
               )
            {
              SpriteObjectOrig.VelY = Math.abs(SpriteObjectOrig.PreBounceVelY);
              if ((SpriteObjectOrig.Y + (SpriteObjectOrig.RealImageHeight * 0.5)) < (SpriteObjectTarget.Y + (SpriteObjectTarget.RealImageHeight * 0.5)))
              {
                SpriteObjectOrig.VelY = -SpriteObjectOrig.VelY;
              }
            }
            
            if (
                (
                 ((0<=TestOldDiffY)&&(TestOldDiffY < parseInt(SpriteObjectOrig.RealImageHeight)))
                 ||
                 ((0<=-TestOldDiffY)&&(-TestOldDiffY < parseInt(SpriteObjectTarget.RealImageHeight)))
                 )
                )
            {
              SpriteObjectOrig.VelX = Math.abs(SpriteObjectOrig.PreBounceVelX);
              if ((SpriteObjectOrig.X + (SpriteObjectOrig.RealImageWidth * 0.5)) < (SpriteObjectTarget.X + (SpriteObjectTarget.RealImageWidth * 0.5)))
              {
                SpriteObjectOrig.VelX = -SpriteObjectOrig.VelX;
              }
            }
            
          }
          else
          {
            // SpriteObjectOrig not bounceable.  No trespassing for target.
            
            SpriteObjectOrig.AgainstUnbounceable = true;
            
            var TestOldDiffX = SpriteObjectOrig.X-SpriteObjectTarget.OldX;
            var TestOldDiffY = SpriteObjectOrig.Y-SpriteObjectTarget.OldY;
            if (
                (
                 ((0<=TestOldDiffX)&&(TestOldDiffX < parseInt(SpriteObjectTarget.RealImageWidth)))
                 ||
                 ((0<=-TestOldDiffX)&&(-TestOldDiffX < parseInt(SpriteObjectOrig.RealImageWidth)))
                )
               )
            {
              SpriteObjectTarget.VelY = Math.abs(SpriteObjectTarget.PreBounceVelY);
              if ((SpriteObjectTarget.Y + (SpriteObjectTarget.RealImageHeight * 0.5)) < (SpriteObjectOrig.Y + (SpriteObjectOrig.RealImageHeight * 0.5)))
              {
                SpriteObjectTarget.VelY = -SpriteObjectTarget.PreBounceVelY;
              }
            }
            
            if (
                (
                 ((0<=TestOldDiffY)&&(TestOldDiffY < parseInt(SpriteObjectTarget.RealImageHeight)))
                 ||
                 ((0<=-TestOldDiffY)&&(-TestOldDiffY < parseInt(SpriteObjectOrig.RealImageHeight)))
                 )
                )
            {
              SpriteObjectTarget.VelX = Math.abs(SpriteObjectTarget.PreBounceVelX);
              if ((SpriteObjectTarget.X + (SpriteObjectTarget.RealImageWidth * 0.5)) < (SpriteObjectOrig.X + (SpriteObjectOrig.RealImageWidth * 0.5)))
              {
                SpriteObjectTarget.VelX = -SpriteObjectTarget.VelX;
              }
            }
          }
        }
      }
      
      // Also, if this was a target, the sprite must move on.
      var TargetSprite = SpriteObjectOrig.TargetSprite;
      
      if (!TargetSprite && SpriteObjectOrig.TargetIsSmart && SpriteObjectOrig.SmartTarget)
      {
        var TargetSprite = SpriteObjectOrig.SmartTarget.TargetSprite;
      }
      
      if (TargetSprite)
      {
        if (TargetSprite.Id == SpriteObjectTarget.Id)
        {
          BounceWasTarget = true;
          if (!SpriteObjectOrig.nextInTargetPath())
          {
            SpriteObjectOrig.Target      = 0;
            SpriteObjectOrig.setTargetSprite(null,false,false);
            Game_TargetAchieved(SpriteObjectOrig);
          }
        }
      }
      else
      {
        TargetSprite = SpriteObjectTarget.TargetSprite;
        
        if (!TargetSprite && SpriteObjectTarget.TargetIsSmart && SpriteObjectTarget.SmartTarget)
        {
          var TargetSprite = SpriteObjectTarget.SmartTarget.TargetSprite;
        }
        
        if (TargetSprite)
        {
          if (TargetSprite.Id == SpriteObjectOrig.Id)
          {
            if (!SpriteObjectTarget.nextInTargetPath())
            {
              SpriteObjectTarget.Target      = 0;
              SpriteObjectTarget.setTargetSprite(null,false,false);
              Game_TargetAchieved(SpriteObjectTarget);
            }
          }
        }
      }
      
      if (BounceProceed && !BounceWasTarget)
      {
        var Recalculate;
        
        if (SpriteObjectOrig.TargetIsSmart && !SpriteObjectOrig.CalculatingSmartPath)
        {
          SpriteObjectOrig.SameBounceCount++;
          Recalculate = false;
          if (SpriteObjectOrig.SameBounceCount >= 50)
          {
            Recalculate = true;
          }
          else if (SpriteObjectOrig.LastBouncedSprite)
          {
            if (SpriteObjectOrig.LastBouncedSprite.Id == SpriteObjectTarget.Id)
            {
              if (SpriteObjectOrig.SameBounceCount >= 20)
              {
                Recalculate = true;
              }
            }
            else
            {
              SpriteObjectOrig.SmartPCalculationAttempN = 1;
            }
          }
          else if (SpriteObjectOrig.SmartTarget)
          {
            if (SpriteObjectOrig.SmartTarget.TargetSprite)
            {
              if (SpriteObjectOrig.SmartTarget.TargetSprite.Id == SpriteObjectTarget.Id)
              {
                SpriteObjectOrig.Target      = 0;
                
                SpriteObjectOrig.setTargetSprite(null,false,false);
                
                if (g_SpritesWithSmartTarget[SpriteObjectOrig.Id])
                {
                  delete g_SpritesWithSmartTarget[SpriteObjectOrig.Id];
                }
                
                SpriteObjectOrig.SmartPCalculationAttempN = 1;
              }
            }
          }
          SpriteObjectOrig.LastBouncedSprite = SpriteObjectTarget;
          
          if (Recalculate)
          {
            SpriteObjectOrig.recalculateSmartTarget(SpriteObjectOrig.LastBouncedSprite);
          }
        }
        
        if (SpriteObjectTarget.TargetIsSmart && !SpriteObjectTarget.CalculatingSmartPath)
        {
          SpriteObjectTarget.SameBounceCount++;
          Recalculate = false;
          if (SpriteObjectTarget.SameBounceCount >= 50)
          {
            Recalculate = true;
          }
          else if (SpriteObjectTarget.LastBouncedSprite)
          {
            if (SpriteObjectTarget.LastBouncedSprite.Id == SpriteObjectOrig.Id)
            {
              if (SpriteObjectTarget.SameBounceCount >= 20)
              {
                Recalculate = true;
              }
            }
            else
            {
              SpriteObjectTarget.SmartPCalculationAttempN = 1;
            }
          }
          else if (SpriteObjectTarget.SmartTarget)
          {
            if (SpriteObjectTarget.SmartTarget.TargetSprite)
            {
              if (SpriteObjectTarget.SmartTarget.TargetSprite.Id == SpriteObjectOrig.Id)
              {
                SpriteObjectTarget.Target      = 0;
                
                SpriteObjectTarget.setTargetSprite(null,false,false);
                
                if (g_SpritesWithSmartTarget[SpriteObjectTarget.Id])
                {
                  delete g_SpritesWithSmartTarget[SpriteObjectTarget.Id];
                }
                
                SpriteObjectTarget.SmartPCalculationAttempN = 1;
              }
            }
          }
          
          SpriteObjectTarget.LastBouncedSprite = SpriteObjectOrig;
          
          if (Recalculate)
          {
            SpriteObjectTarget.recalculateSmartTarget(SpriteObjectTarget.LastBouncedSprite);
          }
        }
      }
    }
  }
}

function SpriteObjectFunct_moveToTarget(SpriteObjectToMove)
{
  // Is the target another moving object?
  var TargetSprite = SpriteObjectToMove.TargetSprite;
  
  if (!TargetSprite)
  {
    if (SpriteObjectToMove.TargetIsSmart && SpriteObjectToMove.LastSmartTargetLeg && SpriteObjectToMove.SmartTarget)
    {
      TargetSprite = SpriteObjectToMove.SmartTarget.TargetSprite;
    }
  }
  
  if (TargetSprite)
  {
    // Yes.
    SpriteObjectToMove.TargetX = Math.round(TargetSprite.X - SpriteObjectToMove.RealImageWidth * 0.5 + TargetSprite.RealImageWidth * 0.5);
    SpriteObjectToMove.TargetY = Math.round(TargetSprite.Y - SpriteObjectToMove.RealImageHeight * 0.5 + TargetSprite.RealImageHeight * 0.5);
  }
  
  var MoveTargetX;
  var MoveTargetY;
  
  if (SpriteObjectToMove.CalculatingSmartPath)
  {
    MoveTargetX = SpriteObjectToMove.PreSmartTargetX;
    MoveTargetY = SpriteObjectToMove.PreSmartTargetY;
  }
  else
  {
    MoveTargetX = SpriteObjectToMove.TargetX;
    MoveTargetY = SpriteObjectToMove.TargetY;
  }
  
  // Let's calculate the acceleration vector towards the target.
  var DiffX = MoveTargetX - SpriteObjectToMove.X;
  var DiffY = MoveTargetY - SpriteObjectToMove.Y;

  // Are we approaching the target?
  var TargetSpriteCamera = -1;
  if (TargetSprite)
  {
    TargetSpriteCamera = TargetSprite.Camera;
  }

  if ((!TargetSprite || (TargetSpriteCamera != -1) || (SpriteObjectToMove.Camera != -1)) &&
      (Math.abs(DiffX) < SpriteObjectToMove.RealImageWidth*g_TargetThreshold) && 
      (Math.abs(DiffY) < SpriteObjectToMove.RealImageHeight*g_TargetThreshold)
     )
  {
    if (!SpriteObjectToMove.nextInTargetPath())
    {
      SpriteObjectToMove.Target      = 0;
      
      SpriteObjectToMove.setTargetSprite(null,false,false);
      
      if (!SpriteObjectToMove.CalculatingSmartPath)
      {
        if (g_SpritesWithSmartTarget[SpriteObjectToMove.Id])
        {
          delete g_SpritesWithSmartTarget[SpriteObjectToMove.Id];
        }
        
        Game_TargetAchieved(SpriteObjectToMove);
      }
      
      // Because the previous setTargetSprite() resets .TargetIsSmart to false, we need to 
      // set it back to true if there's a Smart TargetPath calculation ongoing (which means that we're
      // right in the middle of a partial smart calculation).
      SpriteObjectToMove.TargetIsSmart = SpriteObjectToMove.CalculatingSmartPath;
    }
  }
  else
  {
    var NewVector = CalculateVector(DiffX,DiffY,SpriteObjectToMove.Strength);
    SpriteObjectToMove.AccelX = NewVector.x;
    SpriteObjectToMove.AccelY = NewVector.y;
  }
}

function SpriteObjectFunct_setVisible(SpriteObject,Visible)
{
  if (SpriteObject)
  {
    SpriteObject.Visible = Visible;
    var Invisible = (
                     ((!SpriteObject.Visible || SpriteObject.TextLabel || (SpriteObject.Camera != -1)))
                    );
                    
    if (SpriteObject.Image)
    {
      SpriteObject.Image.style.visibility   = (Invisible)?'hidden':'visible';
    }
  }
}

function SpriteObjectFunct_setGhost(SpriteObject,Ghost)
{
  if (SpriteObject)
  {
    if (!SpriteObject.TextBubble && (SpriteObject.Camera == -1))
    {
      SpriteObject.Ghost = Ghost;
    }
  }
}

function SpriteObjectFunct_animate(SpriteObjectToAnimate)
{
  if (SpriteObjectToAnimate.WalkSum>=0)
  {
    // Walking.
    var WalkAddend = SpriteObjectToAnimate.VelX*SpriteObjectToAnimate.VelX + SpriteObjectToAnimate.VelY*SpriteObjectToAnimate.VelY;

    if (WalkAddend <= g_WalkFactor)
    {
      SpriteObjectToAnimate.WalkSum += WalkAddend;
  
      if (SpriteObjectToAnimate.WalkSum > g_WalkFactor*2)
      {
        SpriteObjectToAnimate.WalkSum = 0;
        SpriteObjectToAnimate.AnimWalk++;
        if (SpriteObjectToAnimate.AnimWalk>1)
        {
          SpriteObjectToAnimate.AnimWalk = 0;
        }
        
        switch (SpriteObjectToAnimate.AnimWalk)
        {
          case 0:
            SpriteObjectToAnimate.setStateImage(((SpriteObjectToAnimate.VelX>=0)?'walk01':'walk02'),0);
            break;
                  
          case 1:
            SpriteObjectToAnimate.setStateImage(((SpriteObjectToAnimate.VelX>=0)?'walk04':'walk03'),0);
            break;
                  
          default:
            SpriteObjectToAnimate.setStateImage('walk01',0);
        }
      }
    }
  }
  
  if ((Math.abs(SpriteObjectToAnimate.AccelX) < g_IdleFactor) && (Math.abs(SpriteObjectToAnimate.AccelY) < g_IdleFactor) &&
      (Math.abs(SpriteObjectToAnimate.VelX) < g_IdleFactor) && (Math.abs(SpriteObjectToAnimate.VelY) < g_IdleFactor))
  {
    if (SpriteObjectToAnimate.IdleState == 1)
    {
      SpriteObjectToAnimate.IdleState = 0;
    }

    if (SpriteObjectToAnimate.IdleState == 2)
    {
      if (SpriteObjectToAnimate.Camera == 1)
      {
        SpriteObjectToAnimate.setStateImage('active',0);
      }
      SpriteObjectToAnimate.IdleState = 1;
    }
  }
  else
  {
    SpriteObjectToAnimate.IdleState = 2;
  }

}

function SpriteObjectFunct_applyPhysics(SpriteObjectToApply,AnimationMode)
{
  // Let's check world boundaries.  If it hits a wall, it must bounce.  Or if it's off limits (e.g., because
  // the user drag-dropped it, it must come towards the world).
  var Bounced = false;
  
  if (!AnimationMode)
  {
    // Left wall.
    if (SpriteObjectToApply.X < 0)
    {
      if (SpriteObjectToApply.VelX < 0)
      {
        // Bounce.
        SpriteObjectToApply.VelX = -SpriteObjectToApply.VelX*g_WallBounceLoss;
        Bounced = true;
      }
      else
      {
        // Keep moving towards the world.
        if (SpriteObjectToApply.VelX < 3)
        {
          SpriteObjectToApply.VelX = 3;
        }
      }
    }
        
    // Right wall.
    if (SpriteObjectToApply.X > g_MainWorld_Width - SpriteObjectToApply.RealImageWidth)
    {
      if (SpriteObjectToApply.VelX > 0)
      {
        // Bounce.
        SpriteObjectToApply.VelX = -SpriteObjectToApply.VelX*g_WallBounceLoss;
        Bounced = true;
      }
      else
      {
        // Keep moving towards the world.
        if (SpriteObjectToApply.VelX > -3)
        {
          SpriteObjectToApply.VelX = -3;
        }
      }
    }
        
    // Top wall.
    if (SpriteObjectToApply.Y < 0)
    {
      if (SpriteObjectToApply.VelY < 0)
      {
        // Bounce.
        SpriteObjectToApply.VelY = -SpriteObjectToApply.VelY*g_WallBounceLoss;
        Bounced = true;
      }
      else
      {
        // Keep moving towards the world.
        if (SpriteObjectToApply.VelY < 3)
        {
          SpriteObjectToApply.VelY = 3;
        }
      }
    }
        
    // Bottom wall.
    if (SpriteObjectToApply.Y > g_MainWorld_Height - parseInt(SpriteObjectToApply.RealImageHeight))
    {
      if (SpriteObjectToApply.VelY > 0)
      {
        // Bounce.
        SpriteObjectToApply.VelY = -SpriteObjectToApply.VelY*g_WallBounceLoss;
        Bounced = true;
      }
      else
      {
        // Keep moving towards the world.
        if (SpriteObjectToApply.VelY > -3)
        {
          SpriteObjectToApply.VelY = -3;
        }
      }
    }

    if (Bounced)
    {
      Game_ReachedWall(SpriteObjectToApply,Math.abs(SpriteObjectToApply.VelX)+Math.abs(SpriteObjectToApply.VelY));
    }
  }
  
  SpriteObjectToApply.X += SpriteObjectToApply.VelX;
  SpriteObjectToApply.Y += SpriteObjectToApply.VelY;
  
  var NewVelVector = CalculateVector(SpriteObjectToApply.VelX,SpriteObjectToApply.VelY,SpriteObjectToApply.VelLimit);
  SpriteObjectToApply.VelLimX = NewVelVector.x;
  SpriteObjectToApply.VelLimY = NewVelVector.y;
  
  // Let's respect speed limits.
  if (((SpriteObjectToApply.VelLimX>=0) && (SpriteObjectToApply.VelX > SpriteObjectToApply.VelLimX)) || ((SpriteObjectToApply.VelLimX<=0) && (SpriteObjectToApply.VelX < SpriteObjectToApply.VelLimX)))
  {
    SpriteObjectToApply.VelX = SpriteObjectToApply.VelLimX;
  }

  if (((SpriteObjectToApply.VelLimY>=0) && (SpriteObjectToApply.VelY > SpriteObjectToApply.VelLimY)) || ((SpriteObjectToApply.VelLimY<=0) && (SpriteObjectToApply.VelY < SpriteObjectToApply.VelLimY)))
  {
    SpriteObjectToApply.VelY = SpriteObjectToApply.VelLimY;
  }

  if (SpriteObjectToApply.VelLimit != 0)
  {
    SpriteObjectToApply.VelX    += SpriteObjectToApply.AccelX;
    SpriteObjectToApply.VelY    += SpriteObjectToApply.AccelY;
    
    // Let's apply friction.
    SpriteObjectToApply.VelX -= (SpriteObjectToApply.VelX * g_GroundFriction);
    if (Math.abs(SpriteObjectToApply.VelX)<0.01)
    {
      SpriteObjectToApply.VelX = 0;
    }
      
    SpriteObjectToApply.VelY -= (SpriteObjectToApply.VelY * g_GroundFriction);
    if (Math.abs(SpriteObjectToApply.VelY)<0.01)
    {
      SpriteObjectToApply.VelY = 0;
    }
  }
}

function Sprite_ApplyInteractions(SpriteObjectToApply,YetToInteractIndex,AnimationMode)
{
  if (!AnimationMode)
  {
    // Interaction with other sprites/objects.
    
    var k;
    for (k=parseInt(YetToInteractIndex)+1;k<g_SpritePool.length;k++)
    {
      if (g_SpritePool[k])
      {
        SpriteObjectToApply.interactWith(g_SpritePool[k]);
      }
    }
  }
}

function CreateSpriteObject(Type,X,Y)
{
  var SpriteObject = new Object();
  
  if (SpriteObject)
  {
    SpriteObject.X          = Math.round(X);
    SpriteObject.Y          = Math.round(Y);
    SpriteObject.VelX       = 0;
    SpriteObject.VelY       = 0;
    SpriteObject.AccelX     = 0;
    SpriteObject.AccelY     = 0;
    SpriteObject.Strength   = Game_Sprite_TypeProperties[Type].Strength;
    SpriteObject.Weight     = Game_Sprite_TypeProperties[Type].Weight;
    SpriteObject.VelLimit   = Game_Sprite_TypeProperties[Type].VelLimit;
    SpriteObject.Size       = Game_Sprite_TypeProperties[Type].Size;
    SpriteObject.isActive   = false;
    SpriteObject.TargetSize = 0;
    SpriteObject.AnimWalk   = 0;
    SpriteObject.WalkSum    = Game_Sprite_TypeProperties[Type].WalkSum;
    SpriteObject.TargetX    = Math.round(SpriteObject.X);
    SpriteObject.TargetY    = Math.round(SpriteObject.Y);
    SpriteObject.SmartTargetVision = Game_Sprite_TypeProperties[Type].SmartTargetVision;
    SpriteObject.SmartTargetSearchLimit = Game_Sprite_TypeProperties[Type].SmartTargetSearchLimit;
    SpriteObject.SmartTargetTimeoutCount = 0;
    SpriteObject.PreSmartTargetX = SpriteObject.X; // It will contain the coordinates to the point this Sprite will follow during a smart-gototarget operation (if StopToCalculatePath is true).
    SpriteObject.PreSmartTargetY = SpriteObject.Y;
    SpriteObject.TargetSeekSleep = 1;
    SpriteObject.TargetSprite     = null;
    SpriteObject.Target          = -1;
    SpriteObject.TargetPath      = null;
    SpriteObject.TargetPathIndex = -1;
    SpriteObject.LoopedTargetPath = false;
    SpriteObject.CameraFollowsTarget = false;
    SpriteObject.StopToCalculatePath = Game_Sprite_TypeProperties[Type].StopToCalculatePath;
    SpriteObject.SmartPAttmptBeforeGivingUp = Game_Sprite_TypeProperties[Type].SmartPAttmptBeforeGivingUp;
    SpriteObject.SmartPCalculationAttempN = 1;
    SpriteObject.Bounceable = Game_Sprite_TypeProperties[Type].Bounceable;
    SpriteObject.Ghost      = Game_Sprite_TypeProperties[Type].Ghost;
    SpriteObject.Z          = Game_Sprite_TypeProperties[Type].Z;

    SpriteObject.PreBounceVelX       = 0;
    SpriteObject.PreBounceVelY       = 0;
    SpriteObject.AgainstUnbounceable = false; // Set to true when the sprite has been bounced against an unbounceable
                                             // (hard) object.  Reset at every frame.
    
    SpriteObject.Type         = Type;

    SpriteObject.FramesOffCamera     = g_NFramesOffCameraBeforeDestroying;
    SpriteObject.ScheduleDestruction = false;
    SpriteObject.Rot          = 0;
    SpriteObject.LivingState  = Game_Sprite_TypeProperties[Type].LivingState;
    
    SpriteObject.TextBubble       = Game_Sprite_TypeProperties[Type].TextBubble;
    SpriteObject.TextLabel        = Game_Sprite_TypeProperties[Type].TextLabel;
    SpriteObject.TextBubbleX      = Game_Sprite_TypeProperties[Type].TextBubbleX;
    SpriteObject.TextBubbleY      = Game_Sprite_TypeProperties[Type].TextBubbleY;
    SpriteObject.TextBubbleTargetX      = Game_Sprite_TypeProperties[Type].TextBubbleTargetX;
    SpriteObject.TextBubbleTargetY      = Game_Sprite_TypeProperties[Type].TextBubbleTargetY;
    SpriteObject.TextBubbleRealX  = 0;
    SpriteObject.TextBubbleRealY  = 0;
    
    SpriteObject.Camera           = Game_Sprite_TypeProperties[Type].Camera;
    SpriteObject.UpdateView       = true;
    
    SpriteObject.CalculatingSmartPath      = false;
    SpriteObject.SmartPathIterationObject  = null;
    SpriteObject.SmartTarget      = null;
    SpriteObject.LastSmartTargetLeg = false;
    SpriteObject.LastBouncedSprite = null; // Useful to determine whether the Sprite needs to recalculate a smart path.
    SpriteObject.SameBounceCount  = 0;
    SpriteObject.TemporaryObstacles = null;
    SpriteObject.RecalculateOnEnd = false;
    SpriteObject.TargetIsSmart    = false;

    SpriteObject.IdleState    = 0;
    
    SpriteObject.doAction = function(Action,ParameterObject)
    {
      SpriteObject_DoAction(SpriteObject,Action,ParameterObject);
    }

    SpriteObject.setTargetPath = function(Path,Looped)
    {
      SpriteObject.TargetPath       = CloneTargetPath(Path,false);
      SpriteObject.TargetPathIndex  = 0;
      SpriteObject.LoopedTargetPath = Looped;
      SpriteObject.nextInTargetPath();
    }
    
    SpriteObject.setTargetSprite = function(Target,CameraFollowsTarget,Smart)
    {
      var Proceed   = true;
      var SetTarget = true;
      
      if (SpriteObject && Target)
      {
        Proceed = true;
      }
      
      if (Proceed)
      {
        SpriteObject.TargetIsSmart = false;
        if (g_SpritesWithTargetSprite[SpriteObject.Id])
        {
          delete g_SpritesWithTargetSprite[SpriteObject.Id];
        }
        
        if (Smart)
        {
          SetTarget = !Game_Sprite_TypeProperties[SpriteObject.Type].StopToCalculatePath; // Let's (possibly) stop the Sprite while it thinks.
          
          SpriteObject.PreSmartTargetX = SpriteObject.TargetX;
          SpriteObject.PreSmartTargetY = SpriteObject.TargetY;
          
          if (Game_Sprite_TypeProperties[SpriteObject.Type].Target != -1)
          {
            SpriteObject.TargetIsSmart         = true;
            SpriteObjectFunct_SetSmartTarget(SpriteObject,Target,null,null);
          }
        }
        else
        {
          SpriteObject.TargetSprite = Target;
          if (Target)
          {
            g_SpritesWithTargetSprite[SpriteObject.Id] = SpriteObject;
          }
        }
        
        if (
            (SpriteObject.CameraFollowsTarget && !CameraFollowsTarget) ||
            (SpriteObject.TextBubble && !Target)
           )
        {
          SetTarget = false;
        }
        
        if (!SetTarget)
        {
          SpriteObject.TargetSprite = null;
          if (g_SpritesWithTargetSprite[SpriteObject.Id])
          {
            delete g_SpritesWithTargetSprite[SpriteObject.Id];
          }
          CameraFollowsTarget = false;
        }
        
        SpriteObject.CameraFollowsTarget = CameraFollowsTarget;
      }
      
      return SetTarget;
    }
    
    SpriteObject.addToTargetPath = function(Path)
    {
      if (SpriteObject.TargetPath)
      {
        SpriteObject.TargetPath = SpriteObject.TargetPath.concat(Path);
      }
      else
      {
        SpriteObject.TargetPath = CloneTargetPath(Path,false);
        SpriteObject.TargetPathIndex = 0;
        SpriteObject.LoopedTargetPath = false;
        SpriteObject.nextInTargetPath();
      }
    }
    
    SpriteObject.recalculateSmartTarget = function(SpriteToAddToObstacles)
    {
    
      if ((SpriteObject.SmartPAttmptBeforeGivingUp == -1) || (SpriteObject.SmartPCalculationAttempN <= SpriteObject.SmartPAttmptBeforeGivingUp))
      {
        SpriteObject.TargetPath  = null;
        SpriteObject.TargetPathIndex = -1;
        SpriteObject.LoopedTargetPath = false;
        SpriteObject.RecalculateOnEnd = true;
        
        if (SpriteToAddToObstacles)
        {
          var ExcludeObstacleTypeList = Game_Sprite_TypeProperties[SpriteObject.Type].ExcludeObstacleTypeList;
          var IncludeIt = false;
          if (ExcludeObstacleTypeList)
          {
            for (var i in ExcludeObstacleTypeList)
            {
              if (SpriteToAddToObstacles.Type == ExcludeObstacleTypeList[i])
              {
                IncludeIt = true;
                break;
              }
            }
          }
          
          if (IncludeIt)
          {
            if (!SpriteObject.TemporaryObstacles)
            {
              SpriteObject.TemporaryObstacles = new Array();
            }
            
            SpriteObject.TemporaryObstacles.push(SpriteToAddToObstacles);
          }
        }
        
        SpriteObject.nextInTargetPath();
        SpriteObject.SmartPCalculationAttempN++;
      }
      else
      {
        // Give up after several attempts of going past an obstacle.
        SpriteObject.clearSmartTarget(true);
        SpriteObject.Target = 0;
        SpriteObject.SmartPCalculationAttempN = 1;
        Game_SmartTargetGivenUp(SpriteObject);
      }
    }
    
    SpriteObject.nextInTargetPath = function()
    {
      return SpriteObject_NextInTargetPath(SpriteObject);
    }
    
    SpriteObject.setVelocity = function(Velocity)
    {
      if (isNaN(Velocity))
      {
        Velocity = 0;
      }
      
      if (Velocity>=0)
      {
        SpriteObject.VelLimit     = Velocity;
        
        if (Velocity == 0)
        {
          SpriteObject.VelX = 0;
          SpriteObject.VelY = 0;
        }
      }
    }
    
    SpriteObject.setAcceleration = function(Acceleration)
    {
      if (isNaN(Acceleration))
      {
        Acceleration = 0;
      }
      
      SpriteObject.Strength = Acceleration;
    }
    
    SpriteObject.setZOrder = function(ZOrder)
    {
      if (SpriteObject.Camera == -1)
      {
        if (ZOrder<0)
        {
          ZOrder = 0;
        }
        
        if (ZOrder>9)
        {
          ZOrder = 9;
        }

        SpriteObject.Z = ZOrder;
        if (SpriteObject.Image)
        {
          SpriteObject.Image.style.zIndex = SpriteObject.Z;
        }
      }
    }
    
    SpriteObject.isSelected       = false;

    // These two variables depend on VelLimit.
    SpriteObject.VelLimX   = 0;
    SpriteObject.VelLimY   = 0;
    
    var SpriteId = (g_NextSpriteId++).toString();
    
    while (SpriteId.length<7)
    {
      SpriteId = '0' + SpriteId;
    }
    
    SpriteObject.Id = 'px_' + SpriteId;

    SpriteObject.PreviousRenderedX = 0;
    SpriteObject.PreviousRenderedY = 0;
    SpriteObject.PreviousRenderedRoundX = 0;
    SpriteObject.PreviousRenderedRoundY = 0;
    
    SpriteObject.BubbleCaption = null;
    SpriteObject.BubbleCaptionText = '';
    SpriteObject.BubbleCaptionOriginalText = '';
    
    SpriteObject.AnimationState = 'idle';
    SpriteObject.AnimStatePermanentMode = false;
    
    SpriteObject.StateImageSrc = null;
    SpriteObject_CreateImages(SpriteObject,false);
    
    SpriteObject.TextBubbleRealX = Math.round(SpriteObject.RealImageWidth  * SpriteObject.TextBubbleX * 0.01);
    SpriteObject.TextBubbleRealY = Math.round(SpriteObject.RealImageHeight * SpriteObject.TextBubbleY * 0.01);
    
    SpriteObject.setCaption = function(Caption)
    {
      if (SpriteObject.TextBubble)
      {
        var SpanClassName = (SpriteObject.TextLabel)?'labeltext':'bubbletext';
        SpriteObject.BubbleCaptionOriginalText = Caption || '';
        SpriteObject.BubbleCaptionText = SpriteObject.BubbleCaptionOriginalText;
        
        SpriteObject.BubbleCaptionText = SpriteObject.BubbleCaptionText.replace(/\>/g,'&gt;');
        SpriteObject.BubbleCaptionText = SpriteObject.BubbleCaptionText.replace(/\</g,'&lt;');
        
        if (SpriteObject.BubbleCaption)
        {
          ReplaceHTML(SpriteObject.BubbleCaption.id,'<span class="' + SpanClassName + '">' + SpriteObject.BubbleCaptionText.replace(/\n/g,'<br>\n') + '</span>');
        }
      }
    }
    
    SpriteObject.showCaption = function(Show)
    {
      if (SpriteObject.TextBubble)
      {
        SpriteObject.CaptionBeingShown = Show;
        if (SpriteObject.BubbleCaption)
        {
          SpriteObject.BubbleCaption.style.visibility = (Show)?'visible':'hidden';
        }
      }
    }
    
    SpriteObject.CaptionBeingShown = false;
    
    SpriteObject.setStateImage = function(StateName,Mode)
    {
      SpriteObject_SetStateImage(SpriteObject,StateName,Mode);
    }
    
    SpriteObject.setCamera   = function()
    {
      // Let's set the camera.
      return SpriteObject_SetCamera(SpriteObject);
    }

    SpriteObject.interactWith = function(SpriteObjectTarget)
    {
      SpriteObjectFunct_interactWith(SpriteObjectTarget,this);
    }

    SpriteObject.doDie = function()
    {
      SpriteObjectFunct_doDie(this);
    }
    
    SpriteObject.doResurrect = function()
    {
      SpriteObjectFunct_doResurrect(this);
    }
    
    SpriteObject.animate = function()
    {
      SpriteObjectFunct_animate(this);
    }
    
    SpriteObject.moveToTarget = function()
    {
      SpriteObjectFunct_moveToTarget(this);
    }
    
    SpriteObject.clearSmartTarget = function(ClearTarget)
    {
      SpriteObjectFunct_ClearSmartTarget(this,ClearTarget);
    }
    
    SpriteObject.setVisible = function(Visible)
    {
      SpriteObjectFunct_setVisible(this,Visible);
    }
    
    SpriteObject.setGhost = function(Ghost)
    {
      SpriteObjectFunct_setGhost(this,Ghost);
    }
    
    SpriteObject.updateSize = function()
    {
      SpriteObject.RealImageWidth  = SpriteObject.OriginalImageWidth  * SpriteObject.Size;
      SpriteObject.RealImageHeight = SpriteObject.OriginalImageHeight * SpriteObject.Size;
      
      SpriteObject.RealImgSelectorWidth  = SpriteObject.OriginalImgSelectorWidth  * SpriteObject.Size;
      SpriteObject.RealImgSelectorHeight = SpriteObject.OriginalImgSelectorHeight * SpriteObject.Size;
    }

    // Related to the Help Info System.
    SpriteObject.HelpScreenKeyword = '';
    SpriteObject.HelpScreenMode    = '';
    SpriteObject.LinkedOnMouseOver = null;
    SpriteObject.LinkedOnMouseOut  = null;

    SpriteObject.Visible = Game_Sprite_TypeProperties[Type].Visible;
    
    SpriteObject.isSprite            = true;
  }
  
  return SpriteObject;
}

function SpriteObject_CreateImages(SpriteObject,CreateActualImage)
{
  SpriteObject_GenerateImage(SpriteObject,'Image','idle','','OriginalImage','RealImage',true,null,CreateActualImage);
  
  // AnimationState refers to this Sprite's image animation state.
  // Useful to quickly restore the animation state stored in a timeline mark object animation snapshot.
  SpriteObject_SetStateImage(SpriteObject,SpriteObject.AnimationState,3);
  
  if (CreateActualImage)
  {
    if (SpriteObject.TextBubble)
    {
      // We must create the caption region.
      SpriteObject.BubbleCaption            = document.createElement("div");
      SpriteObject.BubbleCaption.className  = 'bubbletext';
      SpriteObject.BubbleCaption.id  = 'caption_' + SpriteObject.Id;
      
      SpriteObject.BubbleCaption.style.position     = 'absolute';
      SpriteObject.BubbleCaption.style.fontSize     = SpriteObject.Size + 'em';
      SpriteObject.BubbleCaption.style.visibility   = 'hidden';
      SpriteObject.BubbleCaption.style.top       = SpriteObject.Image.style.top;
      SpriteObject.BubbleCaption.style.left      = SpriteObject.Image.style.left;
      SpriteObject.BubbleCaption.style.width        = SpriteObject.RealImageWidth;
      SpriteObject.BubbleCaption.style.height       = SpriteObject.RealImageHeight;
      SpriteObject.BubbleCaption.style.textAlign = 'center';
      SpriteObject.BubbleCaption.onmouseup = SpriteObject.Image.onmouseup;
      
      DragDrop_MakeSelectable(SpriteObject.BubbleCaption,SpriteObject.Image,SpriteObject,-1,-1);
    }
    
    SpriteObject_GenerateImage(SpriteObject,'ImgSelector','selector','_selector','OriginalImgSelector','RealImgSelector',true,SpriteObject.Image,CreateActualImage);
    
    document.body.appendChild(SpriteObject.Image);
    SpriteObject.Image.style.zIndex = SpriteObject.Z;

    if (SpriteObject.TextBubble)
    {
      document.body.appendChild(SpriteObject.BubbleCaption);
      SpriteObject.BubbleCaption.style.zIndex       = 14;
      
      if (SpriteObject.BubbleCaptionText)
      {
        SpriteObject.setCaption(SpriteObject.BubbleCaptionText);
      }
    }

    document.body.appendChild(SpriteObject.ImgSelector);
    SpriteObject.ImgSelector.style.zIndex = (SpriteObject.Camera == -1)?15:17;
      
  }
}
    
function SpriteObject_DeleteImages(SpriteObject)
{
  if (SpriteObject.Image)
  {
    document.body.removeChild(SpriteObject.Image);
    SpriteObject.Image = null;
  }
  
  if (SpriteObject.ImgSelector)
  {
    document.body.removeChild(SpriteObject.ImgSelector);
    SpriteObject.ImgSelector = null;
  }
  
  if (SpriteObject.TextBubble && SpriteObject.BubbleCaption)
  {
    document.body.removeChild(SpriteObject.BubbleCaption);
    SpriteObject.BubbleCaption = null;
  }
}
    
function SpriteObject_GenerateImage(SpriteObject,ImageName,ImageSourceName,IdSuffix,OriginalImageName,RealImageName,DoMakeDraggable,DragImageSource,CreateActualImage)
{
  if (IdSuffix != '')
  {
    IdSuffix = '_' + IdSuffix;
  }
  
  var OriginalImageWidth  = OriginalImageName + 'Width';
  var OriginalImageHeight = OriginalImageName + 'Height';
  
  var RealImageWidth  = RealImageName + 'Width';
  var RealImageHeight = RealImageName + 'Height';
  
  SpriteObject[OriginalImageWidth]  = parseInt(g_AnimTypes[SpriteObject.Type][ImageSourceName].Image.width);
  SpriteObject[OriginalImageHeight] = parseInt(g_AnimTypes[SpriteObject.Type][ImageSourceName].Image.height);
  SpriteObject[RealImageWidth]  = SpriteObject[OriginalImageWidth]  * SpriteObject.Size;
  SpriteObject[RealImageHeight] = SpriteObject[OriginalImageHeight] * SpriteObject.Size;
  
  if (CreateActualImage)
  {
    SpriteObject[ImageName] = document.createElement("div");
    SpriteObject[ImageName].style.visibility   = 'hidden';
    SpriteObject[ImageName].id  = SpriteObject.Id + IdSuffix;
    SpriteObject[ImageName].style.position     = 'absolute';
    SpriteObject[ImageName].style.width  = SpriteObject[RealImageWidth];
    SpriteObject[ImageName].style.height = SpriteObject[RealImageHeight];
    
    SpriteObject[ImageName].StateImageSrc = g_AnimTypes[SpriteObject.Type][ImageSourceName].Image.src;
    SpriteObject[ImageName].style.backgroundImage  = 'url(' + SpriteObject[ImageName].StateImageSrc + ')';	
    SpriteObject[ImageName].style.backgroundRepeat  = 'no-repeat';
    
    if (DoMakeDraggable)
    {
      DragDrop_MakeSelectable(SpriteObject[ImageName],DragImageSource,SpriteObject,-1,-1);
    }
  }
}

function RenderSpriteObject(SpriteObject,ForceRender)
{
  var Proceed   = false;
  var OffCamera = false;
  
  if (
      (((SpriteObject.X + SpriteObject.RealImageWidth) + g_ViewPort_X) > 0) && 
      ((SpriteObject.X  + g_ViewPort_X - g_FixedScreen_Width) < 0) &&
      (((SpriteObject.Y + SpriteObject.RealImageHeight) + g_ViewPort_Y) > 0) && 
      ((SpriteObject.Y  + g_ViewPort_Y - g_FixedScreen_Height) < 0)
     )
  {
    if (SpriteObject.Camera == 1)
    {
      if (
          (SpriteObject.PreviousRenderedX  != SpriteObject.X + g_ViewPort_X) ||
          (SpriteObject.PreviousRenderedY  != SpriteObject.Y + g_ViewPort_Y)
         )
      {
        SpriteObject.PreviousRenderedX  = SpriteObject.X + g_ViewPort_X;
        SpriteObject.PreviousRenderedY  = SpriteObject.Y + g_ViewPort_Y;
        SpriteObject.UpdateView = true;
      }
    }
    else if (
        (SpriteObject.PreviousRenderedRoundX  != Math.round(SpriteObject.X) + g_ViewPort_X) ||
        (SpriteObject.PreviousRenderedRoundY  != Math.round(SpriteObject.Y) + g_ViewPort_Y)
       )
    {
      SpriteObject.PreviousRenderedRoundX  = Math.round(SpriteObject.X) + g_ViewPort_X;
      SpriteObject.PreviousRenderedRoundY  = Math.round(SpriteObject.Y) + g_ViewPort_Y;
      Proceed = true;
    }
  }
  else
  {
    OffCamera = true;
  }
  
  if (OffCamera)
  {
    if (SpriteObject.Image)
    {
      if (SpriteObject.FramesOffCamera == g_NFramesOffCameraBeforeDestroying)
      {
        SpriteObject.Image.style.visibility              = 'hidden';
        SpriteObject.ImgSelector.style.visibility        = 'hidden';
        
        Game_OffScreen(SpriteObject);
      }
      
      SpriteObject.FramesOffCamera--;
      
      if (SpriteObject.FramesOffCamera <= 0)
      {
        // Destroy image.
        SpriteObject_DeleteImages(SpriteObject);
        SpriteObject.FramesOffCamera = 0;
        
        Game_OffScreenTooLong(SpriteObject);
      }
    }
  }
  else
  {
    if (SpriteObject.FramesOffCamera != g_NFramesOffCameraBeforeDestroying)
    {
      SpriteObject.FramesOffCamera = g_NFramesOffCameraBeforeDestroying;
    }
    
    if (!SpriteObject.Image)
    {
      // Create image.
      SpriteObject_CreateImages(SpriteObject,true);
      
      if (SpriteObject.TextBubble && SpriteObject.CaptionBeingShown)
      {
        SpriteObject.setCaption(SpriteObject.BubbleCaptionOriginalText);
        SpriteObject.BubbleCaption.style.visibility = (SpriteObject.Visible)?'visible':'hidden';
      }
      Game_OnScreen(SpriteObject);
    }
  }

  if (SpriteObject.Image && (Proceed || ForceRender) && !OffCamera)
  {
    var Invisible = (
                     ((!SpriteObject.Visible || SpriteObject.TextLabel || (SpriteObject.Camera != -1)))
                    );
                    
    SpriteObject.Image.style.visibility   = (Invisible)?'hidden':'visible';
    
    var StyleLeft = Math.round(SpriteObject.X) + g_ViewPort_X; //+ 'px';
    var StyleTop = Math.round(SpriteObject.Y) + g_ViewPort_Y; //+ 'px';
    var BackgroundPosX = 0;
    var BackgroundPosY = 0;
    
    var PartialView = false;
    
    if (StyleLeft > (g_FixedScreen_Width - SpriteObject.RealImageWidth) - 2)
    {
      BackgroundPosX = (StyleLeft - (g_FixedScreen_Width - SpriteObject.RealImageWidth));
      StyleLeft = g_FixedScreen_Width - SpriteObject.RealImageWidth - 2;
      PartialView = true;
    }
    else if (StyleLeft < 0)
    {
      BackgroundPosX = StyleLeft;
      StyleLeft = 0;
      PartialView = true;
    }

    if (StyleTop > (g_FixedScreen_Height - SpriteObject.RealImageHeight) - 2)
    {
      BackgroundPosY = (StyleTop - (g_FixedScreen_Height - SpriteObject.RealImageHeight));
      StyleTop = g_FixedScreen_Height - SpriteObject.RealImageHeight - 2;
      PartialView = true;
    }
    else if (StyleTop < 0)
    {
      BackgroundPosY = StyleTop;
      StyleTop = 0;
      PartialView = true;
    }

    SpriteObject.Image.style.left = StyleLeft;
    SpriteObject.Image.style.top  = StyleTop;
    
    SpriteObject.Image.style.backgroundPosition  = BackgroundPosX + 'px ' + BackgroundPosY + 'px';	
    
    SpriteObject.ImgSelector.style.left = StyleLeft;
    SpriteObject.ImgSelector.style.top  = StyleTop;
    SpriteObject.ImgSelector.style.visibility   = (SpriteObject.isSelected && !PartialView)?'visible':'hidden';
    
    if (SpriteObject.TextBubble && SpriteObject.BubbleCaption)
    {
      SpriteObject.BubbleCaption.style.left     = StyleLeft;
      SpriteObject.BubbleCaption.style.top      = StyleTop;
      
      SpriteObject.BubbleCaption.style.visibility = (SpriteObject.CaptionBeingShown && !PartialView)?'visible':'hidden';
      
      if (g_isSafari)
      {
        Safari_UpdateCaptionDimensions(SpriteObject);
      }     
    }
  }
}

function SpriteObject_DoAction(SpriteObject,Action,ParameterObject)
{
  switch (Action)
  {
    case 'die':
      SpriteObject.doDie();
      break;
      
    case 'resurrect':
      SpriteObject.doResurrect();
      break;

    case 'invisible':
      SpriteObject.setVisible(false);
      break;
      
    case 'visible':
      SpriteObject.setVisible(true);
      break;

    case 'ghost':
      SpriteObject.setGhost(true);
      break;

    case 'unghost':
      SpriteObject.setGhost(false);
      break;

    case 'letgo':
      SpriteObject.letGo();
      break;

    case 'setvel':
      SpriteObject.setVelocity(ParameterObject.value);
      break;

    case 'setaccel':
      SpriteObject.setAcceleration(ParameterObject.value);
      break;

    case 'settextcolor':
      SpriteObject.setBubbleTextColor(ParameterObject.value);
      break;

    case 'setanimstate':
      SpriteObject.setStateImage(ParameterObject.value,0);
      break;
    
    case 'setpermanimstate':
      SpriteObject.setStateImage(ParameterObject.value,1);
      break;
    
    case 'unsetpermanimstate':
      SpriteObject.setStateImage('',2);
      break;

    case 'setzorder':
      SpriteObject.setZOrder(ParameterObject.value);
      break;

    case 'setcamera':
      //SpriteObject.setCamera(ParameterObject.value);
      SpriteObject.setCamera();
      break;
      
    case 'setvel':
      SpriteObject.setVelocity(ParameterObject.value);
      break;
  }
}

function DoGeneralAction(Action,GeneralParameter)
{
  switch (Action)
  {
    case 'sound':
    case 'soundloop':
    case 'soundstop':
      if (Game_Sounds[GeneralParameter])
      {
        if (g_SoundAvailable)
        {
          StopSound(GeneralParameter);
          g_SoundLoop[GeneralParameter] = false;
          
          var PlaySound = false;
          
          if (Action == 'sound')
          {
            PlaySound = true;
          }
          else if (Action == 'soundloop')
          {
            PlaySound = true;
            g_SoundLoop[GeneralParameter] = true;
          }
          
          if (PlaySound)
          {
            SoundPlay(GeneralParameter);
          }
        }
      }
      break;
      
    case 'setfriction':
      var FrictionValue = isNaN(GeneralParameter)?0:GeneralParameter;
      if (FrictionValue > 100)
      {
        FrictionValue = 100;
      }
      else if (FrictionValue < 0)
      {
        FrictionValue = 0;
      }
      g_GroundFriction   = FrictionValue * 0.01;
      break;
      
    case 'nocamera':
      if (g_CurrentActiveCameraSprite)
      {
        g_CurrentActiveCameraSprite.Camera = 0;
        g_CurrentActiveCameraSprite.setStateImage('idle',0);
        g_CurrentActiveCameraSprite        = null;
      }
      
      break;
  }
}

function SpriteObject_NextInTargetPath(SpriteObject)
{
  var AtLeastOne = false;
  
  if (SpriteObject.TargetPath)
  {
    var Proceed = true;
    if (SpriteObject.TargetPathIndex == (SpriteObject.TargetPath.length - 1))
    {
      // Last leg.  Is this a smart pursuit?
      if (SpriteObject.TargetIsSmart && SpriteObject.SmartTarget)
      {
        if (SpriteObject.SmartTarget.TargetSprite)
        {
          SpriteObject.TargetPath = null;
          SpriteObject.TargetPathIndex = -1;
          SpriteObject.LoopedTargetPath = false;
          SpriteObject.LastSmartTargetLeg = true;
          AtLeastOne = true;
          Proceed = false;
        }
      }
    }
    
    if (Proceed)
    {
      AtLeastOne = (SpriteObject.TargetPath.length>0);
      
      if (AtLeastOne)
      {
        var Next = null;

        while (!Next)
        {
           Next = SpriteObject.TargetPath[SpriteObject.TargetPathIndex];
           SpriteObject.TargetPathIndex++;
           
           if (Next)
           {
             if (Next.isSprite)
             {
               var NodeSprite = TargetPath_GetNodeSprite(Next);
               
               Next = NodeSprite;
               
               if (Next)
               {
                 if (Next.Id == SpriteObject.Id)
                 {
                   Next = null;
                 }
               }
             }
           }
           else
           {
             Next = null;
           }
           
           //if (SpriteObject.TargetPath.length<=0)
           if (SpriteObject.TargetPathIndex >= (SpriteObject.TargetPath.length))
           {
             // TargetPath completed.
             if (SpriteObject.LoopedTargetPath)
             {
               SpriteObject.TargetPathIndex  = 0;
             }
             else
             {
               SpriteObject.TargetPath       = null;
               SpriteObject.TargetPathIndex  = -1;
               SpriteObject.LoopedTargetPath = false;
             }
             break;
           }
           
        }
        
        if (Next)
        {
          if (Next.isSprite)
          {
            SpriteObject.setTargetSprite(Next,false,false);
            SpriteObject.Target = Game_Sprite_TypeProperties[SpriteObject.Type].Target;
          }
          else
          {
            // We must preserve the value of TargetIsSmart, because setTargetSprite sets it to false.
            var PreviousTargetIsSmart = SpriteObject.TargetIsSmart;
            SpriteObject.setTargetSprite(null,false,false);
            SpriteObject.TargetIsSmart = PreviousTargetIsSmart;
            
            SpriteObject.TargetX = Math.round(Next[0] - SpriteObject.RealImageWidth  * 0.5);
            SpriteObject.TargetY = Math.round(Next[1] - SpriteObject.RealImageHeight * 0.5);
            SpriteObject.Target  = Game_Sprite_TypeProperties[SpriteObject.Type].Target;
          }
        }
      }
    }
  }
  else
  {
    // Are we at the end of a partial smart target calculation?
    if (SpriteObject.SmartTarget)
    {
      if (SpriteObject.RecalculateOnEnd)
      {
        // Yes.  SmartTarget is the target this sprite intended to reach, but
        // the original calculations couldn't find a complete path because of some reason
        // (possibly due to a limitation of the vision of the Sprite).
        // Let's set this smart target.
        if (SpriteObject.SmartTarget.TargetSprite)
        {
          SpriteObject.Target = 0;
          if (SpriteObject.setTargetSprite(SpriteObject.SmartTarget.TargetSprite,false,true))
          {
            SpriteObject.Target = Game_Sprite_TypeProperties[SpriteObject.Type].Target;
          }
        }
        else
        {
          SetSpriteTarget(SpriteObject,SpriteObject.SmartTarget.X,SpriteObject.SmartTarget.Y,null,true,false);
        }
      }
      else
      {
        SpriteObject.SmartPCalculationAttempN = 1;
        SpriteObject.TemporaryObstacles       = null;
      }
    }
  }
    
  return AtLeastOne;
}

function SpriteObject_SetCamera(SpriteObject)
{
  if (SpriteObject.Camera != -1)
  {
    if (SpriteObject.Camera == 0)
    {
      if (g_CurrentActiveCameraSprite)
      {
        g_CurrentActiveCameraSprite.Camera = 0;
        g_CurrentActiveCameraSprite.setStateImage('idle',0);
      }
      
      g_CurrentActiveCameraSprite        = SpriteObject;
      if (g_CurrentActiveCameraSprite)
      {
        g_CurrentActiveCameraSprite.Camera = 1;
        g_CurrentActiveCameraSprite.setStateImage('active',0);
      }
    }
  }
}

// AnimMode:  0:  Typical / set and do nothing else.
//            1:  Permanent.  Nothing can change the animation state of this Sprite until
// this function is called again, this time with AnimMode = 2 (StateName will be ignored in this case).
//            2:  Reset the mode back to 0.  Animation States can be set freely again (if the mode was previously 1; 
//                otherwise, this action has no effect since the mode was 0 anyway).
//            3:  Internal use only.  Force changing the animation state, but leave AnimStatePermanentMode intact.
function SpriteObject_SetStateImage(SpriteObject,StateName,AnimMode)
{
  if (AnimMode == 2)
  {
    SpriteObject.AnimStatePermanentMode = false;
  }
  else
  {
    if (!SpriteObject.AnimStatePermanentMode || (AnimMode != 0))
    {
      if ( g_AnimTypes[SpriteObject.Type][StateName] && 
           SpriteObject.Image &&
          (SpriteObject.StateImageSrc != g_AnimTypes[SpriteObject.Type][StateName].Image.src)
         )
      {
        if ((parseInt(SpriteObject.Image.style.width)  != parseInt(g_AnimTypes[SpriteObject.Type][StateName].Image.width)) ||
            (parseInt(SpriteObject.Image.style.height) != parseInt(g_AnimTypes[SpriteObject.Type][StateName].Image.height)))
        {
          // We must update the Sprite's image dimensions since they're different to the previous ones.
          SpriteObject_GenerateImage(SpriteObject,'Image',StateName,'','OriginalImage','RealImage',true,null,false);
          SpriteObject.Image.style.width      = SpriteObject.RealImageWidth;
          SpriteObject.Image.style.height     = SpriteObject.RealImageHeight;
        }
        
        SpriteObject.StateImageSrc = g_AnimTypes[SpriteObject.Type][StateName].Image.src;
        SpriteObject.Image.style.backgroundImage  = 'url(' + SpriteObject.StateImageSrc + ')';	
      }
      SpriteObject.AnimationState = StateName;
      
      if (AnimMode == 1)
      {
        SpriteObject.AnimStatePermanentMode = true;
      }
    }
  }
}
    
function ApplyAction(Action)
{
  if (g_SelectedSprite)
  {
    g_SelectedSprite.doAction(Action,{value:null,value2:null});
  }

  return false;
}

function DestroyPoolSprite(IndexInPool,RemoveFromLists,DeleteImages)
{
  if (g_SpritePool[IndexInPool])
  {
    if (RemoveFromLists)
    {
      for (var i in g_CameraIndexList)
      {
        var SpritePoolId = g_CameraIndexList[i];
        
        if (SpritePoolId == IndexInPool)
        {
          delete g_CameraIndexList[i];
        }
      }
    }
    
    for (var k in g_SpritesWithTargetSprite)
    {
      if (g_SpritesWithTargetSprite[k])
      {
        if (g_SpritesWithTargetSprite[k].TargetSprite)
        {
          if (g_SpritesWithTargetSprite[k].TargetSprite.Id == g_SpritePool[IndexInPool].Id)
          {
            g_SpritesWithTargetSprite[k].TargetSprite = null;
            // Comment the previous line and uncomment the next one if you'd prefer the Sprite
            // that has just lost its target to go chase the next target immediately.
            // Otherwise, the Sprite will just continue to the coordinates where the destroyed sprite was,
            // and once there, it will move to the following target.
            //g_SpritesWithTargetSprite[k].nextInTargetPath();
            
            delete g_SpritesWithTargetSprite[k];
          }
        }
      }
    }
    
    for (var k in g_SpritesWithSmartTarget)
    {
      if (g_SpritesWithSmartTarget[k])
      {
        if (g_SpritesWithSmartTarget[k].TargetIsSmart && g_SpritesWithSmartTarget[k].SmartTarget)
        {
          if (g_SpritesWithSmartTarget[k].SmartTarget.TargetSprite)
          {
            if (g_SpritesWithSmartTarget[k].SmartTarget.TargetSprite.Id == g_SpritePool[IndexInPool].Id)
            {
              g_SpritesWithSmartTarget[k].SmartTarget.TargetSprite = null;
              // We don't clear the SmartTarget to keep the Sprite's behavior consistent with
              // the regular Sprite target; if the target Sprite is deleted in that case,
              // the seeker will continue to move to the coordinates of the deleted Sprite.
              // This is what will happen here as well.
              //g_SpritesWithSmartTarget[k].clearSmartTarget(true);
              
              delete g_SpritesWithSmartTarget[k];
            }
          }
        }
      }
    }
    
    if (g_SpritesWithTargetSprite[g_SpritePool[IndexInPool].Id])
    {
      delete g_SpritesWithTargetSprite[g_SpritePool[IndexInPool].Id];
    }
    
    if (g_SpritesWithSmartTarget[g_SpritePool[IndexInPool].Id])
    {
      delete g_SpritesWithSmartTarget[g_SpritePool[IndexInPool].Id];
    }
    
    if (DeleteImages)
    {
      SpriteObject_DeleteImages(g_SpritePool[IndexInPool]);
    }
    else
    {
      g_Sprites_ScheduleDeleteImagesList.push({
                                              Image:g_SpritePool[IndexInPool].Image,
                                              ImgSelector:g_SpritePool[IndexInPool].ImgSelector,
                                              TextBubble:g_SpritePool[IndexInPool].TextBubble,
                                              BubbleCaption:g_SpritePool[IndexInPool].BubbleCaption
                                             });
    }
    
    if (g_CurrentActiveCameraSprite)
    {
      if (g_CurrentActiveCameraSprite.Id == g_SpritePool[IndexInPool].Id)
      {
        g_CurrentActiveCameraSprite = null;
      }
    }
  
    g_SpritePool[IndexInPool].Image       = null;
    g_SpritePool[IndexInPool].ImgSelector = null;
    
    delete g_SpritePool[IndexInPool];
  }
}

function ReplaceHTML(elementid,content)
{
  if (elementid)
  {
    try
    {
      if (document.getElementById && !document.all)
      {
        var rng = document.createRange();
        var el  = document.getElementById(elementid);
        rng.setStartBefore(el);
        var htmlFrag = rng.createContextualFragment(content);
        while (el.hasChildNodes())
        {
          el.removeChild(el.lastChild);
        }
        el.appendChild(htmlFrag);
      }
      else
      {
        var RElement = document.getElementById(elementid);
        if (RElement)
          RElement.innerHTML = content;
      }
    }
    catch (e)
    {
      // Error 002:  Couldn't modify/replace element's HTML code.
    }
  }
}

function TimeLine_SpritePlay(DoPlay)
{
  if (DoPlay == g_TimeLine_Paused)
  {
    if (DoPlay)
    {
      g_TimeLine_TriggerPlay = true;
    }
    else
    {
      g_TimeLine_TriggerPause = true;
    }
  }
}

function CalculateVector(VectorX,VectorY,SecondMeasure)
{
  var NewVectorX = 0;
  var NewVectorY = 0;
  
  var SqrtValue = Math.sqrt(VectorX*VectorX + VectorY*VectorY);
  
  if (SqrtValue != 0)
  {
    NewVectorX = SecondMeasure * VectorX / SqrtValue;
    NewVectorY = SecondMeasure * VectorY / SqrtValue;
  }
  
  return {x:NewVectorX,y:NewVectorY};
}

// Tools/actions.
function CloneTargetPath(TargetPath,SkipTempSprites)
{
  var ClonedTargetPath = new Array();
  
  if (TargetPath)
  {
    for (var i in TargetPath)
    {
      var PathElement = TargetPath[i];
      
      if (PathElement.isSprite)
      {
        // The element is a Sprite.  But it's not the actual SpriteObject.  Only its Id is stored here (PathElement.Id).
        PathElement = {isSprite:true,Id:PathElement.Id};
      }
      
      ClonedTargetPath.push(PathElement);
    }
  }
  
  return ClonedTargetPath;
}

function ClearTimeLine(SetUndoPoint,CreateFirstMark)
{
  g_SpriteIdPool         = new Object();

  ResetSpeed();
  
  g_Sprite_TimeLine_Modified = false;
}

// This function is required because the .style property only works if the style has been declared
// inline in the HTML document (and this might not always be the case).
function getDimensions(HTMLElement)
{
  var DimensionsObject = new Object();
  
  if (HTMLElement && HTMLElement.currentStyle)
  {
    DimensionsObject = {
                          top:    parseInt(HTMLElement.currentStyle.top),
                          left:   parseInt(HTMLElement.currentStyle.left),
                          width:  parseInt(HTMLElement.currentStyle.width),
                          height: parseInt(HTMLElement.currentStyle.height)
                       };
  }
  else if (window.getComputedStyle)
  {
    DimensionsObject = {
                          top:    parseInt(window.getComputedStyle(HTMLElement,'').getPropertyValue('top')),
                          left:   parseInt(window.getComputedStyle(HTMLElement,'').getPropertyValue('left')),
                          width:  parseInt(window.getComputedStyle(HTMLElement,'').getPropertyValue('width')),
                          height: parseInt(window.getComputedStyle(HTMLElement,'').getPropertyValue('height'))
                       };
  }
  else if (document.defaultView)
  {
    // Most likely Safari.
    DimensionsObject = {
                          top:    parseInt(document.defaultView.getComputedStyle(HTMLElement,'').getPropertyValue('top')),
                          left:   parseInt(document.defaultView.getComputedStyle(HTMLElement,'').getPropertyValue('left')),
                          width:  parseInt(document.defaultView.getComputedStyle(HTMLElement,'').getPropertyValue('width')),
                          height: parseInt(document.defaultView.getComputedStyle(HTMLElement,'').getPropertyValue('height'))
                       };
  }
  
  if (DimensionsObject.width != undefined)
  {
    DimensionsObject.halfwidth  = DimensionsObject.width  * 0.5;
    DimensionsObject.halfheight = DimensionsObject.height * 0.5;
  }
  
  return DimensionsObject;
}

function SetViewPort(ViewX,ViewY)
{
  g_ViewX = ViewX;
  g_ViewY = ViewY;
  
  g_ViewPort_X = Math.round(g_FixedScreen_HalfWidth  - ViewX);
  g_ViewPort_Y = Math.round(g_FixedScreen_HalfHeight - ViewY);

  if (
      g_BackgroundLoaded && 
      (
       (g_ViewPort_X != g_ViewPort_OldX) ||
       (g_ViewPort_Y != g_ViewPort_OldY)
      )
     )
  {
    g_SpriteDivMovieScreenFrame.style.backgroundPosition  = g_ViewPort_X + 'px ' + g_ViewPort_Y + 'px';	
  }
  
  g_ViewPort_OldX = g_ViewPort_X;
  g_ViewPort_OldY = g_ViewPort_Y;
}

function InitSound()
{
  g_SoundAvailable = true;
  for (var SoundName in Game_Sounds)
  {
    Game_Sounds[SoundName].player = null;
    try
    {
	    Game_Sounds[SoundName].player = new Media(Game_Sounds[SoundName].id);
    }
    catch (e)
    {
    }
	  
    if (Game_Sounds[SoundName].player)
    {
      g_SoundsToLoadAtStart++;
      HandleLoading(true,false);
    }
    else
    {
      g_SndLoadingErrorsOccurred = true;
    }
  }
}
     
// This function assumes all the necessary checkings have been done by the caller.
function CreateCoordsList(SpriteObjectList)
{
  var SpriteCoordsList = new Array();
    
  for (var i in SpriteObjectList)
  {
    SpriteCoordsList.push({Coordinates:[SpriteObjectList[i].X,SpriteObjectList[i].Y],Dimensions:[SpriteObjectList[i].RealImageWidth,SpriteObjectList[i].RealImageHeight]});
  }
  
  return SpriteCoordsList;
}

function SetSpriteTarget(ThisSprite,TargetX,TargetY,LeadersList,Smart,FollowingTargetPath)
{
  ThisSprite.setTargetSprite(null,false,false);
  ThisSprite.TargetPath = null;
  ThisSprite.TargetPathIndex = -1;
  ThisSprite.LoopedTargetPath = false;
  ThisSprite.clearSmartTarget(true);
  
  if (Smart)
  {
    if (Game_Sprite_TypeProperties[ThisSprite.Type].StopToCalculatePath)
    {
      ThisSprite.Target     = 0;
    }
    
    // TargetX and TargetY must be assigned even for a Smart target request,
    // because TimeLine_AddInstance() will require these values when adding the render element to the timeline.
    ThisSprite.TargetX    = Math.round(TargetX);
    ThisSprite.TargetY    = Math.round(TargetY);
    
    ThisSprite.PreSmartTargetX = ThisSprite.TargetX;
    ThisSprite.PreSmartTargetY = ThisSprite.TargetY;
    
    if (Game_Sprite_TypeProperties[ThisSprite.Type].Target != -1)
    {
      ThisSprite.TargetIsSmart = true;
      SpriteObjectFunct_SetSmartTarget(ThisSprite,{X:ThisSprite.TargetX,Y:ThisSprite.TargetY},null,null);
    }
  }
  else
  {
    ThisSprite.TargetX    = Math.round(TargetX);
    ThisSprite.TargetY    = Math.round(TargetY);
    
    ThisSprite.Target     = Game_Sprite_TypeProperties[ThisSprite.Type].Target;
  }
}

function Safari_UpdateCaptionDimensions(SpriteObject)
{
  if (SpriteObject.BubbleCaption)
  {
    var CaptionDivDimensions = getDimensions(SpriteObject.BubbleCaption);
    SpriteObject.BubbleCaption.style.width  = CaptionDivDimensions.width;
    SpriteObject.BubbleCaption.style.height = CaptionDivDimensions.height;
    
    if (!parseInt(SpriteObject.BubbleCaption.style.width))
    {
      SpriteObject.BubbleCaption.style.width = SpriteObject.RealImageWidth;
    }

    if (!parseInt(SpriteObject.BubbleCaption.style.height))
    {
      SpriteObject.BubbleCaption.style.height = SpriteObject.RealImageHeight;
    }
  }
}

function Labyrinth_ScaleConvert(Value,Measure)
{
  var Conversion = null;
  
  if ((Measure != 0) && (g_Labyrinth_ObjectThickness != 0))
  {
    Conversion = Math.round(Value / (Measure * g_Labyrinth_ObjectThickness));
  }
  return Conversion;
}

// World contains:
// World.Width
// World.Height
// World.ObstacleList = an array of objects with the following attributes:
// X,Y,RealImageWidth,RealImageHeight.
function Labyrinth_Generate(World,SeekerWidth,SeekerHeight)
{
  var Labyrinth = new Object();
  // If you add new properties to the Labyrinth object, remember to update SolveIterationObject_Clone().
  
  Labyrinth.Width  = Labyrinth_ScaleConvert(World.Width,SeekerWidth);
  Labyrinth.Height = Labyrinth_ScaleConvert(World.Height,SeekerHeight);
  
  Labyrinth.Matrix = new Array();
  
  for (var i = 0;i < Labyrinth.Height;i++)
  {
    var Row = new Array();
    for (var j = 0;j < Labyrinth.Width;j++)
    {
      Row.push(0);
    }
    
    Labyrinth.Matrix.push(Row);
  }
  
  for (var i in World.ObstacleList)
  {
    var ThisObstacle = World.ObstacleList[i];
    
    if (ThisObstacle)
    {
      var StartX = Labyrinth_ScaleConvert(ThisObstacle.X,SeekerWidth);
      var StartY = Labyrinth_ScaleConvert(ThisObstacle.Y,SeekerHeight);
      var Width  = Labyrinth_ScaleConvert(ThisObstacle.RealImageWidth,SeekerWidth);
      var Height = Labyrinth_ScaleConvert(ThisObstacle.RealImageHeight,SeekerHeight);
      
      if (Width < 1)
      {
        Width = 1;
      }
      
      if (Height < 1)
      {
        Height = 1;
      }
      
      var NextInLoop;
      
      for (var pY = StartY;pY<=StartY+Height;pY++)
      {
        NextInLoop = false;
        for (var pX = StartX;pX<=StartX+Width;pX++)
        {
          if (Labyrinth.Matrix[pY])
          {
            Labyrinth.Matrix[pY][pX] = 1;
          }
        }
        
        if (NextInLoop)
        {
          break;
        }
      }
    }
  }
  
  return Labyrinth;
}

function Labyrinth_GetFromCoords(Labyrinth,X,Y)
{
  if ((X >= Labyrinth.ConstraintX1) && (Y >= Labyrinth.ConstraintY1) && 
      (X <  Labyrinth.ConstraintX2) && (Y <  Labyrinth.ConstraintY2))
  {
    return Labyrinth.Matrix[Y][X];
  }
  else
  {
    return 1;
  }
}

function Labyrinth_GetFromSeeker(SeekerShape,X,Y,SeekerShapeWidth,SeekerShapeHeight)
{
  var Spot = 0;
  if ((X>=0) && (Y>=0) && (X<SeekerShapeWidth) && (Y<SeekerShapeHeight))
  {
    if (SeekerShape[Y])
    {
      Spot = SeekerShape[Y][X];
    }
  }
  
  return Spot;
}

function Labyrinth_Solve(IterationObject,LimitedVisionMode)
{
  var OriginX   = IterationObject.OriginX;
  var OriginY   = IterationObject.OriginY;
  
  var VisionX   = IterationObject.VisionX;
  var VisionY   = IterationObject.VisionY;
  
  var LabyrinthSeekerShape  = IterationObject.SeekerShape;
  var LabyrinthSeekerWidth  = IterationObject.SeekerShapeWidth;
  var LabyrinthSeekerHeight = IterationObject.SeekerShapeHeight;
  var HalfSeekerWidth  = IterationObject.HalfSeekerShapeWidth;
  var HalfSeekerHeight = IterationObject.HalfSeekerShapeHeight;

  var TestSeekPath;
  var Solution;
  var TargetAchieved;
  var FinishedCalculating;
  var RecalculateOnEnd;
  var PreviousNode;
  var CurrentNode;
  var Distance;
  var Steps;
  var COIterationObject;
  
  var LastSpot = null;
  var PreviousPreferenceLeft  = false;
  var PreviousPreferenceRight = false;
  
  if (IterationObject.FirstStage)
  {
    TestSeekPath   = new Array();
    Solution       = null;
    TargetAchieved = false;
    PreviousNode   = null;
    CurrentNode    = {X:OriginX,Y:OriginY,Left:0,Right:0,Up:0,Down:0,AllPreviousExplored:null,Deleted:false};
    Distance       = 0;
    Steps          = 0;
    LastSpot       = false;
    PreviousPreferenceLeft  = false;
    PreviousPreferenceRight = false;
    IterationObject.FirstStage = false;
    COIterationObject = null;
    
    FinishedCalculating = false;
    RecalculateOnEnd    = false;
    
    if ((IterationObject.TargetX>=IterationObject.Labyrinth.Width) || (IterationObject.TargetY>=IterationObject.Labyrinth.Height) || (IterationObject.TargetX<0) || (IterationObject.TargetY<0))
    {
      FinishedCalculating = true;
    }
  }
  else
  {
    TestSeekPath   = IterationObject.TestSeekPath;
    Solution       = IterationObject.Solution;
    TargetAchieved = IterationObject.TargetAchieved;
    FinishedCalculating = IterationObject.FinishedCalculating;
    RecalculateOnEnd    = IterationObject.RecalculateOnEnd;
    PreviousNode   = IterationObject.PreviousNode;
    CurrentNode    = IterationObject.CurrentNode;
    Distance       = IterationObject.Distance;
    Steps          = IterationObject.Steps;
    LastSpot       = IterationObject.LastSpot;
    PreviousPreferenceLeft  = IterationObject.PreviousPreferenceLeft;
    PreviousPreferenceRight = IterationObject.PreviousPreferenceRight;
    COIterationObject   = IterationObject.COIterationObject;
  }
  
  var LocalIteration = 5; // For an explanation on the use of LocalIteration, see comments about it in Labyrinth_CleanOutSolution().
  while (!FinishedCalculating && !TargetAchieved && (LocalIteration > 0))
  {
    Steps++;
    if (PreviousNode)
    {
      CurrentNode.AllPreviousExplored = (
                                         PreviousNode.Left  &&
                                         PreviousNode.Right &&
                                         PreviousNode.Up    &&
                                         PreviousNode.Down  &&
                                         PreviousNode.AllPreviousExplored
                                        );
    }
    else
    {
      CurrentNode.AllPreviousExplored = true;
    }
    
    var Searching = false;
    var SeekerX   = CurrentNode.X;
    var SeekerY   = CurrentNode.Y;
    var IncrementX = 0;
    var IncrementY = 0;
    var NextNodeLeft  = 0;
    var NextNodeRight = 0;
    var NextNodeUp    = 0;
    var NextNodeDown  = 0;
    
    var PreferenceLeft  = false;
    var PreferenceRight = false;
    var PreferenceUp    = false;
    var PreferenceDown  = false;
    
    if (!CurrentNode.Left && ((SeekerX - HalfSeekerWidth)>IterationObject.TargetX) && (((SeekerY - HalfSeekerHeight) == IterationObject.TargetY) || !(PreviousPreferenceLeft || PreviousPreferenceRight)))
    {
      PreferenceLeft = true;
    }
    else if (!CurrentNode.Right && ((SeekerX - HalfSeekerWidth)<IterationObject.TargetX) && (((SeekerY - HalfSeekerHeight) == IterationObject.TargetY) || !(PreviousPreferenceLeft || PreviousPreferenceRight)))
    {
      PreferenceRight = true;
    }
    else if (!CurrentNode.Down && (((SeekerY - HalfSeekerHeight)<IterationObject.TargetY) || ((LastSpot == 1) && (PreviousPreferenceLeft || PreviousPreferenceRight))))
    {
      PreferenceDown = true;
    }
    else if (!CurrentNode.Up && (((SeekerY - HalfSeekerHeight)>IterationObject.TargetY) || ((LastSpot == 1) && (PreviousPreferenceLeft || PreviousPreferenceRight))))
    {
      PreferenceUp = true;
    }
    else if (!CurrentNode.Left)
    {
      PreferenceLeft = true;
    }
    else if (!CurrentNode.Right)
    {
      PreferenceRight = true;
    }
    else if (!CurrentNode.Up)
    {
      PreferenceUp = true;
    }
    else if (!CurrentNode.Down)
    {
      PreferenceDown = true;
    }
    
    PreviousPreferenceLeft  = PreferenceLeft;
    PreviousPreferenceRight = PreferenceRight;
    
    // Left already explored?
    if (PreferenceLeft)
    {
      // No.  Let's explore.
      Searching  = true;
      CurrentNode.Left = 1;
      NextNodeRight = 1; // We'll explore the left side.  Obviously, if we are to create another node in the future,
                         // since we'l be coming from its right side, then that side can be considered as explored.
      IncrementX = -1;
    }
    else if (PreferenceRight)
    {
      Searching  = true;
      CurrentNode.Right = 1;
      NextNodeLeft = 1;
      IncrementX = 1;
    }
    else if (PreferenceUp)
    {
      Searching  = true;
      CurrentNode.Up = 1;
      NextNodeDown = 1;
      IncrementY = -1;
    }
    else if (PreferenceDown)
    {
      Searching  = true;
      CurrentNode.Down = 1;
      NextNodeUp = 1;
      IncrementY = 1;
    }
    
    if (Searching)
    {
      var KeepMoving = true;
      var FirstStep  = true;
      var CreateNewNode  = false;
      
      while (KeepMoving)
      {
        SeekerX += IncrementX;
        SeekerY += IncrementY;
        
        ThisSpot = 0;
          
        if (
            ((SeekerX<HalfSeekerWidth) || (SeekerX+LabyrinthSeekerWidth>IterationObject.Labyrinth.Width + HalfSeekerWidth)) || 
            ((SeekerY<HalfSeekerHeight) || (SeekerY+LabyrinthSeekerHeight>IterationObject.Labyrinth.Height + HalfSeekerHeight))
           )
        {
          ThisSpot = 1;
        }
        else
        {
          ThisSpot = 0;
          var SeekerSpotDefined = false;
          for (var ShapeX=0;ShapeX<LabyrinthSeekerWidth;ShapeX++)
          {
            for (var ShapeY=0;ShapeY<LabyrinthSeekerHeight;ShapeY++)
            {
              var SpotX = SeekerX - HalfSeekerWidth + ShapeX;
              var SpotY = SeekerY - HalfSeekerHeight + ShapeY;
              
              if ((SpotX == IterationObject.TargetX) && (SpotY == IterationObject.TargetY))
              {
                ThisSpot = 2;
              }
              else if ((LimitedVisionMode == 1) && ((Math.abs(SpotX - OriginX) >= VisionX) || (Math.abs(SpotY - OriginY) >= VisionY)))
              {
                ThisSpot = 1;
              }
              else
              {
                ThisSpot = Labyrinth_GetFromCoords(IterationObject.Labyrinth,SpotX,SpotY);
              }
              
              if (ThisSpot != 0)
              {
                if (Labyrinth_GetFromSeeker(LabyrinthSeekerShape,ShapeX,ShapeY,LabyrinthSeekerWidth,LabyrinthSeekerHeight) != 0)
                {
                  SeekerSpotDefined = true;
                  break;
                }
                else
                {
                  ThisSpot = 0;
                }
              }
            }
            
            if (SeekerSpotDefined)
            {
              break;
            }
          }
        }
        
        // Wall?
        if (ThisSpot == 1)
        {
          // Yes.
          // Back up one step.
          SeekerX -= IncrementX;
          SeekerY -= IncrementY;
          if (!FirstStep)
          {
            // If it's not the first step, then create a new node.
            CreateNewNode = true;
            
            if (IncrementX == 1)
            {
              NextNodeRight = 1;
            }
            else if (IncrementX == -1)
            {
              NextNodeLeft = 1;
            }
            else if (IncrementY == 1)
            {
              NextNodeDown = 1;
            }
            else
            {
              // IncrementY = -1
              NextNodeUp = 1;
            }
          }

          KeepMoving = false;
        }
        else if (ThisSpot == 2)
        {
          // Got a solution!
          TargetAchieved = true;
          TestSeekPath.push(CurrentNode);
          KeepMoving = false;
        }
        else
        {
          // It's an empty space.
          // Sides of this empty space also empty?
          if (IncrementX != 0)
          {
            if (SeekerY > 0)
            {
              if (Labyrinth_GetFromCoords(IterationObject.Labyrinth,SeekerX,SeekerY - 1) != 1)
              {
                CreateNewNode = true;
              }
            }
          
            if (SeekerY < (IterationObject.Labyrinth.Height - 1))
            {
              if (Labyrinth_GetFromCoords(IterationObject.Labyrinth,SeekerX,SeekerY + 1) != 1)
              {
                CreateNewNode = true;
              }
            }
          }
            
          if (IncrementY != 0)
          {
            if (SeekerX > 0)
            {
              if (Labyrinth_GetFromCoords(IterationObject.Labyrinth,SeekerX - 1,SeekerY) != 1)
              {
                CreateNewNode = true;
              }
            }
          
            if (SeekerX < (IterationObject.Labyrinth.Width - 1))
            {
              if (Labyrinth_GetFromCoords(IterationObject.Labyrinth,SeekerX + 1,SeekerY) != 1)
              {
                CreateNewNode = true;
              }
            }
          }
            
          // Have we already visited this spot?
          for (var ThisNode in TestSeekPath)
          {
            if ((SeekerX == TestSeekPath[ThisNode].X) && (SeekerY == TestSeekPath[ThisNode].Y))
            {
              // We're going in circles!  Time to break the loop.
              CreateNewNode = false;
              
              if (IncrementX == 1)
              {
                CurrentNode.Right = 1;
                TestSeekPath[ThisNode].Left     = 1;
              }
              else if (IncrementX == -1)
              {
                CurrentNode.Left = 1;
                TestSeekPath[ThisNode].Right   = 1;
              }
              else if (IncrementY == 1)
              {
                CurrentNode.Down = 1;
                TestSeekPath[ThisNode].Up      = 1;
              }
              else if (IncrementY == -1)
              {
                CurrentNode.Up = 1;
                TestSeekPath[ThisNode].Down  = 1;
              }

              KeepMoving = false;

              break;
            }
          }
        }
        
        LastSpot = ThisSpot;
        
        if (CreateNewNode)
        {
          // Let's create a new node.
          TestSeekPath.push(CurrentNode);
          
          PreviousNode = CurrentNode;
          CurrentNode = {X:SeekerX,Y:SeekerY,Left:NextNodeLeft,Right:NextNodeRight,Up:NextNodeUp,Down:NextNodeDown,AllPreviousExplored:null,Deleted:false};
          
          KeepMoving = false;
        }
        
        FirstStep = false;
      }
      
      if ((LimitedVisionMode == 0) && ((Math.abs(SeekerX - OriginX) > VisionX) || (Math.abs(SeekerY - OriginY) > VisionY)))
      {
        // We can only see so far.
        TargetAchieved = true;
        RecalculateOnEnd = true;
        TestSeekPath.push(CurrentNode);
        KeepMoving = false;
      }
    }
    else
    {
      // This node has been explored.  We must go back.
      if (CurrentNode.AllPreviousExplored)
      {
        FinishedCalculating = true;
      }
      else
      {
        CurrentNode = TestSeekPath.pop();
        
        if (TestSeekPath.length > 0)
        {
          PreviousNode = TestSeekPath[TestSeekPath.length - 1];
        }
        else
        {
          PreviousNode = null;
        }
      }
    }
    
    LocalIteration--;
  }
  
  if (TargetAchieved)
  {
    if (!COIterationObject)
    {
      // If you add new properties here, remember to update SolveIterationObject_Clone().
      COIterationObject          = new Object();
      COIterationObject.Stage    = 0;
      COIterationObject.Solution = TestSeekPath; // Not cloning.  Referencing (due to presence of objects as nodes).
      COIterationObject.Solution.push({X:SeekerX,Y:SeekerY,Deleted:false});
    }
    
    COIterationObject = Labyrinth_CleanOutSolution(COIterationObject);
    
    if (COIterationObject.FinishedCalculating)
    {
      Solution = COIterationObject.CleanSolution; // Not cloning.  Referencing (due to presence of objects as nodes).
      Distance = COIterationObject.Distance;
      COIterationObject   = null;
      FinishedCalculating = true;
    }
  }
  
  // If you add new properties here, remember to update SolveIterationObject_Clone().
  IterationObject.TestSeekPath   = TestSeekPath;
  IterationObject.Solution       = Solution;
  IterationObject.TargetAchieved = TargetAchieved;
  IterationObject.FinishedCalculating = FinishedCalculating;
  IterationObject.RecalculateOnEnd    = RecalculateOnEnd;
  IterationObject.PreviousNode   = PreviousNode;
  IterationObject.CurrentNode    = CurrentNode;
  IterationObject.Distance       = Distance;
  IterationObject.Steps          = Steps;
  IterationObject.LastSpot       = LastSpot;
  IterationObject.PreviousPreferenceLeft  = PreviousPreferenceLeft;
  IterationObject.PreviousPreferenceRight = PreviousPreferenceRight;
  IterationObject.COIterationObject   = COIterationObject;
  
  return IterationObject;
}

function Labyrinth_CleanOutSolution(IterationObject)
{
  var FinishedPartialCalculation = false;
  
  var Stage = IterationObject.Stage;
  var PreviousPos;
  var SecondPreviousPos;
  var CleanSolution;
  var ReLoop;
  var Distance;
  var PreviousNode;
  var FinishedCalculating;
  var LoopIndex;
  var LoopTakingPlace;
  
  if (Stage == 0)
  {
    PreviousPos           = -1;
    SecondPreviousPos     = -1;
    CleanSolution         = IterationObject.Solution; // Not cloning, but referencing.  And Solution refers to TestSeekPath in the calling function.
    ReLoop                = true;
    Distance              = 0;
    PreviousNode          = null;
    FinishedCalculating   = false;
    LoopIndex             = -1;
    LoopTakingPlace       = false;
    Stage = 1;
  }
  else
  {
    PreviousPos           = IterationObject.PreviousPos;
    SecondPreviousPos     = IterationObject.SecondPreviousPos;
    CleanSolution         = IterationObject.CleanSolution;
    ReLoop                = IterationObject.ReLoop;
    Distance              = IterationObject.Distance;
    PreviousNode          = IterationObject.PreviousNode;
    FinishedCalculating   = IterationObject.FinishedCalculating;
    LoopIndex             = IterationObject.LoopIndex;
    LoopTakingPlace       = IterationObject.LoopTakingPlace;
  }
  
  if (Stage == 1)
  {
    for (var k in CleanSolution)
    {
      if (!CleanSolution[k].Deleted)
      {
        CleanSolution[k].Deleted = false;
      }
    }
    
    Stage++;
    FinishedPartialCalculation = true;
  }
  
  if ((Stage == 2) && !FinishedPartialCalculation)
  {
    // Let's delete out loops.
    if (ReLoop || LoopTakingPlace)
    {
      if (!LoopTakingPlace)
      {
        ReLoop = false;
      }
      
      if (LoopIndex == -1)
      {
        LoopIndex = 3; // We'll skip the first two nodes.  Too little information.
        LoopTakingPlace = true;
      }
      
      var LocalIteration = 5;
      while (LoopTakingPlace && (LocalIteration > 0))
      {
        // We'll make the loop run for LocalIteration iterations before giving back execution control
        // to the external code.  The effect this accomplishes is that the cleaning out
        // code will run faster, making the "thinking" of the sprite appear shorter
        // to the user.  This will slow down a little the overall animation.  I think it's a good
        // compromise.  Notice that making LocalIteration to an initial high number will
        // slow down the overall animation to almost a complete halt.
        if (LoopIndex < CleanSolution.length)
        {
          for (var LastEliminatedLoopPos=0;LastEliminatedLoopPos<LoopIndex-2;LastEliminatedLoopPos++)
          {
            if (!CleanSolution[LastEliminatedLoopPos].Deleted && !CleanSolution[LoopIndex].Deleted && !CleanSolution[LoopIndex-1].Deleted)
            {
              var StepX = CleanSolution[LoopIndex].X - CleanSolution[LoopIndex-1].X;
              var StepY = CleanSolution[LoopIndex].Y - CleanSolution[LoopIndex-1].Y;
              
              var DeltaX = CleanSolution[LoopIndex].X - CleanSolution[LastEliminatedLoopPos].X;
              var DeltaY = CleanSolution[LoopIndex].Y - CleanSolution[LastEliminatedLoopPos].Y;
              
              var PreDeltaX = CleanSolution[LoopIndex-1].X - CleanSolution[LastEliminatedLoopPos].X;
              var PreDeltaY = CleanSolution[LoopIndex-1].Y - CleanSolution[LastEliminatedLoopPos].Y;
              
              var NewNode = null;
              if ((StepY == 0) && ((DeltaY == 1) || (DeltaY == -1)))
              {
                if (
                    ((DeltaX >= 0) && (PreDeltaX <= 0)) ||
                    ((DeltaX <= 0) && (PreDeltaX >= 0))
                   )
                {
                  // Loop!
                  NewNode = {X:CleanSolution[LastEliminatedLoopPos].X,Y:CleanSolution[LoopIndex].Y,Deleted:false};
                }
              }
              else if ((StepX == 0) && ((DeltaX == 1) || (DeltaX == -1)))
              {
                if (
                    ((DeltaY >= 0) && (PreDeltaY <= 0)) ||
                    ((DeltaY <= 0) && (PreDeltaY >= 0))
                   )
                {
                  // Loop!
                  NewNode = {X:CleanSolution[LoopIndex].X,Y:CleanSolution[LastEliminatedLoopPos].Y,Deleted:false};
                }
              }
              
              if (NewNode)
              {
                var FirstDeleted = -1;
                for (var j=LastEliminatedLoopPos+1;j<LoopIndex;j++)
                {
                  if (!CleanSolution[j].Deleted)
                  {
                    CleanSolution[j].Deleted = true;
                  }
                  
                  if (FirstDeleted == -1)
                  {
                    FirstDeleted = j;
                  }
                }
                
                if (FirstDeleted != -1)
                {
                  // Is this node already in here?
                  var AlreadyIncluded = false;
                  for (var n in CleanSolution)
                  {
                    if (!CleanSolution[n].Deleted)
                    {
                      if ((CleanSolution[n].X == NewNode.X) && (CleanSolution[n].Y == NewNode.Y))
                      {
                        AlreadyIncluded = true;
                        break;
                      }
                    }
                  }
                  
                  if (!AlreadyIncluded)
                  {
                    CleanSolution[FirstDeleted] = NewNode;
                  }
                }
                
                ReLoop = true;
                break;
              }
            }
          }
          
          LoopIndex++;
        }
        else
        {
          LoopIndex       = -1; // Safe practice.
          LoopTakingPlace = false;
        }
        
        LocalIteration--;
      }
    }
    else
    {
      Stage++;
      FinishedPartialCalculation = true;
    }
  }
  
  if ((Stage == 3) && !FinishedPartialCalculation)
  {
    for (var k=0;k<CleanSolution.length;k++)
    {
      if (!CleanSolution[k].Deleted)
      {
        // Horizontal/Vertical trailing nodes removing and ladder-like positioned nodes removing.
        if ((PreviousPos != -1) && (SecondPreviousPos != -1))
        {
          if (
              (!CleanSolution[k].Deleted) &&
              (!CleanSolution[PreviousPos].Deleted) &&
              (!CleanSolution[SecondPreviousPos].Deleted)
             )
          {
            if (
                ((CleanSolution[k].X == CleanSolution[PreviousPos].X) && (CleanSolution[k].X == CleanSolution[SecondPreviousPos].X)) ||
                ((CleanSolution[k].Y == CleanSolution[PreviousPos].Y) && (CleanSolution[k].Y == CleanSolution[SecondPreviousPos].Y))
               )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y-1) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X-1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y-1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X-1) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X-1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y-1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y+1) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X+1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y+1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X+1) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X+1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y+1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y+1) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X-1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y+1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X-1) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X-1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y+1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y-1) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X+1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y-1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
            else if (
                     (CleanSolution[k].X == CleanSolution[PreviousPos].X+1) &&
                     (CleanSolution[k].Y == CleanSolution[PreviousPos].Y) &&
                     (CleanSolution[k].X == (CleanSolution[SecondPreviousPos].X+1)) &&
                     (CleanSolution[k].Y == (CleanSolution[SecondPreviousPos].Y-1)) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X+1,CleanSolution[k].Y) != 2) &&
                     (Labyrinth_GetFromCoords(CleanSolution[k].X-1,CleanSolution[k].Y) != 2)
                    )
            {
              CleanSolution[PreviousPos].Deleted = true;
            }
          }
        }
        
        SecondPreviousPos = PreviousPos;
        PreviousPos = k;
      }
    }
    
    Stage++;
    FinishedPartialCalculation = true;
  }
  
  if ((Stage == 4) && !FinishedPartialCalculation)
  {
    if (CleanSolution[0])
    {
      if (!CleanSolution[0].Deleted)
      {
        CleanSolution[0].Deleted = true;
      }
    }

    for (var k=0;k<CleanSolution.length;k++)
    {
      if (CleanSolution[k].Deleted)
      {
        delete CleanSolution[k];
      }
      else
      {
        if (PreviousNode)
        {
          Distance += Math.abs(CleanSolution[k].X - PreviousNode.X) + Math.abs(CleanSolution[k].Y - PreviousNode.Y);
        }
        
        PreviousNode = CleanSolution[k];
      }
    }
    
    FinishedCalculating = true;
  }
  
  IterationObject.Stage                 = Stage;
  IterationObject.PreviousPos           = PreviousPos;
  IterationObject.SecondPreviousPos     = SecondPreviousPos;
  IterationObject.CleanSolution         = CleanSolution;
  IterationObject.ReLoop                = ReLoop;
  IterationObject.Distance              = Distance;
  IterationObject.PreviousNode          = PreviousNode;
  IterationObject.FinishedCalculating   = FinishedCalculating;
  IterationObject.LoopIndex             = LoopIndex;
  IterationObject.LoopTakingPlace       = LoopTakingPlace;
    
  return IterationObject;
}

function TargetPath_GenerateFromLabyrinthSolution(Solution,SeekerWidth,SeekerHeight)
{
  var Solution_TargetPath = null;
  
  for (var i in Solution)
  {
    if (!Solution_TargetPath)
    {
      Solution_TargetPath = new Array();
    }
    
    var NodeX = (Solution[i].X) * (SeekerWidth  * g_Labyrinth_ObjectThickness);
    var NodeY = (Solution[i].Y) * (SeekerHeight * g_Labyrinth_ObjectThickness);
    
    Solution_TargetPath.push([NodeX,NodeY]);
  }
  
  return Solution_TargetPath;
}

function SpriteObjectFunct_ClearSmartTarget(SpriteObject,ClearTarget)
{
  SpriteObject.CalculatingSmartPath     = false;
  SpriteObject.SmartPathIterationObject = null;
  
  if (ClearTarget)
  {
    if (g_SpritesWithSmartTarget[SpriteObject.Id])
    {
      delete g_SpritesWithSmartTarget[SpriteObject.Id];
    }
    
    SpriteObject.SmartTarget              = null;
    SpriteObject.TargetIsSmart            = false;
  }
}

function SpriteObjectFunct_SetSmartTarget(Seeker,Target,CenterX,CenterY)
{
  var Proceed = false;
  
  if (Seeker && Target)
  {
    if (Target.isSprite)
    {
      Proceed = (Seeker.Id != Target.Id);
    }
    else
    {
      Proceed = true;
    }
  }
  
  if (Proceed)
  {
    var SeekerX = Seeker.X;
    var SeekerY = Seeker.Y;
    
    if (CenterX != null)
    {
      SeekerX = CenterX;
    }
    
    if (CenterY != null)
    {
      SeekerY = CenterY;
    }
    
    var SeekerWidth = Seeker.RealImageWidth;
    var SeekerHeight = Seeker.RealImageHeight;
    var SeekerShapeWidth = SeekerWidth;
    var SeekerShapeHeight = SeekerHeight;
  
    var World = new Object();
    World.Width  = g_MainWorld_Width;
    World.Height = g_MainWorld_Height;
    
    var ExcludeList = [Seeker.Id]
    
    var SeekerMinX = Seeker.X;
    var SeekerMinY = Seeker.Y;
    
    var SeekerGroupList = new Array();
    
    SeekerGroupList.push(Seeker);
    
    if (Target.Id)
    {
      ExcludeList.push(Target.Id);
    }
    
    var TemporaryObstacleIds = null;
    
    if (Seeker.TemporaryObstacles)
    {
      TemporaryObstacleIds = new Array();
      for (var i in Seeker.TemporaryObstacles)
      {
        TemporaryObstacleIds.push(Seeker.TemporaryObstacles[i].Id);
      }
    }
    
    World.ObstacleList = Labyrinth_ExtractObstacleData(g_SpritePool,ExcludeList,Game_Sprite_TypeProperties[Seeker.Type].ExcludeObstacleTypeList,TemporaryObstacleIds);
    
    var Labyrinth = Labyrinth_Generate(World,SeekerWidth,SeekerHeight);
    
    var SeekerShapeList = Labyrinth_ExtractSeekerShapeData(SeekerGroupList);
    
    var LabyrinthSeekerShapeWidth = Labyrinth_ScaleConvert(SeekerShapeWidth,SeekerWidth);
    var LabyrinthSeekerShapeHeight = Labyrinth_ScaleConvert(SeekerShapeHeight,SeekerHeight);
    
    if (Game_LabyrinthConstraints)
    {
      Labyrinth.ConstraintX1 = Labyrinth_ScaleConvert(Game_LabyrinthConstraints.X1,SeekerWidth);
      Labyrinth.ConstraintX2 = Labyrinth_ScaleConvert(Game_LabyrinthConstraints.X2,SeekerWidth);
      Labyrinth.ConstraintY1 = Labyrinth_ScaleConvert(Game_LabyrinthConstraints.Y1,SeekerHeight);
      Labyrinth.ConstraintY2 = Labyrinth_ScaleConvert(Game_LabyrinthConstraints.Y2,SeekerHeight);
    }
    else
    {
      Labyrinth.ConstraintX1 = 0;
      Labyrinth.ConstraintX2 = Labyrinth.Width;
      Labyrinth.ConstraintY1 = 0;
      Labyrinth.ConstraintY2 = Labyrinth.Height;
    }
    
    // LabyrinthSeekerShape contains a version of the seeker group in an Labyrinth array format.
    // LabyrinthSeekerShapeWidth and LabyrinthSeekerShapeHeight contain the dimensions of LabyrinthSeekerShape.
    var LabyrinthSeekerShape = SeekerShape_Generate(SeekerShapeList,SeekerWidth,SeekerHeight,LabyrinthSeekerShapeWidth,LabyrinthSeekerShapeHeight,SeekerMinX,SeekerMinY);
    
    Seeker.CalculatingSmartPath     = false;
    Seeker.LastSmartTargetLeg       = false;
    
    if (g_SpritesWithSmartTarget[Seeker.Id])
    {
      delete g_SpritesWithSmartTarget[Seeker.Id];
    }
    
    if (!Seeker.RecalculateOnEnd)
    {
      Seeker.LastBouncedSprite      = null;
      Seeker.TemporaryObstacles    = null;
    }
    
    Seeker.RecalculateOnEnd         = false;
    Seeker.SmartPathIterationObject = new Object();
    
    Seeker.SmartTarget = {
                          X:Target.X,
                          Y:Target.Y,
                          TargetSprite:(Target.isSprite)?Target:null
                         };
    
    if (Labyrinth)
    {
      Seeker.CalculatingSmartPath     = true;
      Seeker.SmartTargetTimeoutCount  = Seeker.SmartTargetSearchLimit;
      // If you add new properties here, remember to update SolveIterationObject_Clone().
      Seeker.SmartPathIterationObject['Labyrinth']  = Labyrinth;
      Seeker.SmartPathIterationObject['FirstStage'] = true;
      Seeker.SmartPathIterationObject['SeekerShape']  = LabyrinthSeekerShape;
      Seeker.SmartPathIterationObject['SeekerShapeWidth']  = LabyrinthSeekerShapeWidth;
      Seeker.SmartPathIterationObject['SeekerShapeHeight'] = LabyrinthSeekerShapeHeight;
      Seeker.SmartPathIterationObject['HalfSeekerShapeWidth']  = Math.floor(LabyrinthSeekerShapeWidth * 0.5); // Using Math.floor() instead of Math.round() is okay and required here.
      Seeker.SmartPathIterationObject['HalfSeekerShapeHeight'] = Math.floor(LabyrinthSeekerShapeHeight * 0.5);
      Seeker.SmartPathIterationObject['SeekerWidth']  = SeekerWidth;
      Seeker.SmartPathIterationObject['SeekerHeight'] = SeekerHeight;
      Seeker.SmartPathIterationObject['OriginX'] = Labyrinth_ScaleConvert(SeekerX,SeekerWidth);
      Seeker.SmartPathIterationObject['OriginY'] = Labyrinth_ScaleConvert(SeekerY,SeekerHeight);
      Seeker.SmartPathIterationObject['TargetX'] = Labyrinth_ScaleConvert(Target.X,SeekerWidth);
      Seeker.SmartPathIterationObject['TargetY'] = Labyrinth_ScaleConvert(Target.Y,SeekerHeight);
      Seeker.SmartPathIterationObject['VisionX'] = Math.round(Labyrinth.Width * Seeker.SmartTargetVision * 0.01);
      Seeker.SmartPathIterationObject['VisionY'] = Math.round(Labyrinth.Height * Seeker.SmartTargetVision * 0.01);
      Seeker.SmartPathIterationObject['Recalculate'] = false;
      
      Seeker.SameBounceCount       = 0;
      
      g_SpritesWithSmartTarget[Seeker.Id] = Seeker;
    }
  }
}

function SolveIterationObject_Clone(IterationObject)
{
  var ClonedInterationObject = null;
  
  if (IterationObject)
  {
    ClonedInterationObject = new Object();
    
    ClonedInterationObject.TargetAchieved = IterationObject.TargetAchieved;
    ClonedInterationObject.FinishedCalculating = IterationObject.FinishedCalculating;
    ClonedInterationObject.RecalculateOnEnd    = IterationObject.RecalculateOnEnd;
    ClonedInterationObject.Distance       = IterationObject.Distance;
    ClonedInterationObject.Steps          = IterationObject.Steps;
    ClonedInterationObject.LastSpot       = IterationObject.LastSpot;
    ClonedInterationObject.PreviousPreferenceLeft  = IterationObject.PreviousPreferenceLeft;
    ClonedInterationObject.PreviousPreferenceRight = IterationObject.PreviousPreferenceRight;
    ClonedInterationObject.SeekerShape    = IterationObject.SeekerShape;  // No need to clone.  This array is never touched except during generation.
    ClonedInterationObject.SeekerWidth    = IterationObject.SeekerWidth;
    ClonedInterationObject.SeekerHeight   = IterationObject.SeekerHeight;
    ClonedInterationObject.HalfSeekerShapeWidth  = IterationObject.HalfSeekerShapeWidth;
    ClonedInterationObject.HalfSeekerShapeHeight = IterationObject.HalfSeekerShapeHeight;
    ClonedInterationObject.SeekerShapeWidth  = IterationObject.SeekerShapeWidth;
    ClonedInterationObject.SeekerShapeHeight = IterationObject.SeekerShapeHeight;
    ClonedInterationObject.FirstStage     = IterationObject.FirstStage;
    ClonedInterationObject.OriginX        = IterationObject.OriginX;
    ClonedInterationObject.OriginY        = IterationObject.OriginY;
    ClonedInterationObject.VisionX        = IterationObject.VisionX;
    ClonedInterationObject.VisionY        = IterationObject.VisionY;
        
    ClonedInterationObject.TestSeekPath   = null;
    if (IterationObject.TestSeekPath)
    {
      ClonedInterationObject.TestSeekPath = CloneLabyrinthSeekPath(IterationObject.TestSeekPath);
    }
    
    ClonedInterationObject.PreviousNode   = null;
    if (IterationObject.PreviousNode)
    {
      ClonedInterationObject.PreviousNode = CloneLabyrinthNode(IterationObject.PreviousNode);
    }
    
    ClonedInterationObject.CurrentNode   = null;
    if (IterationObject.CurrentNode)
    {
      ClonedInterationObject.CurrentNode   = CloneLabyrinthNode(IterationObject.CurrentNode);
    }
    
    ClonedInterationObject.TargetX         = IterationObject.TargetX;
    ClonedInterationObject.TargetY         = IterationObject.TargetY;
    
    ClonedInterationObject.Labyrinth        = null;
    if (IterationObject.Labyrinth)
    {
      ClonedInterationObject.Labyrinth      = {
                                                Width:   IterationObject.Labyrinth.Width,
                                                Height:  IterationObject.Labyrinth.Height
                                              };
                                              
      ClonedInterationObject.Labyrinth.Matrix = null;
      if (IterationObject.Labyrinth.Matrix)
      {
        ClonedInterationObject.Labyrinth.Matrix = IterationObject.Labyrinth.Matrix; // No need to clone.  This array is never touched except during generation.
      }
    }

    ClonedInterationObject.COIterationObject = null;
    if (IterationObject.COIterationObject)
    {
      ClonedInterationObject.COIterationObject =  {
                                      Stage:               IterationObject.COIterationObject.Stage,
                                      PreviousPos:         IterationObject.COIterationObject.PreviousPos,
                                      SecondPreviousPos:   IterationObject.COIterationObject.SecondPreviousPos,
                                      ReLoop:              IterationObject.COIterationObject.ReLoop,
                                      Distance:            IterationObject.COIterationObject.Distance,
                                      FinishedCalculating: IterationObject.COIterationObject.FinishedCalculating,
                                      LoopIndex:           IterationObject.COIterationObject.LoopIndex,
                                      LoopTakingPlace:     IterationObject.COIterationObject.LoopTakingPlace
                                                  };
                                                  
      ClonedInterationObject.COIterationObject.PreviousNode = null;
      if (IterationObject.COIterationObject.PreviousNode)
      {
        ClonedInterationObject.COIterationObject.PreviousNode = CloneLabyrinthNode(IterationObject.COIterationObject.PreviousNode);
      }
      
      ClonedInterationObject.COIterationObject.Solution = null;
      if (IterationObject.COIterationObject.Solution)
      {
        // No need to clone the Solution, since it references TestSeekPath anyway (which is cloned).
        ClonedInterationObject.COIterationObject.Solution = IterationObject.COIterationObject.Solution;
      }
      
      ClonedInterationObject.COIterationObject.CleanSolution = null;
      if (IterationObject.COIterationObject.CleanSolution)
      {
        // No need to clone CleanSolution, since it references TestSeekPath anyway (which is cloned).
        ClonedInterationObject.COIterationObject.CleanSolution = CloneLabyrinthSeekPath(IterationObject.COIterationObject.CleanSolution);
      }
    }
    
    ClonedInterationObject.CurrentNode   = null;
    if (IterationObject.CurrentNode)
    {
      ClonedInterationObject.CurrentNode   = CloneLabyrinthNode(IterationObject.CurrentNode);
    }
  }
  
  return ClonedInterationObject;
}

function CloneLabyrinthSeekPath(SeekPath)
{
  var ClonedLabyrinthSeekPath = null;
  
  if (SeekPath)
  {
    ClonedLabyrinthSeekPath = new Array();
    for (var i in SeekPath)
    {
      ClonedLabyrinthSeekPath[i] = CloneLabyrinthNode(SeekPath[i]);
    }
  }
  
  return ClonedLabyrinthSeekPath;
}

function CloneLabyrinthNode(LabyrinthNode)
{
  var ClonedLabyrinthNode = null;
  
  if (LabyrinthNode)
  {
    ClonedLabyrinthNode = {
                           X:                   LabyrinthNode.X,
                           Y:                   LabyrinthNode.Y,
                           Left:                LabyrinthNode.Left,
                           Right:               LabyrinthNode.Right,
                           Up:                  LabyrinthNode.Up,
                           Down:                LabyrinthNode.Down,
                           AllPreviousExplored: LabyrinthNode.AllPreviousExplored,
                           Deleted:             LabyrinthNode.Deleted
                          };
  }
  
  return ClonedLabyrinthNode;
}

function Labyrinth_ExtractObstacleData(SpritePool,ExcludeList,ExcludeTypeList,AdditionalObstacles)
{
  var ObstacleList = new Array();
  
  for (var i in SpritePool)
  {
    if (SpritePool[i])
    {
      var IncludeIt = true;
      
      if (SpritePool[i].TextBubble)
      {
        IncludeIt = false;
      }
      
      if (ExcludeList && IncludeIt)
      {
        for (var j in ExcludeList)
        {
          if (SpritePool[i].Id == ExcludeList[j])
          {
            IncludeIt = false;
            break;
          }
        }
      }
      
      if (ExcludeTypeList && IncludeIt)
      {
        for (var j in ExcludeTypeList)
        {
          if (SpritePool[i].Type == ExcludeTypeList[j])
          {
            IncludeIt = false;
            break;
          }
        }
      }
      
      if (AdditionalObstacles && !IncludeIt)
      {
        for (var j in AdditionalObstacles)
        {
          if (SpritePool[i].Id == AdditionalObstacles[j])
            {
            IncludeIt = true;
            break;
          }
        }
      }
      
      if (IncludeIt)
      {
        ObstacleList.push(
                          {
                            X:SpritePool[i].X,
                            Y:SpritePool[i].Y,
                            RealImageWidth:SpritePool[i].RealImageWidth,
                            RealImageHeight:SpritePool[i].RealImageHeight
                          }
                         );
      }
    }
  }
  
  return ObstacleList;
}

function Labyrinth_ExtractSeekerShapeData(SpritePool)
{
  var SeekerShapeList = new Array();
  
  for (var i in SpritePool)
  {
    if (SpritePool[i])
    {
      SeekerShapeList.push(
                        {
                          X:SpritePool[i].X,
                          Y:SpritePool[i].Y,
                          RealImageWidth:SpritePool[i].RealImageWidth,
                          RealImageHeight:SpritePool[i].RealImageHeight
                        }
                      );
    }
  }
  
  return SeekerShapeList;
}

// Similar to Labyrinth_Generate().
function SeekerShape_Generate(SeekerShapeList,SeekerWidth,SeekerHeight,SeekerShapeWidth,SeekerShapeHeight,SeekerShapeMinX,SeekerShapeMinY)
{
  var LabyrinthSeekerShape = new Array();
  for (var i = 0;i < SeekerShapeWidth;i++)
  {
    var Row = new Array();
    for (var j = 0;j < SeekerShapeHeight;j++)
    {
      Row.push(0);
    }
    
    LabyrinthSeekerShape.push(Row);
  }
  
  for (var i in SeekerShapeList)
  {
    var ThisSprite = SeekerShapeList[i];
    
    if (ThisSprite)
    {
      var StartX = Labyrinth_ScaleConvert(ThisSprite.X - SeekerShapeMinX,SeekerWidth);
      var StartY = Labyrinth_ScaleConvert(ThisSprite.Y - SeekerShapeMinY,SeekerHeight);
      var Width  = Labyrinth_ScaleConvert(ThisSprite.RealImageWidth,SeekerWidth);
      var Height = Labyrinth_ScaleConvert(ThisSprite.RealImageHeight,SeekerHeight);
      
      for (var pY = StartY;pY<=StartY+Height;pY++)
      {
        for (var pX = StartX;pX<=StartX+Width;pX++)
        {
          if (LabyrinthSeekerShape[pY])
          {
            if ((pX<SeekerShapeHeight) && (pY<SeekerShapeWidth))
            {
              LabyrinthSeekerShape[pY][pX] = 1;
            }
          }
        }
      }
    }
  }
  
  return LabyrinthSeekerShape;
}

function TargetPath_GetNodeSprite(TargetPathNode)
{
  var NodeSprite       = null;
  var NodeSpriteIndex  = g_SpriteIdPool[TargetPathNode.Id];
  
  if (NodeSpriteIndex != undefined)
  {
    NodeSprite = g_SpritePool[NodeSpriteIndex];
  }
  
  return NodeSprite;
}

function HandleLoading(IsSound,IsError)
{
  if (IsSound)
  {
    if (IsError)
    {
      // The current implementation doesn't make use of this section of the code, but it's left here
      // anyway just in case things change in the future.
      g_SoundsToLoadAtStart--;
      g_SndLoadingErrorsOccurred = true;
    }
    else
    {
      g_TotalSoundsLoaded++;
    }
  }
  else
  {
    if (IsError)
    {
      g_ObjectsToLoadAtStart--;
      g_LoadingErrorsOccurred = true;
    }
    else
    {
      g_TotalObjectsLoaded++;
    }
  }
  
  var Progress = parseInt(g_TotalObjectsLoaded)   + parseInt(g_TotalSoundsLoaded);
  var Total    = parseInt(g_ObjectsToLoadAtStart) + parseInt(g_SoundsToLoadAtStart);
  
  if (Total != 0)
  {
    var PercentageValue = Math.round((Progress * 100) / Total);
    var ProgressBar = document.getElementById('id_div_loadingprogress_bar');
    
    if (ProgressBar)
    {
      ProgressBar.style.width = PercentageValue + '%';
    }
  }
  
  if (
      (g_TotalObjectsLoaded > 0) && 
      (!g_AtLeastOneSoundToLoad || (g_TotalSoundsLoaded > 0) || g_SndLoadingErrorsOccurred) && 
      (g_ObjectsToLoadAtStart == g_TotalObjectsLoaded) && 
      (g_SoundsToLoadAtStart  == g_TotalSoundsLoaded)
     )
  {
    // Uncomment these lines to debug issues with assets loading.
    /*
    if (g_SndLoadingErrorsOccurred && !g_LoadingErrorsOccurred)
    {
      document.getElementById('id_div_loading_snderror').className = 'loading_error div_shown';
    }
    else if (g_LoadingErrorsOccurred)
    {
      document.getElementById('id_div_loading_error').className = 'loading_error div_shown';
    }
    else
    */
    {
      ShowApplicationAfterLoading();
    }
  }
  
  return true;
}

function ShowApplicationAfterLoading()
{
  document.getElementById('id_div_loading').className = 'div_hidden';
  PerformAfterLoadingTasks();
}

// These tasks must be performed after the main screen is shown to the user, becasuse
// they involve the use of the getDimensions() function, which returns accurate values
// only when the elements it measures are shown.
// (This is a Firefox issue.  With other browsers, getDimensions() return accurate data
// no matter the state of visibility of the measured elements).
function PerformAfterLoadingTasks()
{
  Game_Init();
}

function Sprite_StartRendering(KickstartTimer)
{
  TimeLine_SpritePlay(true);
  
  if (KickstartTimer)
  {
    g_TimerCounter_Object = window.setTimeout(SpriteHandler,g_Timer_TimeOut);
  }
}

function SetAnimationFPS(FramesPerSecond)
{
  if (FramesPerSecond == 0)
  {
    g_FramesPerSecond = gc_InitialFramesPerSecond;
  }
  else if (FramesPerSecond < 0)
  {
    FramesPerSecond = 1;
  }
  else if (FramesPerSecond > 100)
  {
    FramesPerSecond = 100;
  }
  else
  {
    // NaN?
    g_FramesPerSecond = gc_InitialFramesPerSecond;
  }
  
  g_FramesPerSecond = FramesPerSecond;
  g_Timer_TimeOut   = 1000 / g_FramesPerSecond;
  g_NFramesOffCameraBeforeDestroying = g_FramesPerSecond * 2;
  
  Game_FramesPerSecondChanged();
}

function SelectSprite(ThisSprite,DoSelect)
{
  if (g_SelectedSprite)
  {
    g_SelectedSprite.isSelected = false;
  }
  
  if (DoSelect)
  {
    ThisSprite.isSelected = true;
    g_SelectedSprite = ThisSprite;
  }
  else
  {
    g_SelectedSprite = null;
  }
}

function StopAllSounds()
{
  for (var SoundName in Game_Sounds)
  {
    StopSound(SoundName);
  }
}

function SoundManager_Loaded()
{
  if (Game_Sounds)
  {
    for (var ThisSound in Game_Sounds)
    {
      soundManager.createSound(
                                {
                                  id     : Game_Sounds[ThisSound].id,
                                  url    : Game_Sounds[ThisSound].filename + '.mp3'
                                }
                              ).load();
    }
  }
}

function SoundPlay(SoundName)
{
  try
  {
    soundManager.play(SoundName);
  }
  catch (e)
  {
  }
}

function StopSound(SoundId)
{
  if (Game_Sounds[SoundId])
  {
    if (Game_Sounds[SoundId].player && Game_Sounds[SoundId].player.stop)
    {
      Game_Sounds[SoundId].player.stop();
    }
  }
}

function touchHandler(event)
{
  var touches = event.changedTouches,
      first = touches[0],
      type = '';
  
  switch(event.type)
  {
      case 'touchstart': type='mousedown'; event.preventDefault(); break;
      case 'touchmove':  type='mousemove'; event.preventDefault(); break;        
      case 'touchend':   type='mouseup'; break;
      default: return;
  }
      
  var simulatedEvent = document.createEvent('MouseEvent');
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
                            first.screenX, first.screenY,
                            first.clientX, first.clientY, false,
                            false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);
}

function CheckBackgroundMusic()
{
  if (g_BackgroundMusicCurrent)
  {
    var SystemTime = new Date().getTime();
	
    if (
  	   Game_Sounds[g_BackgroundMusicCurrent] && 
  	   (Game_Sounds[g_BackgroundMusicCurrent].duration >= 0) && 
  	   (SystemTime > (g_BackgroundMusicInitTime + (Game_Sounds[g_BackgroundMusicCurrent].duration * 1000)))
  	  )
    {
	    StopSound(g_BackgroundMusicCurrent);
	    SoundPlay(g_BackgroundMusicCurrent);
	    g_BackgroundMusicInitTime = SystemTime;
    }
  }
}

function BackgroundMusicPlay(SoundId)
{
	if (Game_Sounds[SoundId])
	{
		g_BackgroundMusicInitTime = new Date().getTime();
		g_BackgroundMusicCurrent = SoundId;
		SoundPlay(g_BackgroundMusicCurrent);
	}
}

function BackgroundMusicStop()
{
	StopSound(g_BackgroundMusicCurrent);
	g_BackgroundMusicInitTime = -1;
	g_BackgroundMusicCurrent = null;
}

function LoadBackgroundImage(BackgroundImage)
{
	if (BackgroundImage != '')
	{
		g_SpriteDivMovieScreenFrame.style.backgroundImage  = 'url(' + BackgroundImage + ')';	
		g_SpriteDivMovieScreenFrame.style.backgroundRepeat  = 'no-repeat';
		g_BackgroundLoaded = true;
    }
	else
	{
		g_SpriteDivMovieScreenFrame.style.backgroundImage  = '';	
		g_BackgroundLoaded = false;
	}
}
