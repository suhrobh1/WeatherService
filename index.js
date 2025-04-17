const express = require("express");
const app = express();

app.use(express.json());

const mockWeatherData = (city, dates) => {
  return dates.map((date) => ({
    date,
    temperature: Math.floor(Math.random() * 15) + 10,
  }));
};

app.post("/forecast", (req, res) => {
  const { city, dates } = req.body;
  console.log("req.body:", req.body);
  if (!city || !dates || !Array.isArray(dates)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const temps = mockWeatherData(city, dates);
  console.log("Forecast is:", temps);
  res.json({ city, temps });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather microservice running on port ${PORT}`);
});
