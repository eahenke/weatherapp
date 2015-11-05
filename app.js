//Features to add
//stricter searching - search by city id - extra search needed to determine which city then.
//Background css class dependent on weather
//day vs night css classes
//Initial display based on users location


var weatherApp = angular.module('weatherApp', []);


//Main controller.  Controls input and display
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

//Weather Service.
weatherApp.factory('weatherSrvc', ['$http', '$q', function($http, $q) {

	//Calls OpenWeatherMap API and returns object with city, weather, and temperature
	var getWeather = function(city) {
		//replace QUERY with query type - either by city search or more specfic city id
		//city idea would involve bulk download of city id's and then another search function to determine which city for common names
		var OPEN_WEATHER_PATTERN = 'http://api.openweathermap.org/data/2.5/QUERY=';
		var API_KEY = '&APPID=a0d7e44cdb26abb996246b544a26f161';

		// var url = OPEN_WEATHER_PATTERN.replace('QUERY', 'weather?q=' + city + API_KEY);

		var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + API_KEY + '&callback=JSON_CALLBACK';

		var defer = $q.defer();


		var weather = {
	
		};


		$http.jsonp(url).then(function(response) {
			var data = response.data;
			console.dir(data);
			
			if(data) {
				weather.city = data.name;
				if(data.weather[0]) {
					console.log('yes');
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

	return {
		getWeather: getWeather,
	}
}]);

//Takes a tempertature in fahrenheit and formats it, followed by Celsius equivalent
weatherApp.filter('temperature', function() {
	return function(temp) {
			temp = parseInt(temp);
			var celsius = Math.round((temp - 32) * ( 5/ 9)); 
			var output = temp + '\xB0F / ' + celsius + '\xB0C';
			return output;
	};
})