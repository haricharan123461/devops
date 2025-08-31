const STORE_KEYS = {
      events: "cem_events",
      clubs: "cem_clubs"
    };

    // Seed data if empty
    function initStore(){
      if(!localStorage.getItem(STORE_KEYS.events)){
        localStorage.setItem(STORE_KEYS.events, JSON.stringify([]));
      }
      if(!localStorage.getItem(STORE_KEYS.clubs)){
        const seed = [
          { id: uid(), name: "Tech Club", description: "Coding, hackathons, and talks." },
          { id: uid(), name: "Cultural Society", description: "Fests and cultural events." },
          { id: uid(), name: "Sports Council", description: "Sports meets and leagues." },
        ];
        localStorage.setItem(STORE_KEYS.clubs, JSON.stringify(seed));
      }
    }

    function readEvents(){ return JSON.parse(localStorage.getItem(STORE_KEYS.events)||"[]"); }
    function writeEvents(list){ localStorage.setItem(STORE_KEYS.events, JSON.stringify(list)); }
    function readClubs(){ return JSON.parse(localStorage.getItem(STORE_KEYS.clubs)||"[]"); }
    function writeClubs(list){ localStorage.setItem(STORE_KEYS.clubs, JSON.stringify(list)); }

    // Utilities
    function uid(){
      return Math.random().toString(36).slice(2, 8);
    }
    function fourDigitPin(){
      return String(Math.floor(1000 + Math.random()*9000));
    }
    function formatMoneyCents(cents){
      const n = Number(cents||0) / 100;
      return n.toLocaleString(undefined, { style:"currency", currency:"USD" });
    }
    function toast(msg){
      const el = document.getElementById("toast");
      el.textContent = msg;
      el.classList.add("show");
      setTimeout(()=> el.classList.remove("show"), 2000);
    }

    // Router
    const sections = ["home","events","host","manage","clubs"];
    function show(hash){
      const target = (hash || location.hash || "#home").replace("#","");
      sections.forEach(id=>{
        const on = id===target;
        const sec = document.getElementById(id);
        if(!sec) return;
        if(on){ sec.removeAttribute("hidden"); } else { sec.setAttribute("hidden",""); }
        // nav state
        const link = document.querySelector(`.tab[data-tab="${id}"]`);
        if(link){
          link.setAttribute("aria-current", on ? "page" : "");
          link.setAttribute("aria-selected", on ? "true" : "false");
        }
      });
      // Render per-view
      if(target==="events") renderEvents();
      if(target==="clubs") renderClubs();
    }

    // Events view
    function renderEvents(){
      const list = document.getElementById("eventsList");
      const events = readEvents().sort((a,b)=> (a.date||"").localeCompare(b.date||""));
      const q = (document.getElementById("eventSearch").value||"").toLowerCase().trim();
      const filtered = q ? events.filter(e =>
        [e.title, e.description, e.location, e.hostName, e.hostType, (e.clubName||"")]
          .filter(Boolean)
          .some(v=> String(v).toLowerCase().includes(q))
      ) : events;

      if(filtered.length===0){
        list.innerHTML = `
          <div class="empty">
            <strong>No events yet</strong>
            <div>Be the first to host one!</div>
            <div style="margin-top:10px;"><button class="btn" data-nav="#host">Create Event</button></div>
          </div>`;
        bindNavButtons(list);
        return;
      }

      list.innerHTML = filtered.map(e=>{
        const cap = e.capacity ? `<span class="badge" title="Capacity">Capacity: ${e.capacity}</span>` : "";
        const paid = e.paid ? `<span class="badge" title="Price">${formatMoneyCents(e.price)}</span>` : `<span class="badge">Free</span>`;
        const img = e.imageDataUrl ? `<img src="${e.imageDataUrl}" alt="Poster for ${escapeHtml(e.title)}" />`
                                   : `<img src="/placeholder.svg?height=72&width=96" alt="" />`;
        const regButtonDisabled = e.capacity && e.attendees && e.attendees.length >= Number(e.capacity);
        return `
          <article class="event" data-id="${e.id}">
            ${img}
            <div>
              <h4>${escapeHtml(e.title)}</h4>
              <div class="meta">
                ${fmtDateTime(e.date, e.time)} • ${escapeHtml(e.location)} • Hosted by ${escapeHtml(e.hostName)} (${escapeHtml(e.hostType)})
              </div>
              <div class="right" style="margin-top:8px; flex-wrap:wrap;">
                ${cap} ${paid}
                <span class="badge" title="Attendees">${(e.attendees||[]).length} going</span>
                <span class="badge" title="Event ID">ID: ${e.id}</span>
                <button class="btn secondary" data-action="register" ${regButtonDisabled ? 'disabled title="Full"' : ""}>Register</button>
              </div>
            </div>
          </article>
        `;
      }).join("");

      // Bind register
      list.querySelectorAll('[data-action="register"]').forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const parent = btn.closest(".event");
          const id = parent?.getAttribute("data-id");
          if(!id) return;
          const events = readEvents();
          const ev = events.find(x=> x.id===id);
          if(!ev) return;
          ev.attendees = ev.attendees || [];
          // Simplest: anonymous register adds a placeholder attendee
          ev.attendees.push({ id: uid(), name: "Guest" });
          writeEvents(events);
          toast("Registered!");
          renderEvents();
        });
      });
    }

    function fmtDateTime(date, time){
      const d = date ? new Date(date + (time ? "T"+time : "")) : null;
      if(!d || isNaN(d.getTime())) return "TBA";
      const dt = d.toLocaleString(undefined, { weekday:"short", month:"short", day:"numeric" });
      return `${dt}${time ? " • "+time : ""}`;
    }

    // Clubs view
    function renderClubs(){
      const cont = document.getElementById("clubsList");
      const clubs = readClubs();
      if(clubs.length===0){
        cont.innerHTML = `<div class="empty">No clubs yet. Add one on the right.</div>`;
        return;
      }
      cont.innerHTML = clubs.map(c=> `
        <div class="card spacious">
          <div style="font-weight:600;">${escapeHtml(c.name)}</div>
          <div class="muted">${escapeHtml(c.description)}</div>
        </div>
      `).join("");
    }

    // Host form
    const hostForm = document.getElementById("hostForm");
    const paidCb = document.getElementById("paid");
    const priceInput = document.getElementById("price");
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreview");
    let imageDataUrl = "";

    paidCb.addEventListener("change", ()=>{
      priceInput.disabled = !paidCb.checked;
      if(!paidCb.checked){ priceInput.value = ""; }
    });

    imageInput.addEventListener("change", async (e)=>{
      const file = e.target.files?.[0];
      imageDataUrl = "";
      imagePreview.textContent = "";
      if(!file) return;

      try{
        imageDataUrl = await compressImage(file, 1000, 0.8);
        const kb = Math.round((imageDataUrl.length * 3/4) / 1024);
        imagePreview.innerHTML = `<div>Selected image (${kb} KB)</div><img alt="Preview" style="margin-top:8px; max-height:160px; border-radius:8px;" src="${imageDataUrl}" />`;
      }catch(err){
        imagePreview.textContent = "Could not load image.";
      }
    });

    hostForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const form = new FormData(hostForm);
      const title = String(form.get("title")||"").trim();
      const description = String(form.get("description")||"").trim();
      const date = String(form.get("date")||"").trim();
      const time = String(form.get("time")||"").trim();
      const location = String(form.get("location")||"").trim();
      const capacity = String(form.get("capacity")||"").trim();
      const hostType = String(form.get("hostType")||"").trim();
      const hostName = String(form.get("hostName")||"").trim();
      const paid = !!paidCb.checked;
      const price = paid ? Number(form.get("price")||0) : 0;

      if(!title || !description || !date || !time || !location || !hostName){
        toast("Please fill all required fields.");
        return;
      }

      const events = readEvents();
      const event = {
        id: uid(),
        pin: fourDigitPin(),
        title, description, date, time, location,
        capacity: capacity ? Number(capacity) : null,
        hostType, hostName,
        paid, price,
        imageDataUrl: imageDataUrl || "",
        attendees: []
      };
      events.push(event);
      writeEvents(events);

      // Reset
      hostForm.reset();
      imagePreview.textContent = "";
      imageDataUrl = "";
      priceInput.disabled = true;

      const result = document.getElementById("hostResult");
      result.innerHTML = `<div class="card spacious" style="margin-top:12px;">
        <div><strong>Event created!</strong></div>
        <div class="muted">Event ID: <code>${event.id}</code> • PIN: <code>${event.pin}</code></div>
        <div class="right" style="margin-top:8px;">
          <button class="btn ghost" data-copy="${event.id}">Copy ID</button>
          <button class="btn ghost" data-copy="${event.pin}">Copy PIN</button>
          <button class="btn" data-nav="#events">View Events</button>
        </div>
      </div>`;
      bindNavButtons(result);
      result.querySelectorAll('[data-copy]').forEach(b=>{
        b.addEventListener("click", async ()=>{
          try{ await navigator.clipboard.writeText(b.getAttribute("data-copy")||""); toast("Copied!"); }catch{}
        });
      });
    });

    // Manage unlock
    const unlockForm = document.getElementById("unlockForm");
    const managerPanel = document.getElementById("managerPanel");
    const managerHeader = document.getElementById("managerHeader");
    const attendeesList = document.getElementById("attendeesList");
    const attendeeForm = document.getElementById("attendeeForm");

    let unlockedEventId = "";

    unlockForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const id = document.getElementById("unlockEventId").value.trim();
      const pin = document.getElementById("unlockPin").value.trim();
      const ev = readEvents().find(x=> x.id===id && x.pin===pin);
      if(!ev){
        toast("Invalid Event ID or PIN.");
        managerPanel.hidden = true;
        return;
      }
      unlockedEventId = ev.id;
      managerPanel.hidden = false;
      managerHeader.innerHTML = `
        <div>
          <div style="font-weight:700">${escapeHtml(ev.title)}</div>
          <div class="muted">${fmtDateTime(ev.date, ev.time)} • ${escapeHtml(ev.location)}</div>
        </div>
        <div class="right">
          <span class="badge">ID: ${ev.id}</span>
          <span class="badge">PIN: ${ev.pin}</span>
          <span class="badge">${(ev.attendees||[]).length} checked-in</span>
        </div>
      `;
      renderAttendees();
    });

    attendeeForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      if(!unlockedEventId) return;
      const name = document.getElementById("attendeeName").value.trim();
      if(!name){ toast("Enter attendee name."); return; }
      const events = readEvents();
      const ev = events.find(x=> x.id===unlockedEventId);
      if(!ev) return;
      ev.attendees = ev.attendees || [];
      ev.attendees.push({ id: uid(), name });
      writeEvents(events);
      document.getElementById("attendeeName").value = "";
      renderAttendees();
      toast("Checked in");
    });

    function renderAttendees(){
      const ev = readEvents().find(x=> x.id===unlockedEventId);
      const list = ev?.attendees || [];
      attendeesList.innerHTML = list.length ? list.map(a => `
        <li class="between card">
          <span>${escapeHtml(a.name)}</span>
          <button class="btn ghost" data-remove="${a.id}">Remove</button>
        </li>
      `).join("") : `<div class="empty">No attendees yet.</div>`;

      attendeesList.querySelectorAll('[data-remove]').forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const id = btn.getAttribute("data-remove")||"";
          const events = readEvents();
          const ev = events.find(x=> x.id===unlockedEventId);
          if(!ev) return;
          ev.attendees = (ev.attendees||[]).filter(a=> a.id!==id);
          writeEvents(events);
          renderAttendees();
        });
      });

      // Update header counts
      if(ev){
        managerHeader.querySelectorAll(".badge")[2].textContent = `${(ev.attendees||[]).length} checked-in`;
      }
    }

    // Search binding
    document.getElementById("eventSearch").addEventListener("input", renderEvents);

    // Navigation helpers
    function bindNavButtons(scope){
      scope.querySelectorAll('[data-nav]').forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const to = btn.getAttribute("data-nav");
          if(to){ location.hash = to; }
        });
      });
    }
    bindNavButtons(document);

    // Tabs click should just update hash
    document.querySelectorAll('.tab').forEach(a=>{
      a.addEventListener("click", ()=>{ /* default anchor behavior is fine */ });
    });

    // Compression: canvas-based
    function compressImage(file, maxWidth, quality){
      return new Promise((resolve, reject)=>{
        const img = new Image();
        img.crossOrigin = "anonymous";
        const reader = new FileReader();
        reader.onload = () => {
          img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const out = canvas.toDataURL("image/jpeg", quality);
            resolve(out);
          };
          img.onerror = reject;
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function escapeHtml(s){
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // Clubs form
    document.getElementById("clubForm").addEventListener("submit", (e)=>{
      e.preventDefault();
      const name = document.getElementById("clubName").value.trim();
      const desc = document.getElementById("clubDesc").value.trim();
      if(!name || !desc){ toast("Enter club name and description."); return; }
      const clubs = readClubs();
      clubs.push({ id: uid(), name, description: desc });
      writeClubs(clubs);
      document.getElementById("clubForm").reset();
      renderClubs();
      toast("Club added");
    });

    // Boot
    initStore();
    window.addEventListener("hashchange", ()=> show());
    show();

    // Keyboard accessibility for toast (dismiss)
    document.getElementById("toast").addEventListener("click", function(){ this.classList.remove("show"); });
