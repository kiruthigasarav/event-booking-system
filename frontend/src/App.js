import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

const API =
  "https://event-booking-system-hjrv.onrender.com";

/* ================= EVENTS PAGE ================= */

function EventsPage({ user }) {
  const [events, setEvents] = useState([]);
  const [seats, setSeats] = useState({});

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    venue: "",
    total_seats: ""
  });

  const [editingEvent, setEditingEvent] =
    useState(null);

  const [organizerBookings, setOrganizerBookings] =
    useState([]);

  /* ================= LOAD EVENTS ================= */

  const loadEvents = useCallback(() => {
    fetch(`${API}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* ================= ADD EVENT ================= */

  const addEvent = () => {
    fetch(`${API}/add-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...newEvent,
        organizer_id: user.id
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        loadEvents();

        setNewEvent({
          title: "",
          date: "",
          venue: "",
          total_seats: ""
        });
      });
  };

  /* ================= DELETE EVENT ================= */

  const deleteEvent = (id) => {
    fetch(`${API}/delete-event/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        loadEvents();
      });
  };

  /* ================= EDIT EVENT ================= */

  const editEvent = (event) => {
    setEditingEvent(event);

    setNewEvent({
      title: event.title,
      date: event.date,
      venue: event.venue,
      total_seats: event.total_seats
    });
  };

  /* ================= UPDATE EVENT ================= */

  const updateEvent = () => {
    fetch(
      `${API}/update-event/${editingEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent)
      }
    )
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        loadEvents();

        setEditingEvent(null);
        setNewEvent({
          title: "",
          date: "",
          venue: "",
          total_seats: ""
        });
      });
  };

  /* ================= VIEW BOOKINGS ================= */

  const viewBookings = (organizerId) => {
    fetch(
      `${API}/organizer-bookings/${organizerId}`
    )
      .then((res) => res.json())
      .then((data) => setOrganizerBookings(data))
      .catch((err) => console.log(err));
  };

  /* ================= BOOK TICKET ================= */

  const bookTicket = (eventId) => {
    const seat = seats[eventId];

    if (!seat) {
      alert("Enter seat number");
      return;
    }

    fetch(`${API}/book-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: eventId,
        seat_number: seat
      })
    })
      .then((res) => res.json())
      .then((data) => alert(data.message));
  };

  return (
    <div>
      {(user.role === "admin" ||
        user.role === "organizer") && (
        <div style={formBox}>
          <h2 style={heading}>Manage Events</h2>

          <div style={inputGrid}>
            <input
              style={input}
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title: e.target.value
                })
              }
            />

            <input
              style={input}
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  date: e.target.value
                })
              }
            />

            <input
              style={input}
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  venue: e.target.value
                })
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
            <button
              style={primaryBtn}
              onClick={updateEvent}
            >
              Update Event
            </button>
          ) : (
            <button
              style={primaryBtn}
              onClick={addEvent}
            >
              Add Event
            </button>
          )}
        </div>
      )}

      <h2 style={heading}>Available Events</h2>

      <div style={eventGrid}>
        {events.map((event) => (
          <div
            key={event.id}
            style={eventCard}
          >
            <div style={cardTop}>
              <h3>{event.title}</h3>
              <span style={badge}>
                {event.venue}
              </span>
            </div>

            <p style={dateText}>{event.date}</p>

            {(user.role === "admin" ||
              (user.role === "organizer" &&
                event.organizer_id === user.id)) && (
              <div>
                <button
                  style={deleteBtn}
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                >
                  Delete
                </button>

                <button
                  style={editBtn}
                  onClick={() => editEvent(event)}
                >
                  Edit
                </button>

                {user.role === "organizer" && (
                  <button
                    style={viewBtn}
                    onClick={() =>
                      viewBookings(user.id)
                    }
                  >
                    View Bookings
                  </button>
                )}
              </div>
            )}

            {user.role === "attendee" && (
              <div style={{ marginTop: "15px" }}>
                <input
                  style={input}
                  placeholder="Seat Number"
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
                  onClick={() =>
                    bookTicket(event.id)
                  }
                >
                  Book Ticket
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {user.role === "organizer" &&
        organizerBookings.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2 style={heading}>Booking Details</h2>

            <div style={eventGrid}>
              {organizerBookings.map((b) => (
                <div
                  key={b.id}
                  style={bookingCard}
                >
                  <h3>{b.title}</h3>
                  <p>User : {b.name}</p>
                  <p>Email : {b.email}</p>

                  <div style={seatBadge}>
                    Seat : {b.seat_number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

/* ================= BOOKINGS PAGE ================= */

function BookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API}/my-bookings/${user.id}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.log(err));
  }, [user.id]);

  return (
    <div>
      <h2 style={heading}>My Bookings</h2>

      <div style={eventGrid}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={bookingCard}
          >
            <h3>{b.title}</h3>
            <p>{b.venue}</p>

            <div style={seatBadge}>
              Seat : {b.seat_number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= APP ================= */

function App() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <BrowserRouter>
      <div style={mainContainer}>
        <div style={overlay}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <EventsPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage user={user} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

/* ================= STYLES ================= */

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
  color: "white"
};

const formBox = {
  background: "rgba(255,255,255,0.12)",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "30px"
};

const inputGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
  gap: "20px",
  marginBottom: "20px"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontSize: "18px",
  width: "100%"
};

const primaryBtn = {
  background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
};

const editBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
};

const viewBtn = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
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
  padding: "22px"
};

const bookingCard = {
  background: "rgba(255,255,255,0.12)",
  borderRadius: "20px",
  padding: "22px"
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between"
};

const badge = {
  background: "#f59e0b",
  padding: "6px 12px",
  borderRadius: "30px"
};

const seatBadge = {
  marginTop: "15px",
  background: "#10b981",
  padding: "10px",
  borderRadius: "12px",
  display: "inline-block"
};

const dateText = {
  opacity: 0.9
};