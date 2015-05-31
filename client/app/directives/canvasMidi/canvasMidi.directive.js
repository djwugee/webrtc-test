
(function(angular){

  'use strict';

  //constants
  var NOTE_HEIGHT=64;
  var NOTE_WIDTH=64;
  var VERTICAL_SCROLL_INCREMENT=1;
  var NUMBER_OF_DIFFERENT_NOTES=5;

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


  angular.module('webrtcTestApp')
    /**
      * Used by external resources. It draws n canvas to simulate n layers
      */
    .directive('canvasMidi', function ($log) {


      return {
        templateUrl: 'app/directives/canvasMidi/canvasMidiDirective.html',
        restrict: 'EA',
        scope:{
          canvasId:'=canvasMidi'
        },
        controller: function ($scope, $element, $attrs) {
          //element.text('this is the canvasMidi directive');
          $log.info('loading canvas directive');


          $scope.canvasHeight=$attrs.height;
          $scope.canvasWidth=$attrs.width;
        }
      };
    })
    /**
      * Parent for inner layers, it creates the notes context
      */
    .directive('canvasMidiMain', function ($rootScope,$log) {
      return{
        restrict: 'EA',
        scope:true,
        controller: function ($scope, $element, $attrs) {

          // notes being rendered
          $scope.notes=[];
          $scope.userNotes={};
          $scope.notesCounter=0;
          $scope.lastNote=0;

          /**
            * capture a note (keyboard) event
           */
          var eventName='user.note.event.'+$scope.canvasId;
          var releaseEventName='user.note.release.event.'+$scope.canvasId;
          var midiEventName='midi.note.event.'+$scope.canvasId;
          $log.debug('Register user note events for '+eventName);
          var _this=this;

          $rootScope.$on(eventName,function(event, note){
            $log.debug('new user note event',event,note);

            if(note>=0 && note <=4){
              //_this.createMidiNote(note);
              _this.createUserNote(note);
            }

          });

          $rootScope.$on(releaseEventName,function(event, note){
            $log.debug('new release user note event',event,note);

            if(note>=0 && note <=4){
              //_this.createMidiNote(note);
              _this.releaseUserNote(note);
            }

          });



          /**
            * capture midi event
            */

          $rootScope.$on(midiEventName,function(event, noteEvent){
            $log.debug('new midi note event',event,noteEvent);
            if(noteEvent.event.noteNumber>=0 && noteEvent.event.noteNumber <=4){
              _this.createMidiNote(noteEvent.event.noteNumber);
              //_this.releaseUserNote(note);
            }

          });


          /**
           * used to draw the horizontal line where the user notes are showed
           * @param canvas
           * @returns {number}
           */
          var horizontalUserCoord=($attrs.canvasMainHeight / 4) * 3;
          $log.debug('horizontalUserCoord: '+horizontalUserCoord);
          this.getUserTop= function() {

            return horizontalUserCoord;
          };

          /**
           * Creates a new user note
           */
          function notifyNewUserNoteToCanvas() {
            $rootScope.$broadcast('controller.userNote.event.' + $scope.canvasId);
          }

          this.createUserNote= function(noteIndex){
            //calculate iamge vars
            var image= noteImages[noteIndex];
            var left= noteIndex*NOTE_WIDTH+ NOTE_WIDTH/2;

            var top=_this.getUserTop()-(NOTE_HEIGHT/2);



            var note= {

              image:image,
              left: left,
              top:top
            };




            $log.debug('creating user note',note);

            //push to current notes (toggle)
            $scope.userNotes[noteIndex]=note;

            //send event to update canvas
            notifyNewUserNoteToCanvas();

          };
          this.releaseUserNote=function(noteIndex){
            //remove note from map
            $scope.userNotes[noteIndex]=undefined;

            //send event to update canvas
            notifyNewUserNoteToCanvas();
          };

          this.getUserNotes=function(){
            return $scope.userNotes;
          };

          /**
            * Creates a new note to be rendered scrolling down
           */
          this.createMidiNote=   function (noteIndex){
            //calculate iamge vars
            var image= noteImages[noteIndex];
            var left= noteIndex*NOTE_WIDTH+ NOTE_WIDTH/2;


            //create a new note
            var note= {
              id:$scope.notesCounter++,
              image:image,
              left: left,
              top:0
            };
            //$log.debug('creating midi note',note);

            //push to current notes
            $scope.notes.push(note);

            //start render if is the first note
            if($scope.notes.length===1){
              $rootScope.$broadcast('controller.note.event.'+$scope.canvasId);
            }
          };


        },link:function(scope, element,attrs,controller){
          /*
           * create random notes onclik
          */
          element.bind('click',function(){
            controller.createMidiNote(scope.lastNote);
            scope.lastNote= (scope.lastNote+1)%NUMBER_OF_DIFFERENT_NOTES;

          });

        }
      };
    })

    /**
      * Base layer, just draw the neck cords
      */
    .directive('canvasMidiBase',function($log){
      return{
        restrict:'EA',
        require:'^canvasMidiMain',
        link: function(scope,element,attrs,canvasMidiController){
          $log.info('loading canvas midi base layer directive');

          var canvas=element[0];
          var ctx=canvas.getContext('2d');

          ctx.clearRect(0,0,canvas.width, canvas.height);
          //ctx.beginPath();
          ctx.strokeStyle='#FFFFFF';
          ctx.fillStyle='#FFFFFF';

          var colWidth= canvas.width/6;
          var colOffset= colWidth/2;
          $log.debug('canvas.width: '+canvas.width+', colWidth: '+colWidth+', colOffset: '+colOffset);

          //ctx.fillRect(25,25,100,100);

          var i;
          for(i=1;i<=5;i++){
            var left= i*colWidth;
            var right= left;
            var top=0;
            var bottom=canvas.height;

            $log.debug('left: '+left+',right: '+right+', top: '+top+', bottom: '+bottom);

            ctx.beginPath();
            ctx.moveTo(left,top);
            ctx.lineTo(left,bottom);
            ctx.stroke();
            ctx.closePath();


          }

          ctx.beginPath();

          var hztalTop=canvasMidiController.getUserTop();
          $log.debug('drawing user horizontal line, top coord: '+hztalTop);
          ctx.moveTo(0,hztalTop);
          ctx.lineTo(canvas.width,hztalTop);
          ctx.stroke();
          ctx.closePath();


        }
      };
    })
    /**
      * Layer to draw notes from midi
      */
    .directive('canvasMidiNotes', function ($rootScope,$log) {
      return{
        restrict: 'EA',
        require:'^canvasMidiMain',
        scope:true,
        link: function (scope, element) {
          //element.text('this is the canvasMidi directive');
          $log.info('loading canvas notes directive');



          var canvas=element[0];
          var ctx=canvas.getContext('2d');
          var animationStartTime = 0;
          var msInASecond = 1000;
          var msInadvance = $rootScope.secondsInAdvance * msInASecond;
          //remove this duplicate calculation
          var horizontalUserCoord=(canvas.height/ 4) * 3;



          //capute new notes event
          var eventName='controller.note.event.'+scope.canvasId;
          $log.debug('Registering for new notes event '+'controller.note.event.'+scope.canvasId);
          $rootScope.$on(eventName,function(){
            startRender();
          });



          /**
           * Draws a frame. The idea is to traverse all the notes objects, scroll down n pixels or remove it if is on the bottom of the canvas.
           * IMPORTANT  !!! the top coordinate will be calculated with timestamps in future versions to sync all the notes!!!
           */
          function drawNoteFrame(renderTimeStamp){
            var elapsedTimeMS = renderTimeStamp - animationStartTime;
            var pixelsToMove = (elapsedTimeMS * horizontalUserCoord) / msInadvance;
            //first clear the canvas (we are rendering a new frame)
            ctx.clearRect(0,0,canvas.width, canvas.height);

            //for each note
            angular.forEach(scope.notes,function(note, index){

              //update top to scroll down SEE IMPORTANT NOTE ABOVE!!!
              note.top=note.top+pixelsToMove;
              //$log.debug('update note '+note.id+', top='+note.top);

              //check if the note is out of bounds
              if(note.top + NOTE_HEIGHT >= canvas.height){
                //$log.debug('remove note '+note.id);

                //remove the note from notes
                scope.notes.splice(index, 1);

              } else {
                //draw the musical note
                //$log.debug('draw note '+note.id);
                ctx.drawImage(note.image,note.left,note.top);

              }

            });


            //if there are any note to draw
            if(scope.notes.length>0){
              //continue the loop
              startRender();
            }

          }

          /**
           * Starts a render loop
           */
          function startRender(){
            animationStartTime = window.performance.now();
            window.requestAnimationFrame(drawNoteFrame);
          }

        }
      };
    })
  /**
   * Renders the notes pressed by the user
   */
    .directive('canvasMidiUser', function ($rootScope,$log) {
      return {
        restrict: 'EA',
        require:'^canvasMidiMain',
        scope: true,
        link: function (scope, element,attrs,canvasMidiController) {
          //element.text('this is the canvasMidi directive');
          $log.info('loading canvas user notes directive');

          var eventName='controller.userNote.event.'+scope.canvasId;
          $log.debug('Registering for new user notes event '+'controller.userNote.event.'+scope.canvasId);
          $rootScope.$on(eventName,function(){
            renderUserNotes();
          });

          var canvas=element[0];
          var ctx=canvas.getContext('2d');


          function renderUserNotes(){
            //first clear the canvas (we are rendering a new frame)
            ctx.clearRect(0,0,canvas.width, canvas.height);
            //for each user note
            var userNotes=canvasMidiController.getUserNotes();
            angular.forEach(userNotes,function(note){
              if(note){
                ctx.drawImage(note.image,note.left,note.top);
              }
            });

          }
        }
      };
    });



})(angular);

