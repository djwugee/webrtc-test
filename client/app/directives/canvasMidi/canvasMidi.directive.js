'use strict';

angular.module('webrtcTestApp')
  .directive('canvasMidi', function ($log) {
    //constants
    var NOTE_HEIGHT=64;
    var NOTE_WIDTH=64;
    var VERTICAL_SCROLL_INCREMENT=1;
    var NUMBER_OF_DIFFERENT_NOTES=5;

    return {
      restrict: 'EA',
      link: function (scope, element) {
        //element.text('this is the canvasMidi directive');
        $log.info('loading canvas directive');


        //init images
        var redNote= new Image();
        var blueNote= new Image();
        var greenNote= new Image();
        var purpleNote= new Image();
        var yellowNote= new Image();
        redNote.src='assets/images/ic_action_record_red.png';
        blueNote.src='assets/images/ic_action_record_blue.png';
        greenNote.src='assets/images/ic_action_record_green.png';
        purpleNote.src='assets/images/ic_action_record_purple.png';
        yellowNote.src='assets/images/ic_action_record_yellow.png';

        var noteImages=[redNote,blueNote,greenNote,purpleNote,yellowNote];

        var canvas=element[0]; 
        var ctx=canvas.getContext('2d');
        $log.debug('Canvas context',ctx);
                

        // notes being rendered
        var notes=[];
        var notesCounter=0;
        var lastNote=0;


        // capture keyboard event
        window.addEventListener( "keypress", doKeyDown, false );

        element.bind('click',function(e){

          createMidiNote(lastNote);
          lastNote= (lastNote+1)%NUMBER_OF_DIFFERENT_NOTES;


        });


        /**
          * Creates a new note to be rendered scrolling down
         */
        function createMidiNote(noteIndex){
          //calculate iamge vars
          var image= noteImages[noteIndex];
          var left= noteIndex*NOTE_WIDTH+ NOTE_WIDTH/2;


          //create a new note
          var note= {
            id:notesCounter++,
            image:image,
            left: left,
            top:0
          };
          $log.debug('creating note',note);

          //push to current notes
          notes.push(note);

          //start render if is the first note
          if(notes.length==1){
            startRender();
          }
        }


        /**
         * Draws a frame. The idea is to traverse all the notes objects, scroll down n pixels or remove it if is on the bottom of the canvas.
         * IMPORTANT  !!! the top coordinate will be calculated with timestamps in future versions to sync all the notes!!!
         */
        function drawNoteFrame(){
          //first clear the canvas (we are rendering a new frame)
          ctx.clearRect(0,0,canvas.width, canvas.height);

          //for each note
          angular.forEach(notes,function(note, index){

            //update top to scroll down SEE IMPORTANT NOTE ABOVE!!!
            note.top=note.top+VERTICAL_SCROLL_INCREMENT;
            //$log.debug('update note '+note.id+', top='+note.top);

            //check if the note is out of bounds
            if(note.top + NOTE_HEIGHT >= canvas.height){
              //$log.debug('remove note '+note.id);

              //remove the note from notes
              notes.splice(index, 1);

            } else { 
              //draw the musical note
              //$log.debug('draw note '+note.id);
              ctx.drawImage(note.image,note.left,note.top);
    
            }

          });


          //if there are any note to draw
          if(notes.length>0){
            //continue the loop
            startRender();
          }

        }

        /**
         * Starts a render loop 
         */
        function startRender(){
          window.requestAnimationFrame(drawNoteFrame);
        }

        /**
          * capture a note (keyboard) event
          */
        function doKeyDown(event){
          var note= event.keyCode - 49; // 49 = key 1

          if(note>=1 && note <=5){
            createMidiNote(note);
          }
        }
      }
    };
  });