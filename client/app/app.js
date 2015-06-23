'use strict';

angular.module('webrtcTestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(false);


  })
  .run(function ($rootScope,$log,$state,$location){

    var currentUrl= $location.absUrl();

    $rootScope.serverRuntime= currentUrl.indexOf('playmyband')>-1;
    $log.info($rootScope.serverRuntime?'... in SERVER runtime':'... in LOCAL runtime');

    $rootScope.$on('$stateChangeSuccess', 
      function(event, toState){
        //$log.debug('new state: ',toState);

        //redirect to playing if main state
        if(toState.name==='main' || toState.name==='main.game'){
          $state.go('main.game.login');
        }

      });

  });