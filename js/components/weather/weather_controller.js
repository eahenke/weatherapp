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