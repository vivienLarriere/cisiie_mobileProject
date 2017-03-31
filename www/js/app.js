// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('demo', ['ionic', 'IonicitudeModule'])

  .run(function ($ionicPlatform, Ionicitude) {
    $ionicPlatform.ready(function () {
    });
  })

  .controller('MainCtrl', function ($scope, Ionicitude) {
    $scope.launchAR = function (ref) {
      try {
        // The ref passed as an argument to Ionicitude.launchAR() must be the name
        // of a directory in the wikitude-worlds directory.
        Ionicitude.launchAR(ref)
          .then(function () {
            console.log('OK ! The ' + ref + ' AR World has been perfectly launched !');
          })
          .catch(function (error) {
            console.log('Error while trying to launch the ' + ref + ' AR World.', error);
          })
      } catch (error) {
        console.log('But... Why ?! Something happened ?', error);
      }
    }
  });
