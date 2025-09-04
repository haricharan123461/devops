function renderEvents() {
  const list = document.getElementById("eventsList");
  const searchInput = document.getElementById("eventSearch");
  const q = (searchInput?.value || "").toLowerCase().trim();
  const events = readEvents().sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  const filtered = q
    ? events.filter(e =>
        [e.title, e.description, e.location, e.hostName, e.hostType]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      )
    : events;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty"><strong>No events yet</strong>
      <div>Be the first to host one!</div>
      <div style="margin-top:10px;"><button class="btn" data-nav="#host">Create Event</button></div></div>`;
    return;
  }

  list.innerHTML = filtered.map(e => `
    <div class="event">
      <img src="${e.imageDataUrl || ''}" alt="">
      <div>
        <h4>${e.title}</h4>
        <div class="meta">${e.date} ${e.time} @ ${e.location}</div>
        <div>${e.description}</div>
      </div>
    </div>
  `).join("");
}

document.getElementById("eventSearch")?.addEventListener("input", renderEvents);
