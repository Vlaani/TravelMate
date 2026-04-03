const express = require("express");

const { hotels } = require("../db/hotels");
const { validateInput } = require("../db/validateInput");

const router = express.Router();

router.post("/search", (req, res) => {
  const error = validateInput(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const {
    departureCity,
    destinationCountry,
    departureDateFrom,
    departureDateTo,
    nights,
    tourists,
    budget,
    stars
  } = req.body;

  const nightsNum = Number(nights);
  const touristsNum = Number(tourists);
  const budgetNum = Number(budget);
  const starsNum = Number(stars);

  // Для тестовых данных выбираем стартовую дату.
  // Позже можно сделать генерацию случайной даты в диапазоне.
  const selectedDepartureDate = departureDateFrom;

  const results = hotels
    .filter((hotel) => hotel.country.toLowerCase() === String(destinationCountry).toLowerCase())
    .filter((hotel) => hotel.stars >= starsNum)
    .map((hotel) => {
      const totalPrice = hotel.pricePerNightPerPerson * nightsNum * touristsNum;
      return {
        hotelName: hotel.name,
        stars: hotel.stars,
        price: totalPrice,
        location: hotel.location,
        departureDate: selectedDepartureDate,
        hotelInfo: hotel.description,
        imageUrl: hotel.imageUrl,
        departureCity
      };
    })
    .filter((hotel) => hotel.price <= budgetNum);

  return res.json({
    input: {
      departureCity,
      destinationCountry,
      departureDateFrom,
      departureDateTo,
      nights: nightsNum,
      tourists: touristsNum,
      budget: budgetNum,
      stars: starsNum
    },
    totalFound: results.length,
    hotels: results
  });
});

module.exports = router;

