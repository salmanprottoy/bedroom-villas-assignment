const express = require("express");
const http = require("https");
const request = require("request");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const explayouts = require("express-ejs-layouts");
const jsonfile = require("jsonfile");
var fs = require("fs");
const { count } = require("console");

const app = express();

//middleware
app.use(explayouts);
app.use("/assets", express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));

//config
app.set("view engine", "ejs");

//route
app.get("/", (req, res) => {
  res.render("home");
});

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 30 second
  max: 1, // start blocking after 1 requests
  message:
    "Too many API request from this IP, please try again after 30 second",
});

app.get("/all/:country", apiRequestLimiter, (req, res) => {
  //Valid for country only
  var country = req.params.country;
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    qs: { q: `${country}`, days: "3" },
    headers: {
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      "x-rapidapi-key": "af8a4d5d3emshe34311a0dfd42e3p1d160bjsn7ba404c8d59d",
      useQueryString: true,
    },
  };

  jsonfile.readFile("./assets/data/data.json", function (err, data) {
    if (err) console.error(err);
    var searchDataFound = false;
    var weatherData = {
      city: "",
      country: "",
      iconSrc: "",
      max_temp_in_c: 0,
      max_temp_in_f: 0,
      min_temp_in_c: 0,
      min_temp_in_f: 0,
      avg_temp_in_c: 0,
      avg_temp_in_f: 0,
    };
    for (var i = 0; i < data.length; i++) {
      if (data[i].country.toLowerCase() == country.toLowerCase()) {
        searchDataFound = true;
        weatherData.city = data[i].city;
        weatherData.country = data[i].country;
        weatherData.iconSrc = data[i].iconSrc;
        weatherData.max_temp_in_c = data[i].max_temp_in_c;
        weatherData.max_temp_in_f = data[i].max_temp_in_f;
        weatherData.min_temp_in_c = data[i].min_temp_in_c;
        weatherData.min_temp_in_f = data[i].min_temp_in_f;
        weatherData.avg_temp_in_c = data[i].avg_temp_in_c;
        weatherData.avg_temp_in_f = data[i].avg_temp_in_f;
        break;
      } else if (data[i].city.toLowerCase() == country.toLowerCase()) {
        res.render("error");
      }
    }
    if (searchDataFound == true) {
      res.render("home/weather", { weatherData: weatherData });
    } else {
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(`API requested for ${country}`);
        if (response.statusCode == "200") {
          var data = JSON.parse(body);
          let max_temp_in_c = 0;
          let max_temp_in_f = 0;
          let min_temp_in_c = 0;
          let min_temp_in_f = 0;
          let avg_temp_in_c = 0;
          let avg_temp_in_f = 0;

          for (let i = 0; i < data.forecast.forecastday.length; i++) {
            max_temp_in_c += data.forecast.forecastday[i].day.maxtemp_c;
            max_temp_in_f += data.forecast.forecastday[i].day.maxtemp_f;
            min_temp_in_c += data.forecast.forecastday[i].day.mintemp_c;
            min_temp_in_f += data.forecast.forecastday[i].day.mintemp_f;
            avg_temp_in_c += data.forecast.forecastday[i].day.avgtemp_c;
            avg_temp_in_f += data.forecast.forecastday[i].day.avgtemp_f;
          }

          max_temp_in_c = max_temp_in_c / 3;
          max_temp_in_f = max_temp_in_f / 3;
          min_temp_in_c = min_temp_in_c / 3;
          min_temp_in_f = min_temp_in_f / 3;
          avg_temp_in_c = avg_temp_in_c / 3;
          avg_temp_in_f = avg_temp_in_f / 3;

          var weatherData = {
            city: data.location.name,
            country: data.location.country,
            iconSrc: data.current.condition.icon,
            max_temp_in_c: parseFloat(max_temp_in_c.toFixed(2)),
            max_temp_in_f: parseFloat(max_temp_in_f.toFixed(2)),
            min_temp_in_c: parseFloat(min_temp_in_c.toFixed(2)),
            min_temp_in_f: parseFloat(min_temp_in_f.toFixed(2)),
            avg_temp_in_c: parseFloat(avg_temp_in_c.toFixed(2)),
            avg_temp_in_f: parseFloat(avg_temp_in_f.toFixed(2)),
          };

          jsonfile.readFile("./assets/data/data.json", function (err, data) {
            if (err) console.error(err);
            var dataFound = false;
            for (var i = 0; i < data.length; i++) {
              if (data[i].country == weatherData.country) {
                dataFound = true;
              }
            }
            if (dataFound == false) {
              data.push(weatherData);
              jsonfile.writeFile(
                "./assets/data/data.json",
                data,
                { spaces: 2, EOL: "\r\n" },
                function (err) {
                  if (err) console.error(err);
                }
              );
            }
          });
          if (weatherData.country.toLowerCase() == country.toLowerCase()) {
            res.render("home/weather", { weatherData: weatherData });
          }
          res.render("error");
        } else if (response.statusCode == "400") {
          res.render("error");
        }
      });
    }
  });
});

