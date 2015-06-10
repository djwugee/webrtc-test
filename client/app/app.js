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
  .run(function ($rootScope,$log,$state){
    $rootScope.$on('$stateChangeSuccess', 
      function(event, toState, toParams, fromState, fromParams){
        //$log.debug('new state: ',toState);

        //redirect to playing if main state
        if(toState.name==='main'){
          $state.go('main.registeringPlayer');
        }

      });

  });