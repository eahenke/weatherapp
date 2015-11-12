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

            var options = {
                url: 'http://api.geonames.org/timezoneJSON',
                method: 'jsonp',
                params: {
                    lat: lat,
                    lng: lon,
                    username: 'eahenke',
                    callback: 'JSON_CALLBACK'
                }
            }

            var defer = $q.defer();

            $http.jsonp(options.url, options).then(function(response) {
                var offset = response.data.rawOffset;
                var timezone = offsetFormat(offset);

                defer.resolve(timezone);
            }, function(error) {
                //debuging, add better error handling later
                console.dir(error);
                defer.reject(error);
            });

            return defer.promise;

        };

        //Takes an offset string in the form '(-)h(.m)'  and returns offset in form of '(-/+)hhmm' 
        function offsetFormat(offset) {            
            var split, sign, hours, minutes;
            offset = offset.toString();

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
            if(minutes == '5') {
                minutes = '30';
            } else {
                minutes = '00';
            }

            //add padding
            if(hours.length < 2) {
                hours = '0' + hours;
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