app.get("/all/:country/:city", apiRequestLimiter, (req, res) => {
  //Valid for country and city
  var country = req.params.country;
  var city = req.params.city;
  var query = city ? city : country;
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    qs: { q: `${query}`, days: "3" },
    headers: {
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      "x-rapidapi-key": "af8a4d5d3emshe34311a0dfd42e3p1d160bjsn7ba404c8d59d",
      useQueryString: true,
    },
  };

  jsonfile.readFile("./assets/data/data.json", function (err, data) {
    if (err) console.error(err);
    var searchDataFound = false;
    var weatherData = {
      city: "",
      country: "",
      iconSrc: "",
      max_temp_in_c: 0,
      max_temp_in_f: 0,
      min_temp_in_c: 0,
      min_temp_in_f: 0,
      avg_temp_in_c: 0,
      avg_temp_in_f: 0,
    };
    for (var i = 0; i < data.length; i++) {
      if (data[i].city.toLowerCase() == city.toLowerCase()) {
        searchDataFound = true;
        weatherData.city = data[i].city;
        weatherData.country = data[i].country;
        weatherData.iconSrc = data[i].iconSrc;
        weatherData.max_temp_in_c = data[i].max_temp_in_c;
        weatherData.max_temp_in_f = data[i].max_temp_in_f;
        weatherData.min_temp_in_c = data[i].min_temp_in_c;
        weatherData.min_temp_in_f = data[i].min_temp_in_f;
        weatherData.avg_temp_in_c = data[i].avg_temp_in_c;
        weatherData.avg_temp_in_f = data[i].avg_temp_in_f;
        break;
      }
    }
    if (searchDataFound == true) {
      res.render("home/weather", { weatherData: weatherData });
    } else {
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(`API requested for ${query}`);
        if (response.statusCode == "200") {
          var data = JSON.parse(body);
          let max_temp_in_c = 0;
          let max_temp_in_f = 0;
          let min_temp_in_c = 0;
          let min_temp_in_f = 0;
          let avg_temp_in_c = 0;
          let avg_temp_in_f = 0;

          for (let i = 0; i < data.forecast.forecastday.length; i++) {
            max_temp_in_c += data.forecast.forecastday[i].day.maxtemp_c;
            max_temp_in_f += data.forecast.forecastday[i].day.maxtemp_f;
            min_temp_in_c += data.forecast.forecastday[i].day.mintemp_c;
            min_temp_in_f += data.forecast.forecastday[i].day.mintemp_f;
            avg_temp_in_c += data.forecast.forecastday[i].day.avgtemp_c;
            avg_temp_in_f += data.forecast.forecastday[i].day.avgtemp_f;
          }

          max_temp_in_c = max_temp_in_c / 3;
          max_temp_in_f = max_temp_in_f / 3;
          min_temp_in_c = min_temp_in_c / 3;
          min_temp_in_f = min_temp_in_f / 3;
          avg_temp_in_c = avg_temp_in_c / 3;
          avg_temp_in_f = avg_temp_in_f / 3;

          var weatherData = {
            city: data.location.name,
            country: data.location.country,
            iconSrc: data.current.condition.icon,
            max_temp_in_c: parseFloat(max_temp_in_c.toFixed(2)),
            max_temp_in_f: parseFloat(max_temp_in_f.toFixed(2)),
            min_temp_in_c: parseFloat(min_temp_in_c.toFixed(2)),
            min_temp_in_f: parseFloat(min_temp_in_f.toFixed(2)),
            avg_temp_in_c: parseFloat(avg_temp_in_c.toFixed(2)),
            avg_temp_in_f: parseFloat(avg_temp_in_f.toFixed(2)),
          };

          jsonfile.readFile("./assets/data/data.json", function (err, data) {
            if (err) console.error(err);
            var dataFound = false;
            for (var i = 0; i < data.length; i++) {
              if (data[i].city == weatherData.city) {
                dataFound = true;
              }
            }
            if (dataFound == false) {
              data.push(weatherData);
              jsonfile.writeFile(
                "./assets/data/data.json",
                data,
                { spaces: 2, EOL: "\r\n" },
                function (err) {
                  if (err) console.error(err);
                }
              );
            }
          });

          res.render("home/weather", { weatherData: weatherData });
        } else if (response.statusCode == "400") {
          res.render("error");
        }
      });
    }
  });
});

//server startup
app.listen(3000, (error) => {
  console.log("express server started at 3000...");
});
