# Weather App

##About
This weather widget is built on AngularJS.  It checks the weather based on the user's location, and the user may also search the weather in other cities.  If the user blocks the app from checking their location, it defaults to Chicago.

##APIs
Weather: This app uses the OpenWeatherMap API -- http://openweathermap.org/api
Timezones: This app uses the GeoNames timezome API -- http://geonames.org

##To Use/Fork
To make this work, you'll have to get your own keys for the APIs - see their websites.  Once you have keys, enter them in the `js/keys.example.js` file, and rename to `js/keys.js`.  Run `gulp` and the provided `gulpfile.js` should concat your files into `dist/js/app.js` and you're ready to go.  Check `gulpfile.js` for dependencies.

##Demo
See a demo at [eahenke.com/projects/weatherapp](http://eahenke.com/projects/weatherapp).