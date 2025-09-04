document.getElementById("unlockForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const eventId = document.getElementById("unlockEventId").value;
  const pin = document.getElementById("unlockPin").value;

  const event = readEvents().find(ev => ev.id === eventId && ev.pin === pin);
  if (!event) return toast("Invalid ID or PIN");

  document.getElementById("managerPanel").removeAttribute("hidden");
  document.getElementById("managerHeader").textContent = `Managing: ${event.title}`;

  const attendeesList = document.getElementById("attendeesList");
  document.getElementById("attendeeForm").addEventListener("submit", ev => {
    ev.preventDefault();
    const name = document.getElementById("attendeeName").value;
    const li = document.createElement("li");
    li.textContent = name;
    attendeesList.appendChild(li);
    ev.target.reset();
  });
});
