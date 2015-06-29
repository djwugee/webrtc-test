'use strict';

angular.module('webrtcTestApp')
  .controller('FacebookCtrl', function ($rootScope,$scope,$location,$log,$resource,$state) {
    var FACEBOOK_BASE_URL='https://graph.facebook.com/v2.3';
    
    //load HATEOAS resources
    var $oauthResource= $resource(FACEBOOK_BASE_URL+'/oauth/access_token');
    var $userResource= $resource(FACEBOOK_BASE_URL+'/me');

    $log.info('Entering into FacebookCtrl, $location.absUrl():',$location.absUrl());
    $log.info('Entering into FacebookCtrl, $location.search():',$location.search());

    $scope.facebookCode=$location.search().code;
    $scope.accessToken='loading';

    /*

          BORRARRRRRRR

    */
    $scope.facebookSecret='b9ea945250a4b3de589ee14b589ef151';




    /**
      * Handle facebook userData query result. It's called after the code is validated.
      */
    var handleUserDataQuery= function(data, status, headers, config){
      $log.info('Handling facebook userData query',data, status, headers, config);


      $scope.userData= data;

      // go with facebook name
      var username= $scope.userData.name.replace(' ','_');

      $scope.user.name= username;
      $state.go($rootScope.REGISTERING_STATE,{userName:$scope.user.name});

    };


    function handleError(resurceName,data, status, headers, config){
      $log.error('Handling facebook '+resurceName+' query error',data, status, headers, config);
      $scope.error=data.data.error;
    }

    /**
      * Handle facebook userData query error. It's called after the code is validated.
      */
    var handleUserDataQueryError=function(data, status, headers, config){
      handleError('USER',data, status, headers, config);

    };



    var handleFacebookOauthQuery= function(data, status, headers, config){
      $log.info('Handling facebook OAUTH query',data, status, headers, config);

      //update access token
      /*jshint camelcase: false */
      $scope.accessToken=data.access_token;

      //call get userData
      getUserData();

    };

    var handleFacebookOauthQueryError=function(data, status, headers, config){
      handleError('OAUTH',data, status, headers, config);

    };

        /**
      * call to facebook api to get user userData
     */
    function getUserData(){
      $scope.userData= null;
      $scope.error=null;

      /*jshint camelcase: false */
      var requestParams={
        access_token:$scope.accessToken
      };

      $log.info('calling /me endpoint with params',requestParams);
      $userResource.get(
        requestParams,
        handleUserDataQuery,
        handleUserDataQueryError);

    }

    /*
     * call facebook to thet access_token
     */
    function getOauthToken(){
      $scope.error=null;

      /*jshint camelcase: false */
      var requestParams={
        client_id:$scope.facebookAppId,
        redirect_uri:$scope.facebookRedirectUrl,
        client_secret:$scope.facebookSecret,
        code:$scope.facebookCode,
        scope:'basic_info'
      };
      
      $log.info('GET oauth with params',requestParams);

      $oauthResource.get(
        requestParams,
        handleFacebookOauthQuery,
        handleFacebookOauthQueryError);
    }



    //get oauth access token
    getOauthToken();

    

  });
