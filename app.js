const express = require("express");
const bodyParser = require("body-parser");
const explayouts = require("express-ejs-layouts");
const { check, validationResult } = require("express-validator");

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

app.get("/all", (req, res) => {
  res.send("Hello from express server /all");
});

//server startup
app.listen(3000, (error) => {
  console.log("express server started at 3000...");
});
