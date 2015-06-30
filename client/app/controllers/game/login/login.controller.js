'use strict';

angular.module('webrtcTestApp')
  .controller('LoginCtrl', function ($scope,$log,$state,$rootScope) {
    $log.debug('LoginCtrl - entering');

    function initVarsForFacebook($scope){

      //register client key
      $scope.facebookAppId='1451789471806244';

      //get url from $state login.facebook
      var stateHref= $state.href('main.game.login.facebook');
      stateHref=stateHref.replace('/playmyband','');
      var href= 'http://playmybandnow.ddns.net:8080/playmyband/'+stateHref;
      
      
      
      //$http.get('www.facebook.com/me',function(result){$log.debug('result',result);},function(error){$log.debug('error',error);});

      $scope.facebookRedirectUrl=href;
      $log.info('LoginCtrl - facebookRedirectUrl: '+$scope.facebookRedirectUrl);

      href= encodeURIComponent(href);
      $scope.facebookRedirectUrlEncoded=href;


    }

    //init vars for facebook
    initVarsForFacebook($scope);

    $scope.normalLogin=function(){
      $state.go($rootScope.REGISTERING_STATE,{userName:$scope.user.name});
    };

  });
