const express = require("express");
const path = require("path");
const hbs = require("hbs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; // ✅ FIXED

// paths
const viewsPath = path.join(__dirname, "templates/views");
const partialsPath = path.join(__dirname, "templates/partials");

// set view engine
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// middleware for static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.render("home", { error: "Please enter a city name." });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    res.render("home", {
      city: response.data.name,
      temp: response.data.main.temp,
      desc: response.data.weather[0].description,
    });
  } catch (err) {
    res.render("home", { error: "City not found!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
