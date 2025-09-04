// Storage Keys
const STORE_KEYS = { events: "cem_events", clubs: "cem_clubs" };

// Seed initial data
function initStore() {
  if (!localStorage.getItem(STORE_KEYS.events)) {
    localStorage.setItem(STORE_KEYS.events, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORE_KEYS.clubs)) {
    const seed = [
      { id: uid(), name: "Tech Club", description: "Coding, hackathons, and talks.", imageDataUrl: "" },
      { id: uid(), name: "Cultural Society", description: "Fests and cultural events.", imageDataUrl: "" },
      { id: uid(), name: "Sports Council", description: "Sports meets and leagues.", imageDataUrl: "" },
    ];
    localStorage.setItem(STORE_KEYS.clubs, JSON.stringify(seed));
  }
}

// LocalStorage CRUD
function readEvents() { return JSON.parse(localStorage.getItem(STORE_KEYS.events) || "[]"); }
function writeEvents(list) { localStorage.setItem(STORE_KEYS.events, JSON.stringify(list)); }
function readClubs() { return JSON.parse(localStorage.getItem(STORE_KEYS.clubs) || "[]"); }
function writeClubs(list) { localStorage.setItem(STORE_KEYS.clubs, JSON.stringify(list)); }

// Utilities
function uid() { return Math.random().toString(36).slice(2, 8); }
function fourDigitPin() { return String(Math.floor(1000 + Math.random() * 9000)); }
function formatMoneyCents(cents) {
  const n = Number(cents || 0) / 100;
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

// Router
const sections = ["home", "events", "host", "manage", "clubs"];
function show(hash) {
  const target = (hash || location.hash || "#home").replace("#", "");
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const on = id === target;
    if (on) sec.removeAttribute("hidden");
    else sec.setAttribute("hidden", "");

    const link = document.querySelector(`.tab[data-tab="${id}"]`);
    if (link) {
      link.setAttribute("aria-current", on ? "page" : "");
      link.setAttribute("aria-selected", on ? "true" : "false");
    }
  });

  const footer = document.getElementById("footer");
  if (footer) target === "home" ? footer.removeAttribute("hidden") : footer.setAttribute("hidden", "");

  // Trigger render functions
  if (target === "events" && typeof renderEvents === "function") renderEvents();
  if (target === "clubs" && typeof renderClubs === "function") renderClubs();
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  initStore();
  show(location.hash);

  // Listen for nav changes
  window.addEventListener("hashchange", () => show(location.hash));

  // Bind data-nav buttons
  document.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-nav]");
    if (btn) {
      e.preventDefault();
      const target = btn.getAttribute("data-nav");
      if (target) {
        location.hash = target;
        show(target);
      }
    }
  });

  // Set footer year
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
