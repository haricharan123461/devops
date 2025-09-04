import React, { useState, useEffect, useRef } from 'react';

const CollegeEventManagement = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [paidEvent, setPaidEvent] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [clubLogoPreview, setClubLogoPreview] = useState('');
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [managerUnlocked, setManagerUnlocked] = useState(false);
  const [managerEvent, setManagerEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle navigation
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };
  
  // Handle paid event checkbox
  const handlePaidEventChange = (e) => {
    setPaidEvent(e.target.checked);
  };
  
  // Handle image preview for event
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle club logo preview
  const handleClubLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClubLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle event form submission
  const handleEventSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Event form submitted');
  };
  
  // Handle club form submission
  const handleClubSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Club form submitted');
  };
  
  // Handle manager unlock
  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    // Unlock logic would go here
    setManagerUnlocked(true);
    console.log('Manager unlocked');
  };
  
  // Handle attendee form submission
  const handleAttendeeSubmit = (e) => {
    e.preventDefault();
    // Add attendee logic would go here
    console.log('Attendee added');
  };
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.club && event.club.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Set current year for footer
  useEffect(() => {
    document.getElementById('footerYear').textContent = new Date().getFullYear();
  }, []);
  
  return (
    <div className="college-event-app">
      <header>
        <nav className="nav" aria-label="Main navigation">
          <a 
            href="#home" 
            className="brand" 
            onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
          >
            College Events
          </a>

          <div className="tabs" role="tablist">
            <a 
              href="#home" 
              className={`tab ${activeTab === 'home' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'home'}
              onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
            >
              Home
            </a>
            <a 
              href="#events" 
              className={`tab ${activeTab === 'events' ? 'active' : ''}`}
              role="tab"
              onClick={(e) => { e.preventDefault(); handleNavigation('events'); }}
            >
              Events
            </a>
            <a 
              href="#host" 
              className={`tab ${activeTab === 'host' ? 'active' : ''}`}
              role="tab"
              onClick={(e) => { e.preventDefault(); handleNavigation('host'); }}
            >
              Host
            </a>
            <a 
              href="#manage" 
              className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
              role="tab"
              onClick={(e) => { e.preventDefault(); handleNavigation('manage'); }}
            >
              Manage
            </a>
            <a 
              href="#clubs" 
              className={`tab ${activeTab === 'clubs' ? 'active' : ''}`}
              role="tab"
              onClick={(e) => { e.preventDefault(); handleNavigation('clubs'); }}
            >
              Clubs
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Home Section */}
        <section id="home" style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
          <h1 className="text-balance">College Event Management</h1>
          <p className="lead">Host and manage events by students, clubs, and faculty. Handle registrations, attendance, and simple paid tickets.</p>

          <div className="grid cols-4">
            <div className="card">
              <h3>Browse Events</h3>
              <div className="muted">See upcoming events and register</div>
              <div className="spacious">
                <button className="btn block" onClick={() => handleNavigation('events')}>
                  View Events
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Host an Event</h3>
              <div className="muted">Students, clubs, or faculty</div>
              <div className="spacious">
                <button className="btn secondary block" onClick={() => handleNavigation('host')}>
                  Create Event
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Manage Attendance</h3>
              <div className="muted">Check-in attendees with your PIN</div>
              <div className="spacious">
                <button className="btn ghost block" onClick={() => handleNavigation('manage')}>
                  Open Manager
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Student Clubs</h3>
              <div className="muted">Browse and add clubs</div>
              <div className="spacious">
                <button className="btn ghost block" onClick={() => handleNavigation('clubs')}>
                  Clubs Directory
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" style={{ display: activeTab === 'events' ? 'block' : 'none' }}>
          <div className="between" style={{ marginBottom: '12px' }}>
            <div>
              <h2>Events</h2>
              <div className="muted">Search and register for upcoming events.</div>
            </div>
            <div className="right" style={{ flex: 1, justifyContent: 'flex-end' }}>
              <div className="search" style={{ maxWidth: '520px', width: '100%' }}>
                <label htmlFor="eventSearch" className="sr-only">Search events</label>
                <input 
                  id="eventSearch" 
                  className="input" 
                  type="search" 
                  placeholder="Search events, host, club..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn ghost" onClick={() => handleNavigation('host')}>
                  Host Event
                </button>
              </div>
            </div>
          </div>

          <div id="eventsList" className="list">
            {/* Events would be rendered here dynamically */}
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} className="event-item">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="muted">{event.date} at {event.time} • {event.location}</div>
                </div>
              ))
            ) : (
              <div className="muted">No events found. Try a different search or host a new event.</div>
            )}
          </div>
        </section>

        {/* Host Section */}
        <section id="host" style={{ display: activeTab === 'host' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Host an Event</h2>
            <div className="muted" style={{ marginBottom: '12px' }}>Create events as a student, a club, or faculty.</div>

            <form id="hostForm" onSubmit={handleEventSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="title">Title</label>
                <input className="input" id="title" name="title" required />
              </div>

              <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea className="textarea" id="description" name="description" required></textarea>
              </div>

              <div className="form-row cols-3">
                <div>
                  <label htmlFor="date">Date</label>
                  <input className="input" id="date" type="date" name="date" required />
                </div>
                <div>
                  <label htmlFor="time">Time</label>
                  <input className="input" id="time" type="time" name="time" required />
                </div>
                <div>
                  <label htmlFor="location">Location</label>
                  <input className="input" id="location" name="location" required />
                </div>
              </div>

              <div className="form-row cols-2">
                <div>
                  <label htmlFor="capacity">Capacity (optional)</label>
                  <input className="input" id="capacity" name="capacity" type="number" min="1" placeholder="e.g. 100" />
                </div>
                <div>
                  <label htmlFor="hostType">Host Type</label>
                  <select className="select" id="hostType" name="hostType">
                    <option>Student</option>
                    <option>Club</option>
                    <option>Faculty</option>
                  </select>
                </div>
              </div>

              <div className="form-row cols-2">
                <div>
                  <label htmlFor="hostName">Host Name</label>
                  <input className="input" id="hostName" name="hostName" placeholder="Your name or club" required />
                </div>
                <div>
                  <label htmlFor="price">Price (cents)</label>
                  <input 
                    className="input" 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 500 = $5.00" 
                    disabled={!paidEvent} 
                  />
                  <div className="hint">Enable with "Paid event".</div>
                </div>
              </div>

              <div className="form-row cols-2" style={{ alignItems: 'center' }}>
                <div className="between">
                  <label htmlFor="paid">Paid event</label>
                  <input 
                    id="paid" 
                    type="checkbox" 
                    checked={paidEvent}
                    onChange={handlePaidEventChange}
                  />
                </div>
                <div className="between">
                  <label htmlFor="image">Event Image (optional)</label>
                  <input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div id="imagePreview" className="hint" aria-live="polite">
                {imagePreview && (
                  <div>
                    <p>Image preview:</p>
                    <img src={imagePreview} alt="Event preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  </div>
                )}
              </div>

              <div className="form-row">
                <button className="btn primary" type="submit">Create Event</button>
              </div>

              <div id="hostResult" className="hint" aria-live="polite"></div>
            </form>
          </div>
        </section>

        {/* Manage Section */}
        <section id="manage" style={{ display: activeTab === 'manage' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Attendance Manager</h2>
            <div className="muted">Unlock access with your Event ID and PIN.</div>

            <form id="unlockForm" className="form-row cols-3" style={{ marginTop: '12px' }} onSubmit={handleUnlockSubmit}>
              <div>
                <label htmlFor="unlockEventId">Event ID</label>
                <input id="unlockEventId" className="input" required />
              </div>
              <div>
                <label htmlFor="unlockPin">PIN</label>
                <input id="unlockPin" className="input" required />
              </div>
              <div style={{ alignSelf: 'end' }}>
                <button className="btn primary" type="submit">Unlock</button>
              </div>
            </form>

            <div id="managerPanel" style={{ display: managerUnlocked ? 'block' : 'none' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
              <div id="managerHeader" className="between">
                <h3>Event Manager</h3>
                <button className="btn ghost" onClick={() => setManagerUnlocked(false)}>Lock</button>
              </div>
              <div className="form-row cols-2" style={{ marginTop: '12px' }}>
                <div className="card">
                  <h3>Add Attendee</h3>
                  <form id="attendeeForm" className="form-row" onSubmit={handleAttendeeSubmit}>
                    <div>
                      <label htmlFor="attendeeName">Name</label>
                      <input id="attendeeName" className="input" placeholder="Jane Student" required />
                    </div>
                    <button className="btn success" type="submit">Check In</button>
                  </form>
                  <div className="hint">Checked-in count updates instantly.</div>
                </div>

                <div className="card">
                  <h3>Attendees</h3>
                  <ul id="attendeesList" className="list" aria-live="polite">
                    {attendees.map((attendee, index) => (
                      <li key={index}>{attendee.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clubs Section */}
        <section id="clubs" style={{ display: activeTab === 'clubs' ? 'block' : 'none' }}>
          <div className="grid cols-2">
            <div className="card">
              <h2>Clubs</h2>
              <div className="muted">Browse existing clubs.</div>
              <div id="clubsList" className="list" style={{ marginTop: '12px' }}>
                {clubs.map(club => (
                  <div key={club.id} className="club-item">
                    <h3>{club.name}</h3>
                    <p>{club.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Add a Club</h2>
              <div className="muted">Make it available for hosting</div>
              <form id="clubForm" className="form-row" style={{ marginTop: '12px' }} onSubmit={handleClubSubmit}>
                <div>
                  <label htmlFor="clubName">Club Name</label>
                  <input id="clubName" className="input" required />
                </div>
                <div>
                  <label htmlFor="clubDesc">Description</label>
                  <textarea id="clubDesc" className="textarea" required></textarea>
                </div>

                <div>
                  <label htmlFor="clubLogo">Club Logo (optional)</label>
                  <input 
                    id="clubLogo" 
                    className="input" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleClubLogoChange}
                  />
                  <div id="clubLogoPreview" className="hint" aria-live="polite">
                    {clubLogoPreview && (
                      <div>
                        <p>Logo preview:</p>
                        <img src={clubLogoPreview} alt="Club logo preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>

                <button className="btn primary" type="submit">Add Club</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (visible on home only) */}
      <footer 
        id="footer" 
        className="site-footer" 
        aria-label="Site footer"
        style={{ display: activeTab === 'home' ? 'flex' : 'none' }}
      >
        <div className="footer-left">
          <div style={{ fontWeight: '700' }}>College Events</div>
          <div className="muted" style={{ fontSize: '13px' }}>
            © <span id="footerYear">{new Date().getFullYear()}</span> College Events
          </div>
        </div>

        <div className="footer-right">
          <nav className="social-links" aria-label="Social links">
            {/* Instagram */}
            <a className="social-link" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
              </svg>
              <span className="sr-only">Instagram</span>
            </a>

            {/* Facebook */}
            <a className="social-link" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 8h2.5V5.5H15c-1.1 0-2 .9-2 2V10H11v2h2v6h2v-6h2.5l.5-2H15V7.5C15 7.22 15.22 7 15.5 7H18V5h-2.5C14.01 5 13 6.01 13 7.5V8z" stroke="currentColor" strokeWidth="0" fill="currentColor"/>
              </svg>
              <span className="sr-only">Facebook</span>
            </a>

            {/* Twitter */}
            <a className="social-link" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 7.5c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.8-.6.3-1.4.6-2.1.7C16.9 6.2 16 6 15.2 6c-1.3 0-2.3 1-2.3 2.3 0 .2 0 .4.1.6C10.8 8.8 8.2 7.4 6.6 5.1c-.3.5-.5 1-.5 1.6 0 1.1.6 2 1.5 2.6-.5 0-1-.1-1.4-.4v.1c0 1.3.9 2.4 2.1 2.6-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3-1.1.9-2.5 1.4-4 1.4-.3 0-.7 0-1-.1C6.9 19 8.6 19.5 10.4 19.5c6.2 0 9.5-5.1 9.5-9.5v-.4c.7-.5 1.2-1.2 1.6-1.9-.6.3-1.3.6-2 .7z" fill="currentColor"/>
              </svg>
              <span className="sr-only">Twitter</span>
            </a>

            {/* CBIT Official */}
            <a className="social-link" href="https://www.cbit.ac.in" target="_blank" rel="noopener noreferrer" aria-label="CBIT official site">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm1 12.5V18h-2v-2.5H8.5v-1.5H11V10h2v4h2.5v1.5H13z" fill="currentColor"/>
              </svg>
              <span className="sr-only">CBIT official</span>
            </a>
          </nav>
        </div>
      </footer>

      <div id="toast" className="toast" role="status" aria-live="polite"></div>
    </div>
  );
};

export default CollegeEventManagement;