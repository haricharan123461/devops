document.getElementById("hostForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const events = readEvents();

  const newEvent = {
    id: uid(),
    ...data,
    pin: fourDigitPin(),
    imageDataUrl: ""
  };

  events.push(newEvent);
  writeEvents(events);
  toast("Event created!");
  e.target.reset();
  document.getElementById("hostResult").textContent = `Event created with ID ${newEvent.id} and PIN ${newEvent.pin}`;
});
