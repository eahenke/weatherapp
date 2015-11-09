//Features to add
//stricter searching - search by city id - extra search needed to determine which city then.
//Background css class dependent on weather
//day vs night css classes

//local timezone lookups

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

    geolocation.factory('geolocationService', ['$q', function($q) {

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

        return {
            getLocation: getLocation,
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

        //initial default
        var defaultCity = 'Chicago';
        // self.currentCity = 'Chicago';

        function getCurrent() {
            geolocationService.getLocation().then(function(result) {
                self.searchByCoord(result);    
            }, function(error) { //user blocked                
                self.searchByCity(defaultCity);
            });
        };

        //Calls weatherSrvc and updates weather info
        //abstract out the guts of these functions, they're the same
        //something like assignResults

        self.searchByCity = function(city) {
            weatherSrvc.getWeatherByCity(city).then(function(result) {
                self.currentCity = result.city;
                self.currentWeather = result.main;
                self.currentTemp = result.temp;
            }, function(error){
                //for debug
                console.dir(error);
            });     
        };

        self.searchByCoord = function(coords) {
            weatherSrvc.getWeatherByCoord(coords).then(function(result) {
                self.currentCity = result.city;
                self.currentWeather = result.main;
                self.currentTemp = result.temp;
            }, function(error) {
                //for debug
                console.dir(error);
            });     
        };

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

    //Weather Service.
    weatherApp.factory('weatherSrvc', ['$http', '$q', function($http, $q) {

        
        var OPEN_WEATHER_PATTERN = 'http://api.openweathermap.org/data/2.5/weather';
        var API_KEY = '&APPID=a0d7e44cdb26abb996246b544a26f161';
        var api = 'a0d7e44cdb26abb996246b544a26f161';
        var callback = '&callback=JSON_CALLBACK';
        var units = '&units=imperial';



        var getWeatherByCoord = function(coords) {
            var options = {
                method: 'jsonp',
                url: OPEN_WEATHER_PATTERN,
                params: {
                    lat: coords.latitude,
                    lon: coords.longitude,
                    units: 'imperial',
                    APPID: api,
                    callback: 'JSON_CALLBACK',
                }                
            };

            return request(options);            
        };

        var getWeatherByCity = function(city) {
            var options = {
                method: 'jsonp',
                url: OPEN_WEATHER_PATTERN,
                params: {
                    q: city,
                    units: 'imperial',
                    APPID: api,
                    callback: 'JSON_CALLBACK',
                }                
            };
            return request(options);   
        };


        function request(options) {
            var defer = $q.defer();


            var weather = {};

            $http.jsonp(options.url, options).then(function(response) {
                var data = response.data;
                                
                if(data) {
                    weather.city = data.name;
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
            });

            return defer.promise;
        }
         

        //Calls OpenWeatherMap API and returns object with city, weather, and temperature
/*
        var getWeather = function(city) {
            //replace QUERY with query type - either by city search or more specfic city id
            //city idea would involve bulk download of city id's and then another search function to determine which city for common names

            // var url = OPEN_WEATHER_PATTERN.replace('QUERY', 'weather?q=' + city + API_KEY);

            var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + API_KEY + '&callback=JSON_CALLBACK';

            var defer = $q.defer();


            var weather = {};

            $http.jsonp(url).then(function(response) {
                var data = response.data;
                                
                if(data) {
                    weather.city = data.name;
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
            });

            return defer.promise;
        }
        */

        return {
            // getWeather: getWeather,
            getWeatherByCity: getWeatherByCity,
            getWeatherByCoord: getWeatherByCoord
        }
    }]);
})(window);