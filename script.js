
const services = [
  {
    id: "classic-manicure",
    name: "The Classic Manicure",
    category: "A LITTLE POLISH",
    duration: "45 min",
    price: 4500,
    description: "A tidy shape, cuticle care, and your favourite classic colour."
  },
  {
    id: "gel-manicure",
    name: "The Gel Manicure",
    category: "LONG-WEAR LOVE",
    duration: "60 min",
    price: 7500,
    description: "A little extra staying power with a glossy, chip-resistant finish."
  },
  {
    id: "nail-art",
    name: "The Little Artistry",
    category: "MADE JUST FOR YOU",
    duration: "75 min",
    price: 9500,
    description: "A fresh set with thoughtful details and simple, lovely nail art."
  },
  {
    id: "express-pedicure",
    name: "The Express Pedi",
    category: "TOE TIME",
    duration: "40 min",
    price: 5500,
    description: "A refreshing soak, neat trim, and a coat of feel-good colour."
  },
  {
    id: "signature-pedicure",
    name: "The Signature Pedi",
    category: "A FULL RESET",
    duration: "60 min",
    price: 8500,
    description: "A soothing foot soak, gentle exfoliation, care, and polish."
  },
  {
    id: "mani-pedi",
    name: "The Hands & Toes",
    category: "THE BEST OF BOTH",
    duration: "90 min",
    price: 12500,
    description: "A little care for your hands and feet, all in one lovely visit."
  }
];

const serviceGrid = document.querySelector("#service-grid");
const homePage = document.querySelector("#home-page");
const bookingPage = document.querySelector("#booking-page");
const calendarContainer = document.querySelector(".google-calendar-booking");

let selectedService = null;

function formatPrice(amount) {
  return `LKR ${new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 0
  }).format(amount)}`;
}

// Display the selected service above the Google Calendar.
function createServiceNotice() {
  const notice = document.createElement("div");
  notice.className = "selected-service-notice";
  notice.id = "selected-service-notice";
  notice.setAttribute("aria-live", "polite");

  calendarContainer.prepend(notice);
  updateSelectedService();
}

function updateSelectedService() {
  const notice = document.querySelector("#selected-service-notice");

  if (!notice) return;

  if (selectedService) {
    notice.textContent =
      `Your selected service: ${selectedService.name} · ${formatPrice(selectedService.price)}. Please select this service again in the booking form below.`;
  } else {
    notice.textContent =
      "Choose your preferred appointment time below. Remember to select your service in the booking form.";
  }
}

function renderServices() {
  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";

    const category = document.createElement("span");
    category.className = "service-category";
    category.textContent = service.category;

    const title = document.createElement("h3");
    title.textContent = service.name;

    const description = document.createElement("p");
    description.className = "service-description";
    description.textContent = service.description;

    const bottom = document.createElement("div");
    bottom.className = "service-bottom";

    const price = document.createElement("span");
    price.className = "service-price";
    price.textContent = formatPrice(service.price);

    const bookButton = document.createElement("button");
    bookButton.className = "service-book";
    bookButton.type = "button";
    bookButton.dataset.service = service.id;
    bookButton.textContent = "Choose service ↗";

    bottom.append(price, bookButton);
    card.append(category, title, description, bottom);
    serviceGrid.append(card);
  });
}

function showCurrentPage() {
  const isBookingPage = window.location.hash === "#booking";

  homePage.hidden = isBookingPage;
  bookingPage.hidden = !isBookingPage;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.hash === window.location.hash) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (isBookingPage || window.location.hash === "#home") {
    window.scrollTo(0, 0);
  } else if (window.location.hash === "#services") {
    document.querySelector("#services").scrollIntoView();
  } else if (window.location.hash === "#gallery") {
    document.querySelector("#gallery").scrollIntoView();
  }
}

function openBooking(serviceId) {
  selectedService = services.find(
    (service) => service.id === serviceId
  ) || null;

  updateSelectedService();

  if (window.location.hash !== "#booking") {
    window.location.hash = "booking";
  } else {
    showCurrentPage();
  }
}

renderServices();
createServiceNotice();
showCurrentPage();

window.addEventListener("hashchange", showCurrentPage);

serviceGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-service]");

  if (button) {
    openBooking(button.dataset.service);
  }
});
