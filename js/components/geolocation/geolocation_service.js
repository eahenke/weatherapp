;(function(window) {
    var geolocation = angular.module('geolocation');

    geolocation.factory('geolocationService', ['$q', '$http', function($q, $http) {

        //Gets user location, if geolocation enabled.
        var getLocation = function() {
            var defer = $q.defer();

            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    defer.resolve(position.coords);

                }, function(error) {
                    defer.reject(error);
                });
            } else { //disabled
                defer.reject(false);
            }

            return defer.promise;
        }

        //Takes a latitude and longitude and calls tp World Weather Online Timezone API and returns UTC offset
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
                var offset = response.data.data['time_zone'][0].utcOffset;         
                var timezone = offsetFormat(offset);
                defer.resolve(timezone);
            }, function(error) {
                //debuging, add better error handling later
                console.dir(error);
                defer.reject(error);
            });

            return defer.promise;

        };

        //Takes an offset string in the form '(-)h.m' and returns offset in form of (-)hhmm 
        function offsetFormat(offset) {
            var split, sign, hours, minutes;
            if(offset.charAt(0) == '-') {
                sign = '-';
                split = offset.slice(1).split('.');
            } else {
                sign = '+';
                split = offset.split('.');
            }
            hours = split[0];
            minutes = split[1];

            //convert percentage to minutes
            if(minutes == '50') {
                minutes = '30';
            }

            //add padding
            if(hours.length < 2) {
                hours = '0' + hours;
            }
            if(minutes.length < 2) {
                minutes += '0';
            }

            return sign + hours + minutes;
        }

        //exposed methods
        return {
            getLocation: getLocation,
            getLocalTime: getLocalTime
        }
    }]);
})(window);