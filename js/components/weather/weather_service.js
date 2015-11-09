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