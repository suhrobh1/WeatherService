const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const generateForecastData = (city, fromDate, toDate) => {
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  const forecastData = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split('T')[0];
    forecastData.push({
      date: formattedDate,
      temperature: Math.floor(Math.random() * 15) + 10,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return forecastData;
};

app.post("/forecast", (req, res) => {
  const { city, fromDate, toDate } = req.body;
  console.log("Microservice received:", { city, fromDate, toDate });

  if (!city || !fromDate || !toDate) {
    return res.status(400).json({ error: "Invalid request format: city, fromDate, and toDate are required" });
  }

  const temps = generateForecastData(city, fromDate, toDate);
  console.log("Microservice generated forecast:", temps);
  res.json({ city, temps });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather microservice running on port ${PORT}`);
});