const express = require("express");
const cors = require('cors'); // Good practice for microservices
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for requests from your main app

const mockWeatherDataAsync = (city, dates) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = dates.map((date) => ({
        date,
        temperature: Math.floor(Math.random() * 15) + 10,
      }));
      resolve(data);
    }, 500); // Simulate a 500ms delay
  });
};

app.post("/forecast", async (req, res) => {
  const { city, dates } = req.body;
  console.log("Received forecast request for:", { city, dates });

  if (!city || !dates || !Array.isArray(dates)) {
    return res.status(400).json({ error: "Invalid request format: city and an array of dates are required" });
  }

  if (dates.length === 0) {
    return res.json({ city, temps: [] }); // Handle empty dates array
  }

  try {
    const temps = await mockWeatherDataAsync(city, dates);
    console.log("Forecast generated:", temps);
    res.json({ city, temps });
  } catch (error) {
    console.error("Error processing forecast request:", error);
    res.status(500).json({ error: "Failed to retrieve forecast data" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather microservice running on port ${PORT}`);
});
