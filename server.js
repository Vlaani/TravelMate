const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const hotels = [
  {
    id: 1,
    name: "Sunrise Resort & Spa",
    stars: 5,
    location: "Анталья, Турция",
    country: "Турция",
    pricePerNightPerPerson: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Большой all-inclusive отель с пляжем и семейной анимацией."
  },
  {
    id: 2,
    name: "Blue Lagoon Hotel",
    stars: 4,
    location: "Кемер, Турция",
    country: "Турция",
    pricePerNightPerPerson: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Отель у моря с открытым бассейном и удобным трансфером."
  },
  {
    id: 3,
    name: "Nile Palace",
    stars: 5,
    location: "Хургада, Египет",
    country: "Египет",
    pricePerNightPerPerson: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Пятизвездочный отдых с дайвингом и видом на Красное море."
  },
  {
    id: 4,
    name: "Desert Pearl",
    stars: 4,
    location: "Шарм-эш-Шейх, Египет",
    country: "Египет",
    pricePerNightPerPerson: 65,
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "Комфортный отель для активного отдыха и экскурсий."
  },
  {
    id: 5,
    name: "Aegean Breeze Suites",
    stars: 5,
    location: "Родос, Греция",
    country: "Греция",
    pricePerNightPerPerson: 120,
    imageUrl:
      "https://static.tourvisor.ru/hotel_pics/verybig/4/venus-beldibi-hotel-ex-larissa-inn-60495700.jpg",
    description: "Бутик-отель с панорамными террасами и высоким сервисом."
  },
  {
    id: 6,
    name: "Olive Garden Inn",
    stars: 3,
    location: "Крит, Греция",
    country: "Греция",
    pricePerNightPerPerson: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    description: "Уютный отель в спокойной зоне недалеко от пляжа."
  },
  {
    id: 7,
    name: "Iberia Coast Hotel",
    stars: 4,
    location: "Барселона, Испания",
    country: "Испания",
    pricePerNightPerPerson: 110,
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Городской отель рядом с набережной и достопримечательностями."
  },
  {
    id: 8,
    name: "Costa Sol Premium",
    stars: 5,
    location: "Малага, Испания",
    country: "Испания",
    pricePerNightPerPerson: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    description: "Премиум-отель на первой линии моря с видом на залив."
  }
];

function validateInput(body) {
  const requiredFields = [
    "departureCity",
    "destinationCountry",
    "departureDateFrom",
    "departureDateTo",
    "nights",
    "tourists",
    "budget",
    "stars"
  ];

  const missingFields = requiredFields.filter((field) => body[field] === undefined);
  if (missingFields.length > 0) {
    return `Не хватает обязательных полей: ${missingFields.join(", ")}`;
  }

  if (Number(body.nights) <= 0 || Number(body.tourists) <= 0 || Number(body.budget) <= 0) {
    return "Поля nights, tourists и budget должны быть больше нуля.";
  }

  const starsNum = Number(body.stars);
  if (!Number.isFinite(starsNum) || starsNum < 1 || starsNum > 5) {
    return "Поле stars должно быть числом от 1 до 5.";
  }

  return null;
}

app.post("/hotels/search", (req, res) => {
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api", (req, res) => {
  res.json({
    message: "Сервер подбора отелей работает. Используйте POST /hotels/search"
  });
});

app.listen(PORT, () => {
  console.log(`Hotel search API started on http://localhost:${PORT}`);
});
