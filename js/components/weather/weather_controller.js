;(function(window) {
    var weatherApp = angular.module('weatherApp');

    weatherApp.controller('WeatherCtrl', ['weatherSrvc', function(weatherSrvc) {
        var self = this;

        self.currentCity = 'Chicago';
        self.currentWeather = 'Sunny';
        self.currentTemp = '70';

        //Calls weatherSrvc and updates weather info
        self.update = function(city) {
            weatherSrvc.getWeather(city).then(function(result) {
                self.currentCity = result.city;
                self.currentWeather = result.main;
                self.currentTemp = result.temp;
            });     
        };

    }]);
})(window);