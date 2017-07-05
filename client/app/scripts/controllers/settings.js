'use strict';

angular.module('3dViewer')
  .controller('SettingsCtrl', function ($scope, $wix, $http, $location) {
  	$wix.UI.initialize();

  	$scope.modelUploaded = false;

  	$scope.lightingOptions= false;

  	$scope.modelColors = false;

    $scope.settings = {};

    var compId = $wix.Utils.getOrigCompId();

    $wix.UI.onChange('*', function (value, key) {
      $wix.Settings.triggerSettingsUpdatedEvent($scope.settings, compId);
      console.log('settings changed', $scope.settings);
    });

  	$scope.enableLightingOptions = function() {
  		$scope.lightingOptions = true;
  	}

  	$scope.disableLightingOptions = function() {
  		$scope.lightingOptions = false;
  	}

  	$scope.enableModelColors = function() {
  		$scope.modelColors = true;
  	}

    var getInstance = function() {
      var url = $location.absUrl();
      var instanceRegexp = /.*instance=([\[\]a-zA-Z0-9\.\-_]*?)(&|$|#).*/g;
      var instance = instanceRegexp.exec(url);
      if (instance && instance[1]) {
        var instanceId = instance[1]; //instanceId is actually the unparsed instance
      } else {
        // console.log("This shouldn't happen.");
        var instanceId;
      }
      return instanceId; //returns the unparsed instance
    };

    var instance = getInstance();

    $scope.saveSettings = function () {
      
      $http.put('/models/' + compId, settingsJson,
      { headers:  { 'X-Wix-Instance': instance, 
                  'Content-Type': 'application/json' } })
        .success( function (data, status, headers, config) {})
        .error( function (data, status, headers, config) {
          console.log('Error saving settings.');
        })
        .then(function (response) {
          console.log("settings saved: " + response.data);
        });
    }

    var testContent = {instance: '1234', compId: '5678'};

    // Testing save on back end & database
    var postSettings = function () {
      // console.log('start post');
      $http.post('/save', testContent)
        .success(function (data, status, headers, config) {
          console.log(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          console.log("Error: ", data, status, headers, config);
        });
      // console.log('end post');
    }

    // postSettings();

    $wix.Settings.refreshApp();

});
