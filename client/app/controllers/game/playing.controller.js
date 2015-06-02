'use strict';

angular.module('webrtcTestApp')
  .controller('PlayingCtrl', function ($rootScope,$scope,$log,midiService,$http) {
    $scope.globalScore = 0;
    $scope.message = 'Hello';
    $log.info('Loading canvas controller');

    $scope.idUserCanvas='mainPlayerCanvas';
    $scope.idOtherUserCanvas='otherPlayerCanvas';
    $scope.idThirdUserCanvas='idThirdUserCanvas';

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
        canvasId = canvasId || $scope.idUserCanvas;
        var eventName='user.note.event.'+ canvasId;
        //$log.debug('sending user note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);

    }

    function sendUserNoteRelease(note){
        var eventName='user.note.release.event.'+$scope.idUserCanvas;
        //$log.debug('sending release note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);

    }

    function sendNote(noteEvent){
      var normalizedNote = noteEvent.event.noteNumber - $rootScope.difficultyLevel[0];
      noteEvent.event.noteNumber = normalizedNote;
      if (noteEvent.track == 1) {
        var eventName='midi.note.event.'+$scope.idUserCanvas;
        $log.debug('sending midi note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,noteEvent);        
      } else if (noteEvent.track == 2)
      {
        var eventName='midi.note.event.'+$scope.idOtherUserCanvas;
        $log.debug('sending midi note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,noteEvent);        

      } else if (noteEvent.track == 3)
      {
        var eventName='midi.note.event.'+$scope.idThirdUserCanvas;
        $log.debug('sending midi note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,noteEvent);        

      }

    }
    $rootScope.sendNote = sendNote;

    function cancelEvent(e){
      e.stopPropagation();
      e.preventDefault();
    }

    $scope.startDemo=function(){

    }        

    function playMidi()
    {
      $rootScope.synth = FretsSynth(44100);
      $rootScope.replayer = Replayer($rootScope.midiFile, $rootScope.synth, $rootScope);
      $rootScope.audio = AudioPlayer($rootScope.replayer);
      $rootScope.playingStartTimestamp = window.performance.now();

      //start the sound later, this must be sync with midi and note rendering
      setTimeout(function(){
        $rootScope.songAudio = new Audio('./assets/midi/PearlJamBetterMan/guitar.ogg');
        $rootScope.songAudio.play();
        },$rootScope.secondsInAdvance * 1000);  
    }

    playMidi();




    // capture keyboard event
    window.addEventListener( 'keypress', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
