const express = require("express");
const http = require("https");
const request = require("request");
var axios = require("axios");
const bodyParser = require("body-parser");
const explayouts = require("express-ejs-layouts");
const { check, validationResult } = require("express-validator");
const { resolve } = require("path");

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

app.get("/all/:country", (req, res) => {
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

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
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

      res.render("home/weather", { weatherData: weatherData });
    }
  });
});

app.get("/all/:country/:city", (req, res) => {
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

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
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

      res.render("home/weather", { weatherData: weatherData });
    }
  });
});

//server startup
app.listen(3000, (error) => {
  console.log("express server started at 3000...");
});
