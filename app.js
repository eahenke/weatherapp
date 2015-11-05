var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('WeatherCtrl', ['weatherSrvc', function(weatherSrvc) {
	var self = this;

	// self.cur = {
	// 	city: 'Chicago',
	// 	main: 'Sunny',
	// 	temp: '70',
	// }

	self.currentCity = 'Chicago';
	self.currentWeather = 'Sunny';
	self.currentTemp = '70';

	self.search = function(city) {
		//problem here is an async issue
		//use $q and deferred objects to set city, main, and temp so that it doesn't have to be the exact same object structure as what the weather service returns

		weatherSrvc.getWeather(city).then(function(result) {
			self.currentCity = result.city;
			self.currentWeather = result.main;
			self.currentTemp = result.temp;
		});
		
	};

}]);

// weatherApp.controller('SearchCtrl', ['weatherSrvc', function(weatherSrvc) {
// 	self.search = function(city) {
// 		weatherSrvc.citySearch(city);
// 	}
// }]);

weatherApp.factory('weatherSrvc', ['$http', '$q', function($http, $q) {
	//code to get weather from openweatherapi here



	//alter later to expose the necessary methods etc;
	var getWeather = function(city) {
		//replace QUERY with query type - either by city search or more specfic city id
		//city idea would involve bulk download of city id's and then another search function to determine which city for common names
		var OPEN_WEATHER_PATTERN = 'http://api.openweathermap.org/data/2.5/QUERY=';
		var API_KEY = '&APPID=a0d7e44cdb26abb996246b544a26f161';

		// var url = OPEN_WEATHER_PATTERN.replace('QUERY', 'weather?q=' + city + API_KEY);

		var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + API_KEY + '&callback=JSON_CALLBACK';

		var defer = $q.defer();


		var weather = {
			city: city,
		};


		$http.jsonp(url).then(function(response) {
			var data = response.data;
			//do something with data
			//console.log(response.data);
			// console.log(data.weather[0].main);

			if(data) {
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

		// return weather;
		return defer.promise;
	}

	return {
		getWeather: getWeather,
	}
}]);