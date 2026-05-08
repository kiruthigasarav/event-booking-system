import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

/*  EVENTS PAGE  */
function EventsPage({ role, userId }) {
  const [events, setEvents] = useState([]);
  const [seats, setSeats] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    venue: "",
    total_seats: ""
  });

  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // ADD EVENT
  const addEvent = () => {
    fetch("http://localhost:3000/add-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEvent)
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        window.location.reload();
      });
  };

  // DELETE EVENT
  const deleteEvent = (id) => {
    fetch(`http://localhost:3000/delete-event/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        window.location.reload();
      });
  };

  // EDIT EVENT
  const editEvent = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
  };

  // UPDATE EVENT
  const updateEvent = () => {
    fetch(`http://localhost:3000/update-event/${editingEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEvent)
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        window.location.reload();
      });
  };

  // BOOK TICKET
  const bookTicket = (eventId) => {
    const seat = seats[eventId];

    if (!seat) {
      alert("Enter seat number");
      return;
    }

    fetch("http://localhost:3000/book-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        event_id: eventId,
        seat_number: seat
      })
    })
      .then((res) => res.text())
      .then((data) => alert(data));
  };

  return (
    <div>
      {(role === "admin" || role === "organizer") && (
        <div style={formBox}>
          <h2 style={heading}>✨ Manage Events</h2>

          <div style={inputGrid}>
            <input
              style={input}
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />

            <input
              style={input}
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) =>
                setNewEvent({ ...newEvent, venue: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Total Seats"
              value={newEvent.total_seats}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  total_seats: e.target.value
                })
              }
            />
          </div>

          {editingEvent ? (
            <button style={primaryBtn} onClick={updateEvent}>
              Update Event
            </button>
          ) : (
            <button style={primaryBtn} onClick={addEvent}>
              Add Event
            </button>
          )}
        </div>
      )}

      <h2 style={heading}>🎉 Available Events</h2>

      <div style={eventGrid}>
        {events.map((event) => (
          <div key={event.id} style={eventCard}>
            <div style={cardTop}>
              <h3 style={{ margin: 0 }}>{event.title}</h3>
              <span style={badge}>{event.venue}</span>
            </div>

            <p style={dateText}>📅 {event.date}</p>

            {(role === "admin" || role === "organizer") && (
              <div>
                <button
                  style={deleteBtn}
                  onClick={() => deleteEvent(event.id)}
                >
                  Delete
                </button>

                <button
                  style={editBtn}
                  onClick={() => editEvent(event)}
                >
                  Edit
                </button>
              </div>
            )}

            {role === "attendee" && (
              <div style={{ marginTop: "15px" }}>
                <input
                  style={input}
                  placeholder="Enter Seat"
                  value={seats[event.id] || ""}
                  onChange={(e) =>
                    setSeats({
                      ...seats,
                      [event.id]: e.target.value
                    })
                  }
                />

                <button
                  style={primaryBtn}
                  onClick={() => bookTicket(event.id)}
                >
                  Book Ticket
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/*  BOOKINGS PAGE  */

function BookingsPage({ userId }) {
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
    fetch(`http://localhost:3000/my-bookings/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  return (
    <div>
      <div style={bookingHeader}>
        <h2 style={heading}>🧾 My Bookings</h2>

        <button style={primaryBtn} onClick={loadBookings}>
          Load Bookings
        </button>
      </div>

      <div style={eventGrid}>
        {bookings.map((b, i) => (
          <div key={i} style={bookingCard}>
            <h3>{b.title}</h3>

            <p>📍 {b.venue}</p>

            <div style={seatBadge}>
              🎫 Seat : {b.seat_number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*  MAIN APP  */

function App() {
  const [role, setRole] = useState("admin");
  const [userId, setUserId] = useState(1);

  return (
    <BrowserRouter>
      <div style={mainContainer}>
        <div style={overlay}>
          <div style={topBar}>
            <h1 style={mainTitle}>🎟 Event Booking System</h1>

            <select
              style={select}
              value={role}
              onChange={(e) => {
                const selected = e.target.value;

                setRole(selected);

                if (selected === "admin") setUserId(1);
                else if (selected === "organizer") setUserId(2);
                else setUserId(3);
              }}
            >
              <option value="admin">Admin</option>
              <option value="organizer">Organizer</option>
              <option value="attendee">Attendee</option>
            </select>
          </div>

          <nav style={nav}>
            <Link style={navLink} to="/">
              Events
            </Link>

            <Link style={navLink} to="/bookings">
              My Bookings
            </Link>
          </nav>

          <Routes>
            <Route
              path="/"
              element={<EventsPage role={role} userId={userId} />}
            />

            <Route
              path="/bookings"
              element={<BookingsPage userId={userId} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

/*  CSS  */

const mainContainer = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)",
  padding: "30px",
  fontFamily: "Poppins, sans-serif"
};

const overlay = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "25px",
  padding: "30px",
  color: "white",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
};

const mainTitle = {
  fontSize: "40px",
  fontWeight: "bold",
  margin: 0
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px"
};

const nav = {
  marginTop: "25px",
  marginBottom: "25px",
  display: "flex",
  gap: "15px"
};

const navLink = {
  textDecoration: "none",
  color: "white",
  background: "rgba(255,255,255,0.15)",
  padding: "10px 18px",
  borderRadius: "12px",
  fontWeight: "600"
};

const formBox = {
  background: "rgba(255,255,255,0.12)",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "30px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
};

const inputGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
  gap: "15px",
  marginBottom: "20px"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "20px",
  width: "90%",
  marginTop: "10px",
};

const select = {
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  fontSize: "20px",
  fontWeight: "bold"
};

const primaryBtn = {
  background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  fontSize:"20px"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  marginRight: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize:"18px"
};

const editBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize:"18px"
};

const heading = {
  fontSize: "35px",
  marginBottom: "20px"
};

const eventGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
  gap: "20px"
};

const eventCard = {
  background: "rgba(255,255,255,0.12)",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  transition: "0.3s"
};

const bookingCard = {
  background: "rgba(255,255,255,0.12)",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  fontSize:"18px"
};

const badge = {
  background: "#f59e0b",
  color: "white",
  padding: "6px 12px",
  borderRadius: "30px",
  fontSize: "13px",
  fontWeight: "bold",
  fontSize:"25px"
};

const seatBadge = {
  marginTop: "15px",
  background: "#10b981",
  padding: "10px",
  borderRadius: "12px",
  display: "inline-block",
  fontWeight: "bold",
  fontSize:"18px"
};

const dateText = {
  opacity: 0.9
};

const bookingHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  fontSize:"18px"
};


export default App;