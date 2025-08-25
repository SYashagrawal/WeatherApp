const express = require("express");
const path = require("path");
const hbs = require("hbs");
const axios = require("axios");
require("dotenv").config(); // ✅ Loads .env in local, Render uses dashboard vars

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Paths
const viewsPath = path.join(__dirname, "templates/views");
const partialsPath = path.join(__dirname, "templates/partials");

// ✅ Set view engine
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// ✅ Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
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

    // ✅ Check if API key is missing
    if (!apiKey) {
      return res.render("home", { error: "API Key not configured. Contact admin." });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    res.render("home", {
      city: response.data.name,
      temp: response.data.main.temp,
      desc: response.data.weather[0].description,
    });
  } catch (err) {
    console.error(err.message); // ✅ Debug in logs
    res.render("home", { error: "City not found or API error." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
