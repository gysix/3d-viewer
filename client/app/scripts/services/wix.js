'use strict';

angular.module('3dViewer').factory('$wix', function ($window, $log) {
  if ('Wix' in $window) {
    return $window.Wix;
  } else {
    return $log.error('Did you forget to include Wix.js?');
  }
});
