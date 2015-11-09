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