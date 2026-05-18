import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  BrowserRouter,
  Routes,
 Route,
  Link,
  Navigate,
  useNavigate
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

  const [
    organizerBookings,
    setOrganizerBookings
  ] = useState([]);

  /* ================= LOAD EVENTS ================= */

  const loadEvents = useCallback(() => {

    fetch(`${API}/events`)
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* ================= ADD EVENT ================= */

  const addEvent = () => {

    if (!user?.id) {
      alert("User ID missing");
      return;
    }

    fetch(`${API}/add-event`, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
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
      })
      .catch((err) => {
        console.log(err);
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
      date: event.date?.split("T")[0] || "",
      venue: event.venue,
      total_seats: event.total_seats
    });
  };

  /* ================= UPDATE EVENT ================= */

  const updateEvent = () => {

    if (!editingEvent) return;

    fetch(
      `${API}/update-event/${editingEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
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

  const viewBookings = () => {

    if (!user?.id) {
      alert("Organizer ID missing");
      return;
    }

    fetch(
      `${API}/organizer-bookings/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setOrganizerBookings(data);
        } else {
          setOrganizerBookings([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* ================= BOOK TICKET ================= */

  const bookTicket = (eventId) => {

    const seat = seats[eventId];

    if (!seat) {

      alert("Enter seat number");

      return;
    }

    if (!user?.id) {

      alert(
        "Login issue. Please login again."
      );

      return;
    }

    fetch(`${API}/book-ticket`, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: eventId,
        seat_number: seat
      })
    })
      .then((res) => res.json())
      .then((data) => {

        alert(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (

    <div>

      {(user?.role === "admin" ||
        user?.role === "organizer") && (

        <div style={formBox}>

          <h2 style={heading}>
            Manage Events
          </h2>

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
                  total_seats:
                    e.target.value
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

      <h2 style={heading}>
        Available Events
      </h2>

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

            <p style={dateText}>
              {new Date(event.date)
                .toLocaleDateString()}
            </p>

            {(user?.role === "admin" ||

              (user?.role === "organizer" &&
                Number(event.organizer_id) === Number(user.id))

            ) && (

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
                  onClick={() =>
                    editEvent(event)
                  }
                >
                  Edit
                </button>

                {user?.role ===
                  "organizer" && (

                  <button
                    style={viewBtn}
                    onClick={viewBookings}
                  >
                    View Bookings
                  </button>
                )}

              </div>
            )}

            {user?.role === "attendee" && (

              <div
                style={{
                  marginTop: "15px"
                }}
              >

                <input
                  style={input}
                  placeholder="Seat Number"
                  value={
                    seats[event.id] || ""
                  }
                  onChange={(e) =>
                    setSeats({
                      ...seats,
                      [event.id]:
                        e.target.value
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

      {user?.role === "organizer" && (

        <div style={{ marginTop: "40px" }}>

          <h2 style={heading}>
            Booking Details
          </h2>

          <div style={eventGrid}>

            {organizerBookings.length === 0 ? (
              <p>No bookings yet</p>
            ) : (
              organizerBookings.map((b) => (

                <div
                  key={b.id}
                  style={bookingCard}
                >

                  <h3>{b.title}</h3>

                  <p>
                    User : {b.name}
                  </p>

                  <p>
                    Email : {b.email}
                  </p>

                  <div style={seatBadge}>
                    Seat : {b.seat_number}
                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      )}

    </div>
  );
}

/* ================= BOOKINGS PAGE ================= */

function BookingsPage({ user }) {

  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {

    if (!user?.id) return;

    fetch(
      `${API}/my-bookings/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }, [user]);

  return (

    <div>

      <h2 style={heading}>
        My Bookings
      </h2>

      <div style={eventGrid}>

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((b, i) => (

            <div
              key={i}
              style={bookingCard}
            >

              <h3>{b.title}</h3>

              <p>{b.venue}</p>

              <div style={seatBadge}>
                Seat : {b.seat_number}
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

/* ================= APP CONTENT ================= */

function AppContent() {

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {

    const storedUser =
      localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  useEffect(() => {

    if (user) {
      navigate("/");
    }

  }, [user, navigate]);

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setUser(null);

    navigate("/login");
  };

  return (

    <div style={mainContainer}>

      <div style={overlay}>

        {user && (

          <div style={topBar}>

            <h1 style={mainTitle}>
              Event Booking System
            </h1>

            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center"
              }}
            >

              <div
                style={{
                  background:
                    "rgba(255,255,255,0.15)",
                  padding: "10px 18px",
                  borderRadius: "12px"
                }}
              >
                {user.name} ({user.role})
              </div>

              <button
                style={deleteBtn}
                onClick={logout}
              >
                Logout
              </button>

            </div>

          </div>
        )}

        {user && (
          <nav style={nav}>

            <Link
              style={navLink}
              to="/"
            >
              Events
            </Link>

            <Link
              style={navLink}
              to="/bookings"
            >
              My Bookings
            </Link>

          </nav>
        )}

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EventsPage
                  user={user}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage
                  user={user}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </div>

    </div>
  );
}

/* ================= APP ================= */

function App() {

  return (

    <BrowserRouter>
      <AppContent />
    </BrowserRouter>

  );
}

/* ================= CSS ================= */

const mainContainer = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)",
  padding: "30px",
  fontFamily:
    "Poppins, sans-serif"
};

const overlay = {
  background:
    "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "25px",
  padding: "30px",
  color: "white",
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.3)"
};

const mainTitle = {
  fontSize: "55px",
  fontWeight: "bold",
  margin: 0
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px"
};

const nav = {
  marginTop: "20px",
  marginBottom: "20px",
  display: "flex",
  gap: "15px"
};

const navLink = {
  textDecoration: "none",
  color: "white",
  background:
    "rgba(255,255,255,0.15)",
  padding: "10px 18px",
  borderRadius: "12px",
  fontWeight: "600"
};

const formBox = {
  background:
    "rgba(255,255,255,0.12)",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "30px",
  width: "100%",
  boxSizing: "border-box"
};

const inputGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px,1fr))",
  gap: "20px",
  marginBottom: "20px",
  width: "100%"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "18px",
  width: "100%",
  boxSizing: "border-box"
};

const primaryBtn = {
  background:
    "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  marginRight: "10px",
  cursor: "pointer"
};

const editBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "10px"
};

const viewBtn = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  marginLeft: "10px",
  cursor: "pointer"
};

const heading = {
  fontSize: "35px",
  marginBottom: "20px"
};

const eventGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px,1fr))",
  gap: "20px"
};

const eventCard = {
  background:
    "rgba(255,255,255,0.12)",
  borderRadius: "20px",
  padding: "22px"
};

const bookingCard = {
  background:
    "rgba(255,255,255,0.12)",
  borderRadius: "20px",
  padding: "22px"
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const badge = {
  background: "#f59e0b",
  color: "white",
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

export default App;