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

module.exports = { validateInput };

