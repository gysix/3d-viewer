'use strict';

angular.module('3dViewer')
	.controller('ModelCtrl', function ($scope, $wix, $http, id) {
    console.log('controller opened');

    var compId = id.getOrigCompId() || id.getCompId();
    var instance = id.getInstance();

    var identification = {instance: instance, compId: compId};

    $scope.modelRotationSpeed = modelRotationSpeed;

    $scope.smokeOn = 'Off';
    $scope.smokeRotationSpeed = smokeRotationSpeed;
    $scope.smokeRisingSpeed = smokeRisingSpeed;

    $scope.particlesOn = 'Off';
    $scope.particlesRotationSpeed = particlesRotationSpeed;

    $scope.backgroundColor = 0x000000;
    renderer.setClearColor( $scope.backgroundColor, 0);
    console.log($scope.backgroundColor);

    // $wix.addEventListener($wix.Events.SETTINGS_UPDATED, function(message) {
    //   $scope.settings = message;
    //   $scope.$apply();
    //   console.log('settings changed event listened', $scope.settings)
    // });

    $scope.toggleModelRotation = function () {
      modelRotationOn = !modelRotationOn;
      if (modelRotationOn) {
        $scope.modelRotation = 'On';
      } else {
        $scope.modelRotation = 'Off';
      }
    }

    $scope.toggleParticles = function () {
      particlesOn = !particlesOn;
      if (particlesOn) {
        $scope.particlesOn = 'On';
        addSnowflakes();
      } else {
        $scope.particlesOn = 'Off';
        scene.remove(particleSystem);
      }
    }

    $scope.toggleSmoke = function () {
      smokeOn = !smokeOn;
      if (smokeOn) {
        $scope.smokeOn = 'On';
        addSmoke();
      } else {
        $scope.smokeOn = 'Off';
        scene.remove(smoke);
      }
    }

    $scope.increaseModelRotationSpeed = function () {
      modelRotationSpeed += 0.5;
      $scope.modelRotationSpeed = modelRotationSpeed;
    }

    $scope.decreaseModelRotationSpeed = function () {
      modelRotationSpeed -= 0.5;
      $scope.modelRotationSpeed = modelRotationSpeed;
    }

    $scope.increaseSmokeRotationSpeed = function () {
      smokeRotationSpeed += 0.5;
      $scope.smokeRotationSpeed = smokeRotationSpeed;
    }

    $scope.decreaseSmokeRotationSpeed = function () {
      smokeRotationSpeed -= 0.5;
      $scope.smokeRotationSpeed = smokeRotationSpeed;
    }

    $scope.increaseSmokeRisingSpeed = function () {
      smokeRisingSpeed += 0.5;
      $scope.smokeRisingSpeed = smokeRisingSpeed;
    }

    $scope.decreaseSmokeRisingSpeed = function () {
      smokeRisingSpeed -= 0.5;
      $scope.smokeRisingSpeed = smokeRisingSpeed;
    }

    $scope.increaseParticlesRotationSpeed = function () {
      particlesRotationSpeed += 0.5;
      $scope.particlesRotationSpeed = particlesRotationSpeed;
    }

    $scope.decreaseParticlesRotationSpeed = function () {
      particlesRotationSpeed -= 0.5;
      $scope.particlesRotationSpeed = particlesRotationSpeed;
    }

    // Testing save on back end & database
    var postUser = function () {
      console.log('start post');
      $http.post('/save', identification)
        .success(function (data, status, headers, config) {
          console.log(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          console.log("Error with POST user: ", data, status, headers, config);
        });
      console.log('end post');
    }

    // postUser();

    var putUser = function () {
      console.log('start put');
      $http.put('/save', identification)
        .success(function (data, status, headers, config) {
          // console.log(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          console.log("Error with PUT user: ", data, status, headers, config);
        });
      console.log('end put');
    }

    // putUser();


  });