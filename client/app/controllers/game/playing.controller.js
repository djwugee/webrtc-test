'use strict';

angular.module('webrtcTestApp')
  .controller('PlayingCtrl', function ($rootScope,$scope,$log,$http,$audioService,$synthService,$replayerService) {
    $scope.globalScore = 0;
    //keep state of keys hold/down
    $scope.keysStatus = [];
    $scope.instrument1='instrument1';
    $scope.instrument2='instrument2';
    $scope.instrument3='instrument3';

    $rootScope.$on('playmyband.webrtc.data.message.received',function(event, message){
      $log.debug('playing message received');
      var msgContent = JSON.parse(message.content);
      //calculate score async to prevent canvas to be interrupted
      $rootScope.$broadcast('playmyband.user.' + msgContent.noteAction,
        msgContent.noteNumber, msgContent.delta, msgContent.playerId);

    });    

    function getNoteFromKeyboard(event) {
      var keyID = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
      var note = keyID - 49; // 49 = key 1
      return note;
    }

    function doKeyDown(event){
        //take time as soon as possible to reduce any delay
        var accumulatedNoteDelta = window.performance.now() - $rootScope.pMBplayingStartTimestamp;
        var keyCode = event.keyCode;
        if($scope.keysStatus[keyCode]){
          //ignore hold key
        } else {
          //this is first evet for this key, process
          $scope.keysStatus[keyCode] = new Date();
          var note = getNoteFromKeyboard(event);
          //$log.debug('onkeydown: ',event,note);
          if(note>=0 && note <=4){
            $rootScope.$broadcast('playmyband.user.noteDown',note, accumulatedNoteDelta, $rootScope.pMBlocalPlayerId);
            sendNoteRemotely(note, accumulatedNoteDelta, 'noteDown');
          }
        }      
    }

    function doKeyUp(event){
      var accumulatedNoteDelta = window.performance.now() - $rootScope.pMBplayingStartTimestamp;      
      $scope.keysStatus[event.keyCode] = false;
      var note = getNoteFromKeyboard(event);
      //$log.debug('onkeyup: ',event,note);
      if(note>=0 && note <=4){
        $rootScope.$broadcast('playmyband.user.noteUp',note, accumulatedNoteDelta, $rootScope.pMBlocalPlayerId);
        sendNoteRemotely(note, accumulatedNoteDelta, 'noteUp');
      }
    }

    function sendNoteRemotely(note, accumulatedNoteDelta,nAction)
    {
      var userInputMsg = {playerId:$rootScope.pMBlocalPlayerId, noteNumber: note, delta: accumulatedNoteDelta,noteAction:nAction};
      $log.debug('Sending user note thorugh the wire', userInputMsg);
      setTimeout(function(){
          $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(userInputMsg));
        },1);       
    }

    $rootScope.$on('playmyband.user.noteUp',function(event, note, accumulatedNoteDelta, playerId){

        
      var eventName='playmyband.canvas.usernoterelease.instrument'+ playerId;
      //$log.debug('sending user note to user canvas '+eventName);
      $rootScope.$broadcast(eventName,note);
    });    

    $rootScope.$on('playmyband.user.noteDown',function(event, note, accumulatedNoteDelta, playerId){

      //calculate score async to prevent canvas to be interrupted
      setTimeout(function(){
          if ($rootScope.pMBreplayer.isANoteThere(note + $rootScope.pMBdifficultyLevel[0],
            accumulatedNoteDelta, $rootScope.pMBnoteErrorMarginMS, playerId))
          {
            $scope.globalScore = $scope.globalScore + 1;
            $scope.$digest();          
          }
        },1); 

        
      var eventName='playmyband.canvas.usernote.instrument'+ playerId;
      //$log.debug('sending user note to user canvas '+eventName);
      $rootScope.$broadcast(eventName,note);
    });


    $rootScope.$on('playmyband.midi.noteEvent',function(event, noteEvent){
      var normalizedNote = noteEvent.event.noteNumber - $rootScope.pMBdifficultyLevel[0];
      noteEvent.event.noteNumber = normalizedNote;


      //if note track is between 1 and 3
      if(noteEvent.track>=1 && noteEvent.track<=3){
        var eventName='playmyband.canvas.midinote.instrument'+ noteEvent.track;

        //send event
        $rootScope.$broadcast(eventName,noteEvent);        

      }

    });        

    function playMidi() {
      $rootScope.pMBsynth = new $synthService.FretsSynth(44100);
      $rootScope.pMBreplayer = new $replayerService.Replayer($rootScope.pMBmidiFile, $rootScope.pMBsynth);
      $rootScope.pMBaudio = new $audioService.AudioPlayer($rootScope.pMBreplayer);
      

      //start the sound later, this must be sync with midi and note rendering
      setTimeout(function(){
        $rootScope.pMBsongAudio = new Audio($rootScope.pMBsongURL);
        $rootScope.pMBsongAudio.play();
        $rootScope.pMBplayingStartTimestamp = window.performance.now();
        },$rootScope.pMBsecondsInAdvance * 1000);  
    }

    playMidi();




    // capture keyboard event
    window.addEventListener( 'keydown', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
