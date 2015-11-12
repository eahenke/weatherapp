;(function(window) {

    var weatherApp = angular.module('weatherApp');

    //Weather Service
    weatherApp.factory('weatherSrvc', ['$http', '$q', function($http, $q) {
        
        //API constants
        var OPEN_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
        var API_KEY = apiKeys.openWeatherMap;

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
                        weather.description = data.weather[0].description;
                        
                        var iconCode = data.weather[0].icon;
                        var weatherCode = data.weather[0].id;
                        
                        weather.dayOrNight = getDayOrNight(iconCode);
                        weather.iconClass = getIconClass(weatherCode, weather.dayOrNight);
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

        //Determines icon class based on weather-code for type, and iconCode for day vs night.  Relevant codes from openweathermap.com
        function getIconClass(weatherCode, time) {

            var firstDigit = weatherCode.toString().charAt(0);
            var icon;

            if(weatherCode == 800) {
                icon = 'icon-clear-' + time;
            }else if(firstDigit == '8') {
                icon = 'icon-cloud-' + time;
            } else {
                //Weather codes from openweathermap.com
                var codeTable = {
                    '2' : 'thunder',
                    '3' : 'rain',
                    '5' : 'rain',
                    '6' : 'snow',
                    '7' : 'mist',
                }
                icon = 'icon-' + codeTable[firstDigit];
            }

            return icon;
        }

        //Checks icon code to determine day or night
        function getDayOrNight(iconCode) {
            var time = '';
            
            //icon codes are in the form of 'XXd' or 'XXn'
            if(iconCode) {
                time = iconCode.slice(-1) == 'd' ? 'day' : 'night';           
            }            
            return time;
        }

        //exposed methods
        return {
            getWeatherByCity: getWeatherByCity,
            getWeatherByCoord: getWeatherByCoord
        }
    }]);
})(window);