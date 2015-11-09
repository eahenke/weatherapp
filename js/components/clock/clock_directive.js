;(function(window) {
    var clockApp = angular.module('clockApp');

    clockApp.directive('clock', ['$interval', 'dateFilter', function($interval, dateFilter) {
        return {
            restricted: 'E',
            scope: {
                format: '@?',

            },
            link: function(scope, element) {
                
                //default to hour, minutes
                if(scope.format == undefined) {
                    scope.format = 'h:mm a';
                }

                var timeoutId;

                function updateTime() {
                    element.text(dateFilter(new Date(), scope.format));
                }

                //always destroy $intervals
                element.on('$destroy', function() {
                    $interval.cancel(timeoutId);
                });

                //update every second
                timeoutId = $interval(function() {
                    updateTime();
                }, 1000);

                //initialize
                updateTime();
            }
        }
    }]);

})(window);