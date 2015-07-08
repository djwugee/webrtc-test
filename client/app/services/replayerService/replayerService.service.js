'use strict';
(function (angular){
  angular.module('webrtcTestApp')
    .service('$replayerService', function ($rootScope, $synthService) {
      // AngularJS will instantiate a singleton by calling 'new' on this function

      function Replayer(midiFile, synth) {
        var trackStates = [];
        var trackAccumulatedDelta = [{noteNumber:0,total:0,track:0}];
        var beatsPerMinute = 120;
        var millisecondsPerBeat= beatsPerMinute * 60000000;
        var ticksPerBeat = midiFile.header.ticksPerBeat;
        var channelCount = 16;


        var i;
        for (i = 0; i < midiFile.tracks.length; i++) {
            trackStates[i] = {
              'nextEventIndex': 0,
              'ticksToNextEvent': (
                midiFile.tracks[i].length ?
                  midiFile.tracks[i][0].deltaTime :
                  null
              )
            };
        }
        
        function Channel() {
          
          var generatorsByNote = {};
          var currentProgram = $synthService.PianoProgram; // NOT USED
          
          function noteOn(noteEvent) {
            if (generatorsByNote[noteEvent.event.noteNumber] && !generatorsByNote[noteEvent.event.noteNumber].released) {
              /* playing same note before releasing the last one. BOO */
              generatorsByNote[noteEvent.event.noteNumber].noteOff(); /* TODO: check whether we ought to be passing a velocity in */
              $rootScope.$broadcast('playmyband.midi.noteOffEvent',noteEvent);
            }
            //console.log('playing note' + note);
            $rootScope.$broadcast('playmyband.midi.noteEvent',noteEvent);
            var generator = currentProgram.createNote(noteEvent.event.noteNumber, noteEvent.event.velocity);
            synth.addGenerator(generator);
            generatorsByNote[noteEvent.noteNumber] = generator;
          }
          function noteOff(noteEvent) {
            if (generatorsByNote[noteEvent.event.noteNumber] && !generatorsByNote[noteEvent.event.noteNumber].released) {
              generatorsByNote[noteEvent.noteNumber].noteOff(noteEvent.event.velocity);
            }
            $rootScope.$broadcast('playmyband.midi.noteOffEvent',noteEvent);

          }
            function setProgram(programNumber) {
              console.debug(programNumber);
              currentProgram = $synthService.PianoProgram; // TODO --> custom programs PROGRAMS[programNumber] || $synthService.PianoProgram;
            }
          
          return {
            'setProgram': setProgram,
            'noteOn': noteOn,
            'noteOff': noteOff
          };
        }
        
        var channels = [];
        for (i = 0; i < channelCount; i++) {
          channels[i] = new Channel();
        }
        
        var nextEventInfo;
        var samplesToNextEvent = 0;
        
        function getNextEvent() {
          var ticksToNextEvent = null;
          var nextEventTrack = null;
          var nextEventIndex = null;
          
          var i;
          for (i = 0; i < trackStates.length; i++) {
            if (trackStates[i].ticksToNextEvent !== null  && (ticksToNextEvent === null || trackStates[i].ticksToNextEvent < ticksToNextEvent) ) {
              ticksToNextEvent = trackStates[i].ticksToNextEvent;
              nextEventTrack = i;
              nextEventIndex = trackStates[i].nextEventIndex;
            }
          }
          if (nextEventTrack !== null) {
            /* consume event from that track */
            var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
            if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
              trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
            } else {
              trackStates[nextEventTrack].ticksToNextEvent = null;
            }
            trackStates[nextEventTrack].nextEventIndex += 1;
            /* advance timings on all tracks by ticksToNextEvent */
            for (i = 0; i < trackStates.length; i++) {
              if (trackStates[i].ticksToNextEvent !== null) {
                trackStates[i].ticksToNextEvent -= ticksToNextEvent;
              }
            }
            nextEventInfo = {
              'ticksToEvent': ticksToNextEvent,
              'event': nextEvent,
              'track': nextEventTrack
            };
            var beatsToNextEvent = ticksToNextEvent / ticksPerBeat;
            var secondsToNextEvent = beatsToNextEvent / (beatsPerMinute / 60);
            //if (typeof(nextEvent.noteNumber) !== 'undefined')            {
              //console.debug('track:' + nextEventTrack + 'last accumulated:' + trackAccumulatedDelta[trackAccumulatedDelta.length - 1].total + 'secondToNextEvet:' + (secondsToNextEvent * 1000));
              var millisecondsToNextEvent= beatsToNextEvent * millisecondsPerBeat;

              var nextAccumulatedDelta = trackAccumulatedDelta[trackAccumulatedDelta.length - 1].total + millisecondsToNextEvent;
              //console.log(nextEventTrack+') nextAccumulatedDelta: '+nextAccumulatedDelta);


              trackAccumulatedDelta[trackAccumulatedDelta.length] = { noteNumber : nextEvent.noteNumber, total : nextAccumulatedDelta, track : nextEventTrack};  
              nextEvent.accumulatedDelta=nextAccumulatedDelta;
            //}
            samplesToNextEvent += secondsToNextEvent * synth.sampleRate;
          } else {
            nextEventInfo = null;
            samplesToNextEvent = null;
            self.finished = true;
          }
        }
        
        getNextEvent();
        
        function generate(samples) {
          var data = new Array(samples*2);
          var samplesRemaining = samples;
          var dataOffset = 0;
          
          while (true) {
            if (samplesToNextEvent !== null && samplesToNextEvent <= samplesRemaining) {
              /* generate samplesToNextEvent samples, process event and repeat */
              var samplesToGenerate = Math.ceil(samplesToNextEvent);
              if (samplesToGenerate > 0) {
                synth.generateIntoBuffer(samplesToGenerate, data, dataOffset);
                dataOffset += samplesToGenerate * 2;
                samplesRemaining -= samplesToGenerate;
                samplesToNextEvent -= samplesToGenerate;
              }
              
              handleEvent();
              getNextEvent();
            } else {
              /* generate samples to end of buffer */
              if (samplesRemaining > 0) {
                synth.generateIntoBuffer(samplesRemaining, data, dataOffset);
                samplesToNextEvent -= samplesRemaining;
              }
              break;
            }
          }
          return data;
        }
        
        function handleEvent() {
          var event = nextEventInfo.event;
          switch (event.type) {
            case 'meta':
              switch (event.subtype) {
                case 'setTempo':
                  beatsPerMinute = 60000000 / event.microsecondsPerBeat;
                  millisecondsPerBeat= event.microsecondsPerBeat/1000;
                  //console.log('\n\n\nBeats per minute '+beatsPerMinute);
              }
              break;
            case 'channel':
              switch (event.subtype) {
                case 'noteOn':
                  channels[event.channel].noteOn(nextEventInfo);            
                  break;
                case 'noteOff':
                  channels[event.channel].noteOff(nextEventInfo);
                  break;
                case 'programChange':
                  //console.log('program change to ' + event.programNumber);
                  channels[event.channel].setProgram(event.programNumber);
                  break;
              }
              break;
          }
        }
        
        function replay(audio) {
          console.log('replay');
          audio.write(generate(44100));
          setTimeout(function() {replay(audio);}, 10);
        }

        function isANoteThere(noteNumber, accumulatedDelta, marginOfError, track)
        {
          var isThere = false;
          var i = trackAccumulatedDelta.length;
          //start from the back, where more recent notes should match
          while (i--) {
          //for (var i = 0; i < trackAccumulatedDelta.length; i++) {
            var userNoteDif = Math.abs(trackAccumulatedDelta[i].total - accumulatedDelta);
            //console.debug('UserNoteDif:' + userNoteDif);
            if ( trackAccumulatedDelta[i].track === track &&
              trackAccumulatedDelta[i].noteNumber &&
              trackAccumulatedDelta[i].noteNumber>0 &&
              trackAccumulatedDelta[i].noteNumber === noteNumber && 
              userNoteDif <= marginOfError) {
              isThere = true;
              break;
            } else if (userNoteDif > 10000) {
              //remove accumulated, no longer required. reduces comparisons on next note
              trackAccumulatedDelta.splice(i,1);
              //by now just stop
              break;
            }
          }
          return isThere;
        }
        
        var self = {
          'replay': replay,
          'generate': generate,
          'finished': false,
          'isANoteThere': isANoteThere
        };
        return self;
      }

      return {
        Replayer:Replayer
      };
    });
  
})(angular);
