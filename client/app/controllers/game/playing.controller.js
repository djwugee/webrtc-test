'use strict';

angular.module('webrtcTestApp')
  .controller('PlayingCtrl', function ($rootScope,$scope,$log,$http,$audioService,$synthService,$replayerService) {
    $scope.globalScore = 0;
    //keep state of keys hold/down
    $scope.keysStatus = [];
    $scope.instrument1='instrument1';
    $scope.instrument2='instrument2';
    $scope.instrument3='instrument3';

    $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
      $log.debug('playing message received');
      var msgContent = JSON.parse(message.text);
      //calculate score async to prevent canvas to be interrupted
      setTimeout(function(){
          if ($rootScope.pMBreplayer.isANoteThere(msgContent.noteNumber + 96,msgContent.delta, 100, msgContent.playerId))
          {
            $scope.globalScore = $scope.globalScore + 1;
            $scope.$digest();          
          }
        },10);      
      var eventName='playmyband.canvas.usernote.instrument'+ msgContent.playerId;
      $rootScope.$broadcast(eventName, msgContent);
    });

    function getNoteFromKeyboard(event) {
      var keyID = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
      var note = keyID - 49; // 49 = key 1
      return note;
    }

    function doKeyDown(event){
        var keyCode = event.keyCode;
        if($scope.keysStatus[keyCode]){
          //ignore hold key
        } else {
          //this is first evet for this key, process
          $scope.keysStatus[keyCode] = new Date();
          var note = getNoteFromKeyboard(event);
          //$log.debug('onkeydown: ',event,note);
          if(note>=0 && note <=4){
            sendUserNote(note);
          }
        }      
    }

    function doKeyUp(event){
      $scope.keysStatus[event.keyCode] = false;
      var note = getNoteFromKeyboard(event);
      //$log.debug('onkeyup: ',event,note);
      if(note>=0 && note <=4){
        sendUserNoteRelease(note);
      }
    }

    function sendUserNote(note){
      var accumulatedNoteDelta = window.performance.now() - $rootScope.pMBplayingStartTimestamp;

      //calculate score async to prevent canvas to be interrupted
      setTimeout(function(){
          if ($rootScope.pMBreplayer.isANoteThere(note + 96,accumulatedNoteDelta, 100, $rootScope.pMBlocalPlayerId))
          {
            $scope.globalScore = $scope.globalScore + 1;
            $scope.$digest();          
          }
        },10); 

      var userInputMsg = {playerId:$rootScope.pMBlocalPlayerId, noteNumber: note, delta: accumulatedNoteDelta};
      $log.debug('Sending user note thorugh the wire', userInputMsg);
      setTimeout(function(){
        $rootScope.pMBplayers.forEach(function(entry) {
          $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(entry, JSON.stringify(userInputMsg));
        });
        },1);         
      var eventName='playmyband.canvas.usernote.instrument'+ $rootScope.pMBlocalPlayerId;
      //$log.debug('sending user note to user canvas '+eventName);
      $rootScope.$broadcast(eventName,note);
    }

    function sendUserNoteRelease(note){
      var eventName='playmyband.canvas.usernoterelease.instrument' + $rootScope.pMBlocalPlayerId;
      //$log.debug('sending release note to user canvas '+eventName);
      $rootScope.$broadcast(eventName,note);

    }


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
        $rootScope.pMBsongAudio = new Audio('./assets/midi/PearlJamBetterMan/guitar.ogg');
        $rootScope.pMBsongAudio.play();
        $rootScope.pMBplayingStartTimestamp = window.performance.now();
        },$rootScope.pMBsecondsInAdvance * 1000);  
    }

    playMidi();




    // capture keyboard event
    window.addEventListener( 'keydown', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
