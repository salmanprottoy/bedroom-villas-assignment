const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//config
app.set("view engine", "ejs");

//middleware
app.use(bodyParser.urlencoded({ extended: true }));

//route
app.get("/", (req, res) => {
  res.send("Hello from express server");
});

//server startup
app.listen(3000, (error) => {
  console.log("express server started at 3000...");
});
