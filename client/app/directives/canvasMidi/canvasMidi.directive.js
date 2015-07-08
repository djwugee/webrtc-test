(function (angular) {

    'use strict';

    //constants
    var NOTE_HEIGHT = 64;
    var NOTE_WIDTH = 64;
    var NOTE_RADIUS = 15;
    var LINE_WIDTH = 6;
    //var VERTICAL_SCROLL_INCREMENT=1;
    var NUMBER_OF_DIFFERENT_NOTES = 5;
    var PIXELS_PER_MILLISECOND = NOTE_HEIGHT / 500;

    //init images
    var guitarTextureImage = new Image();
    guitarTextureImage.src = 'assets/images/guitar_texture.jpg';

    var redNote = new Image();
    var blueNote = new Image();
    var greenNote = new Image();
    var purpleNote = new Image();
    var yellowNote = new Image();
    redNote.src = 'assets/images/ic_action_record_dark_red.png';
    blueNote.src = 'assets/images/ic_action_record_dark_blue.png';
    greenNote.src = 'assets/images/ic_action_record_dark_green.png';
    purpleNote.src = 'assets/images/ic_action_record_dark_purple.png';
    yellowNote.src = 'assets/images/ic_action_record_dark_yellow.png';

    var userRedNote = new Image();
    var userBlueNote = new Image();
    var userGreenNote = new Image();
    var userPurpleNote = new Image();
    var userYellowNote = new Image();

    userRedNote.src = 'assets/images/ic_action_record_red.png';
    userBlueNote.src = 'assets/images/ic_action_record_blue.png';
    userGreenNote.src = 'assets/images/ic_action_record_green.png';
    userPurpleNote.src = 'assets/images/ic_action_record_purple.png';
    userYellowNote.src = 'assets/images/ic_action_record_yellow.png';


    var noteImages = [redNote, blueNote, greenNote, purpleNote, yellowNote];
    var userNoteImages = [userRedNote, userBlueNote, userGreenNote, userPurpleNote, userYellowNote];
    var noteColors = ['red', 'blue', 'green', 'purple', 'yellow'];


    angular.module('webrtcTestApp')
            /**
             * Used by external resources. It draws n canvas to simulate n layers
             */
            .directive('canvasMidi', function ($log) {


                return {
                    templateUrl: 'app/directives/canvasMidi/canvasMidiDirective.html',
                    restrict: 'EA',
                    scope: {
                        canvasId: '=canvasMidi',
                        audio: '=canvasMidiAudio',
                        debug: '=canvasMidiDebug',
                        deltaZeroMidi: '=canvasMidiDeltaZero',
                        songDelay: '=canvasSongDelay'
                    },
                    controller: function ($scope, $element, $attrs) {
                        //element.text('this is the canvasMidi directive');
                        $log.info('loading canvas directive');


                        $scope.canvasHeight = $attrs.height;
                        $scope.canvasWidth = $attrs.width;
                    }
                };
            })
            /**
             * Parent for inner layers, it creates the notes context
             */
            .directive('canvasMidiMain', function ($rootScope, $log) {
                return{
                    restrict: 'EA',
                    scope: true,
                    controller: function ($scope, $element, $attrs) {

                        // notes being rendered
                        $scope.notes = new Array(NUMBER_OF_DIFFERENT_NOTES);
                        $scope.offNotes = new Array(NUMBER_OF_DIFFERENT_NOTES);
                        for (var i = 0; i < NUMBER_OF_DIFFERENT_NOTES; i++)
                        {
                            $scope.notes[i] = [];
                            $scope.offNotes[i] = [];
                        }
                        $scope.notesCounter = 0;
                        $scope.userNotes = {};
                        $scope.lastNote = 0;

                        /**
                         * capture a note (keyboard) event
                         */
                        var eventName = 'playmyband.canvas.usernote.' + $scope.canvasId;
                        var releaseEventName = 'playmyband.canvas.usernoterelease.' + $scope.canvasId;
                        var midiEventName = 'playmyband.canvas.midinote.' + $scope.canvasId;
                        var midiOffEventName = 'playmyband.canvas.midinoteoff.' + $scope.canvasId;
                        $log.debug('Register user note events for ' + eventName);
                        var _this = this;

                        $rootScope.$on(eventName, function (event, note) {
                            //$log.debug('new user note event', event, note);

                            if (note >= 0 && note <= 4) {
                                //_this.createMidiNote(note);
                                _this.createUserNote(note);
                            }

                        });

                        $rootScope.$on(releaseEventName, function (event, note) {
                            //$log.debug('new release user note event', event, note);

                            if (note >= 0 && note <= 4) {
                                //_this.createMidiNote(note);
                                _this.releaseUserNote(note);
                            }

                        });

                        /**
                         * capture midi event
                         */
                        $rootScope.$on(midiEventName, function (event, noteEvent) {
                            //$log.debug('New note',$scope.canvasId, noteEvent.event.noteNumber, noteEvent.event);
                            _this.createMidiNote(noteEvent.event, noteImages);
                        });

                        /**
                         * capture midi note offevent
                         */
                        $rootScope.$on(midiOffEventName, function (event, noteEvent) {
                            //populate parallel array with noteOff event, so we can draw the line later
                            //$log.debug('New noteoff',$scope.canvasId, noteEvent.event.noteNumber, noteEvent.event);
                            $scope.offNotes[noteEvent.event.noteNumber].push(noteEvent.event);
                        });


                        /**
                         * used to draw the horizontal line where the user notes are showed
                         * @param canvas
                         * @returns {number}
                         */
                        var horizontalUserCoord = ($attrs.canvasMainHeight / 4) * 3;
                        $log.debug('horizontalUserCoord: ' + horizontalUserCoord);
                        this.getUserTop = function () {

                            return horizontalUserCoord;
                        };

                        /**
                         * Creates a new user note
                         */
                        function notifyNewUserNoteToCanvas() {
                            $rootScope.$broadcast('controller.userNote.event.' + $scope.canvasId);
                        }

                        this.createUserNote = function (noteIndex) {
                            //calculate iamge vars
                            var image = userNoteImages[noteIndex];
                            var left = noteIndex * NOTE_WIDTH + NOTE_WIDTH / 2;
                            var top = _this.getUserTop() - (NOTE_HEIGHT / 2);


                            var note = {
                                image: image,
                                left: left,
                                top: top
                            };




                            //$log.debug('creating user note', note);

                            //push to current notes (toggle)
                            $scope.userNotes[noteIndex] = note;

                            //send event to update canvas
                            notifyNewUserNoteToCanvas();

                        };
                        this.releaseUserNote = function (noteIndex) {
                            //remove note from map
                            $scope.userNotes[noteIndex] = undefined;

                            //send event to update canvas
                            notifyNewUserNoteToCanvas();
                        };

                        this.getUserNotes = function () {
                            return $scope.userNotes;
                        };

                        /**
                         * Creates a new note to be rendered scrolling down
                         */
                        this.createMidiNote = function (noteEvent, noteImagesArray) {
                            //$log.debug('Creating midi note accumulatedDelta: '+noteEvent.accumulatedDelta,noteEvent);
                            var noteIndex = noteEvent.noteNumber;
                            //calculate iamge vars
                            var image = noteImagesArray[noteIndex];
                            var left = noteIndex * NOTE_WIDTH + NOTE_WIDTH / 2;


                            //create a new note
                            var note = {
                                image: image,
                                left: left,
                                delta: noteEvent.deltaTime,
                                accumulatedDelta: noteEvent.accumulatedDelta,
                                top: 0
                            };
                            $scope.notesCounter = $scope.notesCounter + 1;
                            //$log.debug('creating midi note',note);

                            //push to current notes
                            $scope.notes[noteIndex].push(note);

                            //start render if is the first note
                            if ($scope.notesCounter === 1) {
                                $rootScope.$broadcast('controller.note.event.' + $scope.canvasId);
                            }
                        };


                    }
                };
            })

            /**
             * Base layer, just draw the neck cords
             */
            .directive('canvasMidiBase', function ($log) {
                return{
                    restrict: 'EA',
                    require: '^canvasMidiMain',
                    link: function (scope, element, attrs, canvasMidiController) {
                        $log.info('loading canvas midi base layer directive');

                        var canvas = element[0];
                        var ctx = canvas.getContext('2d');


                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        //add background
                        ctx.drawImage(guitarTextureImage, 0, 0, canvas.width, canvas.height);

                        //ctx.beginPath();
                        ctx.strokeStyle = '#FFFFFF';
                        ctx.fillStyle = '#FFFFFF';

                        var colWidth = canvas.width / 6;
                        var colOffset = colWidth / 2;
                        $log.debug('canvas.width: ' + canvas.width + ', colWidth: ' + colWidth + ', colOffset: ' + colOffset);

                        //ctx.fillRect(25,25,100,100);


                        var i;
                        for (i = 1; i <= 5; i++) {
                            var left = i * colWidth;
                            var right = left;
                            var top = 0;
                            var bottom = canvas.height;

                            $log.debug('left: ' + left + ',right: ' + right + ', top: ' + top + ', bottom: ' + bottom);

                            ctx.beginPath();
                            ctx.moveTo(left, top);
                            ctx.lineTo(left, bottom);
                            ctx.stroke();
                            ctx.closePath();


                        }

                        ctx.beginPath();

                        var hztalTop = canvasMidiController.getUserTop();
                        $log.debug('drawing user horizontal line, top coord: ' + hztalTop);
                        ctx.moveTo(0, hztalTop);
                        ctx.lineTo(canvas.width, hztalTop);
                        ctx.stroke();
                        ctx.closePath();


                    }
                };
            })
            /**
             * Layer to draw notes from midi
             */
            .directive('canvasMidiNotes', function ($rootScope, $log) {
                return{
                    restrict: 'EA',
                    require: '^canvasMidiMain',
                    scope: true,
                    link: function (scope, element, attrs, canvasMidiController) {
                        //element.text('this is the canvasMidi directive');
                        $log.info('loading canvas notes directive');



                        var canvas = element[0];
                        var ctx = canvas.getContext('2d');
                        var animationStartTime = 0;
                        var msInASecond = 1000;

                        //var msInadvance = $rootScope.pMB$parent.$parent.$parent.secondsInAdvance * msInASecond;
                        var msInadvance = $rootScope.pMBsecondsInAdvance * msInASecond;
                        //remove this duplicate calculation
                        var horizontalUserCoord = (canvas.height / 4) * 3;



                        //capute new notes event
                        var eventName = 'controller.note.event.' + scope.canvasId;
                        $log.debug('Registering for new notes event ' + 'controller.note.event.' + scope.canvasId);
                        $rootScope.$on(eventName, function () {
                            startRender();
                        });



                        /**
                         * Draws a frame. The idea is to traverse all the notes objects, scroll down n pixels or remove it if is on the bottom of the canvas.
                         * IMPORTANT  !!! the top coordinate will be calculated with timestamps in future versions to sync all the notes!!!
                         */
                        ctx.font = '16px courier';
                        ctx.fillStyle = '#FFFFFF';
                        ctx.strokeStyle = '#FFFFFF';
                        function drawNoteFrame(renderTimeStamp) {
                            var elapsedTimeMS = renderTimeStamp - animationStartTime;
                            var pixelsToMove = (elapsedTimeMS * horizontalUserCoord) / msInadvance;
                            //first clear the canvas (we are rendering a new frame)
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            //calculate delta to dwar Y coord
                            var currentDelta = 0;
                            var audio = scope.audio;
                            //if song has not started (previous pMBsecondsInAdvance)
                            if (!audio || audio.currentTime <= 0) {
                                //user the delta zero midi
                                currentDelta = window.performance.now() - scope.deltaZeroMidi;
                            } else {
                                //get the song time
                                currentDelta = (audio.currentTime + scope.songDelay) * 1000;
                            }


                            for (var noteIndex = 0; noteIndex < NUMBER_OF_DIFFERENT_NOTES; noteIndex++)
                            {
                                //for each note
                                for (var noteJindex = 0; noteJindex < scope.notes[noteIndex].length; noteJindex++) {
                                    var note = scope.notes[noteIndex][noteJindex];
                                    //update top to scroll down SEE IMPORTANT NOTE ABOVE!!!
                                    note.top = note.top + pixelsToMove;



                                    if (currentDelta > 0) {
                                        var noteDelta = currentDelta - note.accumulatedDelta;
                                        var yCoord = noteDelta * PIXELS_PER_MILLISECOND;
                                        note.top = yCoord;
                                    }


                                    //draw the musical note
                                    //$log.debug('draw note '+note.id);
                                    /*var noteTop = note.top-(NOTE_HEIGHT/2);
                                     ctx.drawImage(note.image,note.left,noteTop);*/
                                    if (note.top + NOTE_HEIGHT < canvas.height) {
                                        ctx.beginPath();
                                        ctx.arc(note.left + (NOTE_WIDTH / 2), note.top, NOTE_RADIUS, 0, 2 * Math.PI, false);
                                        ctx.fillStyle = noteColors[noteIndex];
                                        ctx.fill();
                                        ctx.lineWidth = 5;
                                        ctx.strokeStyle = noteColors[noteIndex];
                                        ctx.stroke();
                                    }
                                    //draw the line until the proper noteOff event
                                    var lineLeft = note.left + (NOTE_WIDTH / 2);
                                    //by default draw the line to the top
                                    var lineStartYCoord = canvas.height;
                                    var lineEndYCoord = 0;
                                    if (note.top < canvas.height)
                                    {
                                        lineStartYCoord = note.top;
                                    }
                                    if (scope.offNotes[noteIndex][noteJindex])
                                    {
                                        //if the noteOf is there, calculate coor
                                        var lineDelta = currentDelta - scope.offNotes[noteIndex][noteJindex].accumulatedDelta;
                                        lineEndYCoord = lineDelta * PIXELS_PER_MILLISECOND;
                                    }
                                    //$log.debug('Render index,pos,notetop,linetop',noteIndex,noteJindex,note.top,lineStartYCoord, lineEndYCoord);
                                    
                                    //check if the note is out of bounds
                                    if (lineEndYCoord >= canvas.height) {
                                        //remove the note from notes
                                        //$log.debug('removing ', noteIndex, noteJindex);
                                        scope.notes[noteIndex].splice(noteJindex, 1);
                                        scope.offNotes[noteIndex].splice(noteJindex, 1);
                                        scope.notesCounter = scope.notesCounter - 1;

                                    } else {
                                        ctx.beginPath();
                                        ctx.moveTo(lineLeft, lineStartYCoord);
                                        ctx.lineWidth = LINE_WIDTH;
                                        ctx.strokeStyle = noteColors[noteIndex];
                                        ctx.lineTo(lineLeft, lineEndYCoord);
                                        ctx.stroke();
                                    }
                                }
                            }

                            if (scope.debug) {
                                var hztalTop = canvasMidiController.getUserTop();
                                ctx.fillText('Song time: ' + scope.audio.currentTime, 0, hztalTop);
                            }

                            startRender();
                            //if there are any note to draw
                            /*if(scope.notesCounter>0){
                             //continue the loop
                             startRender();
                             } else {
                             $log('no more notes to render. stop.');
                             }*/

                        }

                        /**
                         * Starts a render loop
                         */
                        function startRender() {
                            animationStartTime = window.performance.now();
                            window.requestAnimationFrame(drawNoteFrame);
                        }

                    }
                };
            })
            /**
             * Renders the notes pressed by the user
             */
            .directive('canvasMidiUser', function ($rootScope, $log) {
                return {
                    restrict: 'EA',
                    require: '^canvasMidiMain',
                    scope: true,
                    link: function (scope, element, attrs, canvasMidiController) {
                        //element.text('this is the canvasMidi directive');
                        $log.info('loading canvas user notes directive');

                        element.bind('mousedown', function (event) {
                            $log.debug('mouse down received', event);
                            var accumulatedNoteDelta = window.performance.now() - $rootScope.pMBplayingStartTimestamp;
                            var rect = element[0].getBoundingClientRect();
                            var actualCoorX = event.clientX - rect.left;
                            var notePressed = Math.floor(actualCoorX / (element[0].clientWidth / NUMBER_OF_DIFFERENT_NOTES)) % NUMBER_OF_DIFFERENT_NOTES;
                            $rootScope.$broadcast('playmyband.user.noteDown', notePressed, accumulatedNoteDelta, $rootScope.pMBlocalPlayerId);
                            //controller.createMidiNote(scope.lastNote);
                            //scope.lastNote= (scope.lastNote+1)%NUMBER_OF_DIFFERENT_NOTES;

                        });

                        element.bind('mouseup', function (event) {
                            $log.debug('mouseup received', event);
                            var accumulatedNoteDelta = window.performance.now() - $rootScope.pMBplayingStartTimestamp;
                            var rect = element[0].getBoundingClientRect();
                            var actualCoorX = event.clientX - rect.left;
                            var notePressed = Math.floor(actualCoorX / (element[0].clientWidth / NUMBER_OF_DIFFERENT_NOTES)) % NUMBER_OF_DIFFERENT_NOTES;
                            $rootScope.$broadcast('playmyband.user.noteUp', notePressed, accumulatedNoteDelta, $rootScope.pMBlocalPlayerId);
                            //controller.createMidiNote(scope.lastNote);
                            //scope.lastNote= (scope.lastNote+1)%NUMBER_OF_DIFFERENT_NOTES;

                        });

                        var eventName = 'controller.userNote.event.' + scope.canvasId;
                        $log.debug('Registering for new user notes event ' + 'controller.userNote.event.' + scope.canvasId);
                        $rootScope.$on(eventName, function () {
                            renderUserNotes();
                        });

                        var canvas = element[0];
                        var ctx = canvas.getContext('2d');


                        function renderUserNotes() {
                            //first clear the canvas (we are rendering a new frame)
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            //for each user note
                            var userNotes = canvasMidiController.getUserNotes();
                            angular.forEach(userNotes, function (note) {
                                if (note) {
                                    ctx.drawImage(note.image, note.left, note.top);
                                }
                            });
                        }
                    }
                };
            });

})(angular);