function renderClubs() {
  const list = document.getElementById("clubsList");
  const clubs = readClubs();
  list.innerHTML = clubs.map(c => `
    <div class="club-card">
      <img class="club-logo" src="${c.imageDataUrl || ''}" alt="">
      <div>
        <h4>${c.name}</h4>
        <p>${c.description}</p>
      </div>
    </div>
  `).join("");
}

document.getElementById("clubForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("clubName").value;
  const description = document.getElementById("clubDesc").value;
  const clubs = readClubs();

  clubs.unshift({ id: uid(), name, description, imageDataUrl: "" });
  writeClubs(clubs);
  toast("Club added!");
  e.target.reset();
  renderClubs();
});
