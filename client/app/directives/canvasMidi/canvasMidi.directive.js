'use strict';

angular.module('webrtcTestApp')
  .directive('canvasMidi', function ($log) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        //element.text('this is the canvasMidi directive');
        $log.info('loading canvas directive');

        var canvas=element[0]; 
        var ctx=canvas.getContext('2d');
        

        element.bind('click',function(e){
        	$log.debug('clicked');

        	
        	ctx.font = "30px Arial";
			ctx.fillText("Hello World "+String.fromCharCode(e.which),10,50);

			//self.contexts.push(ctx);

        });
        /*element.keydown(function(e){
        	$log.debug('key pressed',e);

        	ctx.font = "30px Arial";
			ctx.fillText("Hello World "+String.fromCharCode(e.which),10,50);
        });

		*/

        //loop
        /*
        scrollContexts= function(){
        	angular.forEach(contexts,function(ctx){

        	});
        };
        $timeout(scrollContexts,1000);

		*/

      }
    };
  });