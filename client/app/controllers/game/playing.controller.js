'use strict';

angular.module('webrtcTestApp')
  .controller('PlayingCtrl', function ($rootScope,$scope,$log,midiService,$http) {
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
        $log.debug('Iniciando midi de demo');

        // do the get request with response type "blobl" 
        $http.get($rootScope.songURL,{responseType: "blob"}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $log.debug('loading demo from $http OK');
            $log.debug('data type: '+typeof data);
            $log.debug('data.byteLength '+data.byteLength)

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result;
              //console.log("File contents: " + contents);  

              $rootScope.midiFile = MidiFile(contents);
              $rootScope.synth = FretsSynth(44100);
              $rootScope.replayer = Replayer($rootScope.midiFile, $rootScope.synth, $rootScope.difficultyLevel, $rootScope);
              $rootScope.audio = AudioPlayer($rootScope.replayer);

              $rootScope.songAudio = new Audio('./assets/midi/PearlJamBetterMan/guitar.ogg');
              $rootScope.songAudio.play();  
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('loading demo from $http KO',data,status,headers,config);
          });      
    }

    playMidi();




    // capture keyboard event
    window.addEventListener( 'keypress', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
