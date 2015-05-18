'use strict';

angular.module('webrtcTestApp')
  .controller('CanvasCtrl', function ($rootScope,$scope,$log,midiService,$http) {
    $scope.message = 'Hello';
    $log.info('Loading canvas controller');

    $scope.idUserCanvas='mainPlayerCanvas';


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

    function sendUserNote(note){
        var eventName='user.note.event.'+$scope.idUserCanvas;
        //$log.debug('sending user note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);

    }

    function sendUserNoteRelease(note){
        var eventName='user.note.release.event.'+$scope.idUserCanvas;
        //$log.debug('sending release note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);

    }

    function sendNote(note){
      var eventName='midi.note.event.'+$scope.idUserCanvas;
      //$log.debug('sending midi note to user canvas '+eventName);
      
      $rootScope.$broadcast(eventName,note);
    }
    $rootScope.sendNote = sendNote;

    function cancelEvent(e){
      e.stopPropagation();
      e.preventDefault();
    }


    if(FileReader){
      document.addEventListener('dragenter', cancelEvent, false);
      document.addEventListener('dragover', cancelEvent, false);
      document.addEventListener('drop', function(e){
      cancelEvent(e);
      for(var i=0;i<e.dataTransfer.files.length;++i){
        var file = e.dataTransfer.files[i];
        if(file.type != 'audio/mid'){
          continue;
        }
        var reader = new FileReader();

        reader.onload = function(e){
          var data= e.target.result;

            $log.debug('loading demo from drop file');
            $log.debug(data);

          var midiFile = MidiFile(data);
          var synth = FretsSynth(44100);
          var replayer = Replayer(midiFile, synth, [1], [96, 100], $rootScope);
          var audio = AudioPlayer(replayer);
          var songAudio = new Audio('./assets/midi/bangbang/song.ogg');
          songAudio.play();
        };
        reader.readAsBinaryString(file);
      }
    }, false);
    };

    $scope.startDemo=function(){
        $log.debug('Iniciando midi de demo');

        // do the get request with response type "blobl" 
        $http.get('/assets/midi/bangbang/notes.mid',{responseType: "blob"}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $log.debug('loading demo from $http OK');
            $log.debug('data type: '+typeof data);
            $log.debug('data.byteLength '+data.byteLength)
            //$log.debug('data...');
            $log.debug(data);

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result;
              //console.log("File contents: " + contents);  

              var midiFile = MidiFile(contents);
              var synth = FretsSynth(44100);
              var replayer = Replayer(midiFile, synth, [1], [96, 100], $rootScope);
              var audio = AudioPlayer(replayer);             

            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('loading demo from $http KO',data,status,headers,config);
          });

    }        



    // capture keyboard event
    window.addEventListener( 'keypress', doKeyDown, false );
    window.addEventListener( 'keyup', doKeyUp, false );

  });
