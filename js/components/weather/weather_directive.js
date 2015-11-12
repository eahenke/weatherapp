;(function(){
    var weatherApp = angular.module('weatherApp');

    weatherApp.directive('weather', function() {
        return {
            restricted:'E',
            scope: {},
            templateUrl: 'js/components/weather/_weather.html'
        }
    });

})();