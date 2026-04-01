const form = document.getElementById("tour-search-form");
const resultsRoot = document.getElementById("results");
const resultsCount = document.getElementById("results-count");
const statusMessage = document.getElementById("status-message");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function renderHotels(hotels) {
  if (!hotels.length) {
    resultsRoot.innerHTML = "<p>По вашему запросу ничего не найдено.</p>";
    return;
  }

  
  resultsRoot.innerHTML = hotels
  .map((hotel) => {
      const starIcons = '<i class="fa-solid fa-star"></i>'.repeat(hotel.stars);
      const imgSrc = hotel.imageUrl
        ? escapeAttr(hotel.imageUrl)
        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%23e8edf5' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";
      return `
        <article class="hotel-card">
          <div class="hotel-card__media">
            <img src="${imgSrc}" alt="${escapeAttr(hotel.hotelName)}" loading="lazy" width="220" height="160" />
          </div>
          <div class="hotel-card__body">
            <h3>${escapeHtml(hotel.hotelName)}</h3>
            <div class="hotel-meta">
              <div class="stars">${starIcons} (${hotel.stars})</div>
              <span><strong>Цена:</strong> ${formatPrice(hotel.price)}</span>
              <span><strong>Локация:</strong> ${escapeHtml(hotel.location)}</span>
              <span><strong>Дата вылета:</strong> ${escapeHtml(hotel.departureDate)}</span>
            </div>
            <p class="hotel-info">${escapeHtml(hotel.hotelInfo)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusMessage.textContent = "Ищем подходящие отели...";
  resultsRoot.innerHTML = "";

  const formData = new FormData(form);
  const payload = {
    departureCity: String(formData.get("departureCity")).trim(),
    destinationCountry: String(formData.get("destinationCountry")).trim(),
    departureDateFrom: String(formData.get("departureDateFrom")),
    departureDateTo: String(formData.get("departureDateTo")),
    nights: Number(formData.get("nights")),
    tourists: Number(formData.get("tourists")),
    budget: Number(formData.get("budget")),
    stars: Number(formData.get("stars"))
  };

  try {
    const response = await fetch("/hotels/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Ошибка при получении данных.");
    }

    resultsCount.textContent = `Найдено: ${data.totalFound}`;
    statusMessage.textContent = "Готово.";
    renderHotels(data.hotels);
  } catch (error) {
    resultsCount.textContent = "Ошибка";
    statusMessage.textContent = error.message;
  }
});
