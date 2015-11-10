;(function(window) {
    var geolocation = angular.module('geolocation');

    geolocation.factory('geolocationService', ['$q', '$http', function($q, $http) {

        //Gets user location, if geolocation enabled.
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

        //Takes a latitude and longitude and determines timezone and returns UT-offset
        var getLocalTime = function(lat, lon) {
            var API_KEY = 'a7ca14d429ae359cdab7761182aab';

            var options = {
                url: 'http://api.worldweatheronline.com/free/v2/tz.ashx',
                method: 'jsonp',
                params: {
                    q: lat + ',' + lon,
                    format: 'json',
                    key: API_KEY,
                    callback: 'JSON_CALLBACK'
                }
            }

            var defer = $q.defer();

            $http.jsonp(options.url, options).then(function(response) {
                var localTime = response.data.data['time_zone'][0].localtime;
                defer.resolve(localTime);
            }, function(error) {
                //debuging, add better error handling later
                console.dir(error);
                defer.reject(error);
            });

            return defer.promise;

        };

        //exposed methods
        return {
            getLocation: getLocation,
            getLocalTime: getLocalTime
        }
    }]);
})(window);