// Keep the service menu in one place so the cards, selector, and prices agree.
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

const timeOptions = ["9:30 am", "10:45 am", "12:00 pm", "1:15 pm", "2:30 pm", "3:45 pm"];
const serviceGrid = document.querySelector("#service-grid");
const serviceSelect = document.querySelector("#service-select");
const dateInput = document.querySelector("#booking-date");
const timeSlots = document.querySelector("#time-slots");
const bookingForm = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");
const homePage = document.querySelector("#home-page");
const bookingPage = document.querySelector("#booking-page");

let selectedTime = "";

function formatPrice(amount) {
  return `LKR ${new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(amount)}`;
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

    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = `${service.name} · ${formatPrice(service.price)}`;
    serviceSelect.append(option);
  });
}

function getSelectedService() {
  return services.find((service) => service.id === serviceSelect.value);
}

function formatSelectedDate() {
  if (!dateInput.value) {
    return "Choose a day";
  }

  // Setting noon avoids a date appearing as the previous day in some time zones.
  const localDate = new Date(`${dateInput.value}T12:00:00`);
  return new Intl.DateTimeFormat("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(localDate);
}

function updateSummary() {
  const service = getSelectedService();
  document.querySelector("#summary-service").textContent = service ? service.name : "Choose a service";
  document.querySelector("#summary-date").textContent = formatSelectedDate();
  document.querySelector("#summary-time").textContent = selectedTime || "Choose a time";
  document.querySelector("#summary-price").textContent = service ? formatPrice(service.price) : "LKR —";
}

function renderTimeSlots() {
  timeOptions.forEach((time) => {
    const button = document.createElement("button");
    button.className = "time-slot";
    button.type = "button";
    button.textContent = time;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      selectedTime = time;
      timeSlots.querySelectorAll(".time-slot").forEach((slot) => {
        slot.setAttribute("aria-pressed", String(slot === button));
      });
      formMessage.textContent = "";
      formMessage.classList.remove("is-error");
      updateSummary();
    });
    timeSlots.append(button);
  });
}

function setMinimumDate() {
  // Use the visitor's local calendar date rather than UTC for the date input.
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${year}-${month}-${day}`;
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

  if (isBookingPage) {
    window.scrollTo(0, 0);
  } else if (window.location.hash === "#home") {
    window.scrollTo(0, 0);
  } else if (window.location.hash === "#services") {
    document.querySelector("#services").scrollIntoView();
  } else if (window.location.hash === "#gallery") {
    document.querySelector("#gallery").scrollIntoView();
  }
}

function openBooking(serviceId) {
  if (serviceId) {
    serviceSelect.value = serviceId;
    updateSummary();
  }

  if (window.location.hash !== "#booking") {
    window.location.hash = "booking";
  } else {
    showCurrentPage();
  }
}

renderServices();
renderTimeSlots();
setMinimumDate();
updateSummary();
showCurrentPage();

window.addEventListener("hashchange", showCurrentPage);

serviceGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-service]");
  if (button) {
    openBooking(button.dataset.service);
  }
});

serviceSelect.addEventListener("change", updateSummary);

dateInput.addEventListener("change", () => {
  selectedTime = "";
  timeSlots.querySelectorAll(".time-slot").forEach((slot) => {
    slot.setAttribute("aria-pressed", "false");
  });
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");
  updateSummary();
});
bookingForm.addEventListener("input", () => {
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");
});


bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");

  if (!bookingForm.reportValidity()) {
    return;
  }

  if (!selectedTime) {
    formMessage.textContent =
      "Please choose your preferred time above.";
    formMessage.classList.add("is-error");
    timeSlots.querySelector("button").focus();
    return;
  }

  const service = getSelectedService();
  const customerName = document.querySelector("#customer-name").value.trim();
  const customerPhone = document.querySelector("#customer-phone").value.trim();
  const bookingDate = formatSelectedDate();
  const message = [
    "Hello Nails Ceylon, I'd like to request an appointment.",
    "",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Service: ${service.name}`,
    `Preferred date: ${bookingDate}`,
    `Preferred time: ${selectedTime}`,
    `Estimated price: ${formatPrice(service.price)}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/94786788925?text=${encodeURIComponent(message)}`;

  formMessage.textContent = `Thank you, ${customerName}! Opening WhatsApp with your booking request.`;
  window.location.href = whatsappUrl;
});
