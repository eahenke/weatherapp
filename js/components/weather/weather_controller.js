;(function(window) {
    var weatherApp = angular.module('weatherApp');

    weatherApp.controller('WeatherCtrl', ['weatherSrvc', 'geolocationService', function(weatherSrvc, geolocationService) {
        var self = this;


        //initial defaults
        self.currentCity = 'Chicago';
        self.timezone = '-0600';


        //Calls weatherSrvc, searched by city
        self.searchByCity = function(city) {
            self.newCity = '';
            weatherSrvc.getWeatherByCity(city).then(function(result) {
                update(result);
                getLocalTime(result.city.lat, result.city.lon);
            }, function(error){
                //for debug
                console.dir(error);
            });     
        };

        //Calls weatherSrvc, searches by lat, lon
        self.searchByCoord = function(lat, lon) {
            weatherSrvc.getWeatherByCoord(lat, lon).then(function(result) {
                update(result);
                getLocalTime(lat, lon);
            }, function(error) {
                //for debug
                console.dir(error);
            });     
        };

        //Calls geolocation service to get local lat, lon and searches by lat, lon
        function getCurrent() {

            geolocationService.getLocation().then(function(result) {

                var lat = result.latitude;
                var lon = result.longitude;  
                self.searchByCoord(lat, lon);
                
            }, function(error) { //user blocked                
                self.searchByCity(self.currentCity);
            });
        };

        //get local timezone by lat, lon and set timezone
        function getLocalTime(lat, lon) {
            geolocationService.getLocalTime(lat, lon).then(function(time) {
                self.timezone = time;
            }, function(error) {
                console.dir(error);
            });
        }

        //update city, weather, temp
        function update(result) {
            self.currentCity = result.city.name;
            self.currentWeather = result.description;
            self.currentTemp = result.temp;
            self.dayOrNight = result.dayOrNight;
            self.iconClass = result.iconClass;
        }

        getCurrent();

    }]);
})(window);