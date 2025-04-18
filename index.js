const express = require("express");
const cors = require('cors');
const axios = require('axios'); // Import the axios library for making HTTP requests
const app = express();

app.use(express.json());
app.use(cors());

const fetchWeatherData = async (latitude, longitude, startDate, endDate) => {
  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,precipitation_probability,cloud_cover&timezone=auto`;
    const response = await axios.get(url);
    return response.data.hourly;
  } catch (error) {
    console.error("Error fetching data from Open-Meteo:", error);
    throw new Error("Failed to fetch weather data");
  }
};

// Dummy function to get coordinates for a city (replace with a real geocoding service)
const getCityCoordinates = async (city) => {
  // In a real application, you would use a geocoding API
  // to get latitude and longitude from the city name.
  // This is a placeholder for demonstration purposes.
  if (city.toLowerCase() === 'silver firs') {
    return { latitude: 47.9031, longitude: -122.1659 }; // Example coordinates for Silver Firs, WA
  } else if (city.toLowerCase() === 'berlin') {
    return { latitude: 52.52, longitude: 13.41 };
  } else {
    throw new Error(`Coordinates for "${city}" not found.`);
  }
};

app.post("/forecast", async (req, res) => {
  const { city, fromDate, toDate } = req.body;
  console.log("Microservice received:", { city, fromDate, toDate });

  if (!city || !fromDate || !toDate) {
    return res.status(400).json({ error: "Invalid request format: city, fromDate, and toDate are required" });
  }

  try {
    const { latitude, longitude } = await getCityCoordinates(city);
    const weatherData = await fetchWeatherData(latitude, longitude, fromDate, toDate);

    if (!weatherData || !weatherData.time) {
      return res.status(500).json({ error: "Failed to retrieve weather data." });
    }

    const forecastData = weatherData.time.map((time, index) => ({
      date: time.split('T')[0],
      temperature: weatherData.temperature_2m[index],
      precipitation_probability: weatherData.precipitation_probability[index],
      cloud_cover: weatherData.cloud_cover[index],
    }));

    console.log("Microservice fetched forecast:", forecastData);
    res.json({ city, forecast: forecastData }); // Renamed 'temps' to 'forecast' for clarity

  } catch (error) {
    console.error("Error processing forecast request:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather microservice running on port ${PORT}`);
});