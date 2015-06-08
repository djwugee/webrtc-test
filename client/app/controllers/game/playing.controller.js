'use strict';

angular.module('webrtcTestApp')
  .controller('PlayingCtrl', function ($rootScope,$scope,$log,$http,$audioService,$synthService,$replayerService) {
    $scope.globalScore = 0;
    $log.info('Loading canvas controller');

    $scope.idUserCanvas='mainPlayerCanvas';
    $scope.idOtherUserCanvas='otherPlayerCanvas';
    $scope.idThirdUserCanvas='idThirdUserCanvas';
    //register all ids
    $scope.canvasIds=[$scope.idUserCanvas,$scope.idOtherUserCanvas,$scope.idThirdUserCanvas];

    $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
      $log.debug('playing message received');
      var msgContent = JSON.parse(message.text);
      var eventName='user.note.event.'+ msgContent.playerId;
      $rootScope.$broadcast(eventName, msgContent);
    });

    function getNoteFromKeyboard(event) {
      var keyID = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
      var note = keyID - 49; // 49 = key 1
      return note;
    }

    function doKeyDown(event){
      var note = getNoteFromKeyboard(event);
      //$log.debug('onkeydown: ',event,note);
      if(note>=0 && note <=4){
        sendUserNote(note);
      } else if (note>=5 && note <=10){
        note= note-5;
        sendNote(note);
      }


    }

    function doKeyUp(event){
      var note = getNoteFromKeyboard(event);
      //$log.debug('onkeyup: ',event,note);
      if(note>=0 && note <=4){
        sendUserNoteRelease(note);
      }
    }

    function sendUserNote(note, canvasId){
      var accumulatedNoteDelta = window.performance.now() - $scope.$parent.playingStartTimestamp;      
      if ($scope.$parent.replayer.isANoteThere(note + 96,accumulatedNoteDelta, 100, 1))
      {
        $scope.globalScore = $scope.globalScore + 1;
        $scope.$digest();          
      }
      canvasId = canvasId || $scope.idUserCanvas;
      var userInputMsg = {localPlayerId:$scope.$parent.localPlayerId, noteNumber: note};
      $log.debug('Sending user note thorugh the wire', userInputMsg);
      $scope.$parent.telScaleWebRTCPhoneController.sendDataMessage($scope.$parent.remotePlayerName, JSON.stringify(userInputMsg));        
      var eventName='user.note.event.'+ canvasId;
      //$log.debug('sending user note to user canvas '+eventName);
      $rootScope.$broadcast(eventName,note);
    }

    function sendUserNoteRelease(note){
        var eventName='user.note.release.event.'+$scope.idUserCanvas;
        //$log.debug('sending release note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);

    }


    $rootScope.$on('playmyband.midi.noteEvent',function(event, noteEvent){
      var normalizedNote = noteEvent.event.noteNumber - $scope.$parent.difficultyLevel[0];
      noteEvent.event.noteNumber = normalizedNote;


      //if note track is between 1 and 3
      if(noteEvent.track>=1 && noteEvent.track<=3){
        var canvasIdIndex= noteEvent.track-1;
        var eventName='midi.note.event.'+$scope.canvasIds[canvasIdIndex];

        //send event
        $rootScope.$broadcast(eventName,noteEvent);        

      }

    });        

    function playMidi() {
      $scope.$parent.synth = new $synthService.FretsSynth(44100);
      $scope.$parent.replayer = new $replayerService.Replayer($scope.$parent.midiFile, $scope.$parent.synth);
      $scope.$parent.audio = new $audioService.AudioPlayer($scope.$parent.replayer);
      

      //start the sound later, this must be sync with midi and note rendering
      setTimeout(function(){
        $scope.$parent.songAudio = new Audio('./assets/midi/PearlJamBetterMan/guitar.ogg');
        $scope.$parent.songAudio.play();
        $scope.$parent.playingStartTimestamp = window.performance.now();
        },$scope.$parent.secondsInAdvance * 1000);  
    }

    playMidi();




    // capture keyboard event
    window.addEventListener( 'keypress', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
