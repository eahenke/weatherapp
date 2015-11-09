;(function(window) {
    var weatherApp = angular.module('weatherApp');

    weatherApp.controller('WeatherCtrl', ['weatherSrvc', 'geolocationService', function(weatherSrvc, geolocationService) {
        var self = this;

        //initial default
        var defaultCity = 'Chicago';

        function getCurrent() {
            geolocationService.getLocation().then(function(result) {
                var lat = result.latitude;
                var lon = result.longitude;                
                self.searchByCoord(lat, lon);    
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

        self.searchByCoord = function(lat, lon) {
            weatherSrvc.getWeatherByCoord(lat, lon).then(function(result) {
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