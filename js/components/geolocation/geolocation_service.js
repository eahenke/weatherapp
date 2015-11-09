;(function(window) {
    var geolocation = angular.module('geolocation');

    geolocation.factory('geolocationService', ['$q', function($q) {

        var getLocation = function() {
            var defer = $q.defer();

            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    // console.dir(position);
                    defer.resolve(position.coords);

                }, function(error) {
                    defer.reject(error);
                });
            } else { //disabled
                defer.reject(false);
            }

            return defer.promise;
        }

        return {
            getLocation: getLocation,
        }
    }]);
})(window);