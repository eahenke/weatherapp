;(function(window) {
	angular.module('app', ['weatherApp', 'clockApp', 'geolocation']);
})(window);

;(function(window) {
    var clockApp = angular.module('clockApp', []);
})(window);
;(function(window) {
    var clockApp = angular.module('clockApp');

    clockApp.directive('clock', ['$interval', 'dateFilter', function($interval, dateFilter) {
        return {
            restricted: 'E',
            scope: {
                format: '@?',
            },
            link: function(scope, element) {

                //default to hour, minutes
                if(scope.format == undefined) {
                    scope.format = 'h:mm a';
                }

                var timeoutId;

                function updateTime() {
                    element.text(dateFilter(new Date(), scope.format));
                }

                //always destroy $intervals
                element.on('$destroy', function() {
                    $interval.cancel(timeoutId);
                });

                //update every second
                timeoutId = $interval(function() {
                    updateTime();
                }, 1000);

                //initialize
                updateTime();
            }
        }
    }]);

})(window);
;(function(window){
    var geolocation = angular.module('geolocation', []);
})(window);
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
;(function(window) {
    var weatherApp = angular.module('weatherApp', ['geolocation']);
})(window);
;(function(window) {
    var weatherApp = angular.module('weatherApp');

    weatherApp.controller('WeatherCtrl', ['weatherSrvc', 'geolocationService', function(weatherSrvc, geolocationService) {
        var self = this;

        self.time;

        //initial default
        var defaultCity = 'Chicago';

        function getCurrent() {
            geolocationService.getLocation().then(function(result) {
                var lat = result.latitude;
                var lon = result.longitude;  
                self.searchByCoord(lat, lon);
                // getLocalTime(lat, lon);
                // geolocationService.getLocalTime(lat, lon).then(function(response){
                //     console.log(response);
                // });    

            }, function(error) { //user blocked                
                self.searchByCity(defaultCity);
            });
        };

        //Calls weatherSrvc and updates weather info
        //abstract out the guts of these functions, they're the same
        //something like assignResults

        self.searchByCity = function(city) {
            weatherSrvc.getWeatherByCity(city).then(function(result) {
                self.currentCity = result.city.name;
                self.currentWeather = result.main;
                self.currentTemp = result.temp;

                getLocalTime(result.city.lat, result.city.lon);
            }, function(error){
                //for debug
                console.dir(error);
            });     
        };

        self.searchByCoord = function(lat, lon) {
            weatherSrvc.getWeatherByCoord(lat, lon).then(function(result) {
                self.currentCity = result.city.name;
                self.currentWeather = result.main;
                self.currentTemp = result.temp;
                getLocalTime(lat, lon);
            }, function(error) {
                //for debug
                console.dir(error);
            });     
        };

        function getLocalTime(lat, lon) {
            geolocationService.getLocalTime(lat, lon).then(function(time) {
                self.time = time;
                console.log(self.time);
            }, function(error) {

            });
        }

        // function getPlaceNameByCoords(lat, lon) {
        //     geolocationService.getPlaceNameByCoords(lat, lon);
        // }

        // self.update(self.currentCity);
        getCurrent();

    }]);
})(window);
;(function(window) {
    var weatherApp = angular.module('weatherApp');

    //Takes a tempertature in fahrenheit and formats it, followed by Celsius equivalent
    weatherApp.filter('temperature', function() {
        return function(temp) {
                if(temp) {
                    temp = parseInt(temp);
                    var celsius = Math.round((temp - 32) * ( 5/ 9)); 
                    var output = temp + '\xB0F / ' + celsius + '\xB0C';
                    return output;
                    
                } else {
                    //prevent showing 'NaN' if null or undefined
                    return '';
                }
        };
    });
})(window);
;(function(window) {

    var weatherApp = angular.module('weatherApp');

    //Weather Service
    weatherApp.factory('weatherSrvc', ['$http', '$q', function($http, $q) {
        
        //API constants
        var OPEN_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
        var API_KEY = 'a0d7e44cdb26abb996246b544a26f161';

        //Format http request config object for searching by lat/lon
        var getWeatherByCoord = function(lat, lon) {
            var options = {
                method: 'jsonp',
                url: OPEN_WEATHER_URL,
                params: {
                    lat: lat,
                    lon: lon,
                    units: 'imperial',
                    APPID: API_KEY,
                    callback: 'JSON_CALLBACK',
                }                
            };

            return request(options);            
        };

        //format http request config object for searching by city
        var getWeatherByCity = function(city) {
            var options = {
                method: 'jsonp',
                url: OPEN_WEATHER_URL,
                params: {
                    q: city,
                    units: 'imperial',
                    APPID: API_KEY,
                    callback: 'JSON_CALLBACK',
                }                
            };
            return request(options);   
        };

        //Calls OpenWeatherMap API and returns object with city, weather, and temp
        function request(options) {
            var defer = $q.defer();

            var weather = {};

            $http.jsonp(options.url, options).then(function(response) {
                var data = response.data;
                                
                if(data) {
                    weather.city = {
                        name: data.name,
                        lat: data.coord.lat,
                        lon: data.coord.lon,
                    };
                    
                    if(data.weather[0]) {
                        weather.main = data.weather[0].main;
                    }

                    if(data.main) {
                        weather.temp = data.main.temp;
                    }
                } else {
                    //missing data
                    console.log('no data');
                }

                defer.resolve(weather);
                
            }, function(error) {
                //add error functionality
                console.dir(error);
                defer.reject(error);
            });

            return defer.promise;
        }         

        //exposed methods
        return {
            getWeatherByCity: getWeatherByCity,
            getWeatherByCoord: getWeatherByCoord
        }
    }]);
})(window);