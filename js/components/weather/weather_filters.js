;(function(window) {
    var weatherApp = angular.module('weatherApp');

    //Takes a tempertature in fahrenheit and formats it, followed by Celsius equivalent
    weatherApp.filter('temperature', function() {
        return function(temp) {
                if(temp) {
                    temp = parseInt(temp);
                    var celsius = Math.round((temp - 32) * ( 5/ 9)); 
                    var output = temp + '\xB0F / ' + celsius + '\xB0C';
                    return output;
                    
                } else {
                    //prevent showing 'NaN' if null or undefined
                    return '';
                }
        };
    });
})(window);