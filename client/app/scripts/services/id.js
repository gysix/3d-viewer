'use strict';

angular.module('3dViewer')
    .factory('id', function ($wix, $location) {

        var getInstance = function() {
            var url = $location.absUrl();
            var instanceRegexp = /.*instance=([\[\]a-zA-Z0-9\.\-_]*?)(&|$|#).*/g;
            var instance = instanceRegexp.exec(url);
            if (instance && instance[1]) {
                var instanceId = instance[1]; //instanceId is actually the unparsed instance
            } else {
                var instanceId;
            }
            return instanceId; //returns the unparsed instance
        };

        var getOrigCompId = $wix.Utils.getOrigCompId;
        var getCompId = $wix.Utils.getCompId;

        return {
            getInstance: getInstance,
            getOrigCompId: getOrigCompId,
            getCompId: getCompId
        };


    });