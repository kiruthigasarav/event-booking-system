import React, { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [seat, setSeat] = useState("");
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState("admin"); // change to attendee / organizer to test
  const [newEvent, setNewEvent] = useState({
  title: "",
  date: "",
  venue: "",
  total_seats: ""
});
  // Fetch events
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  // Fetch bookings
  const getMyBookings = () => {
    fetch("http://localhost:3000/my-bookings/1")
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  // Book ticket
  const bookTicket = (eventId) => {
    if (!seat) {
      alert("Please enter seat number");
      return;
    }

    fetch("http://localhost:3000/book-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: 1,
        event_id: eventId,
        seat_number: seat
      })
    })
      .then(res => res.text())
      .then(data => {
        alert(data);
        getMyBookings();
      });
  };

  const addEvent = () => {
  fetch("http://localhost:3000/add-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent)
  })
    .then(res => res.text())
    .then(data => {
      alert(data);

      // refresh events
      fetch("http://localhost:3000/events")
        .then(res => res.json())
        .then(data => setEvents(data));
    });
};

  // Delete event (Admin / Organizer only)
  const deleteEvent = (id) => {
    fetch(`http://localhost:3000/delete-event/${id}`, {
      method: "DELETE"
    })
      .then(res => res.text())
      .then(data => {
        alert(data);
        // refresh events
        fetch("http://localhost:3000/events")
          .then(res => res.json())
          .then(data => setEvents(data));
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Event Booking System</h1>
      <label>Select Role: </label>
<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="admin">Admin</option>
  <option value="organizer">Organizer</option>
  <option value="attendee">Attendee</option>
</select>
<h2>Add Event</h2>

<input
  placeholder="Title"
  value={newEvent.title}
  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
/>

<input
  placeholder="Date"
  type="date"
  value={newEvent.date}
  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
/>

<input
  placeholder="Venue"
  value={newEvent.venue}
  onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
/>

<input
  placeholder="Seats"
  value={newEvent.total_seats}
  onChange={(e) => setNewEvent({...newEvent, total_seats: e.target.value})}
/>

<button onClick={addEvent}>Add Event</button>
<h3>Role: {role}</h3>

      {/* Seat Input */}
      <input
        type="text"
        placeholder="Enter Seat (A1, A2...)"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
      />

      {/* Events List */}
      <h2>Events List</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} - {event.venue}

            {/* Delete button (only admin & organizer) */}
            {(role === "admin" || role === "organizer") && (
              <button onClick={() => deleteEvent(event.id)}>
                Delete
              </button>
            )}

            {/* Book button */}
            <button onClick={() => bookTicket(event.id)}>
              Book Seat
            </button>
          </li>
        ))}
      </ul>

      {/* Booking History */}
      <h2>My Bookings</h2>
      <button onClick={getMyBookings}>View My Bookings</button>

      <ul>
        {bookings.map((b, index) => (
          <li key={index}>
            {b.title} - {b.venue} - Seat: {b.seat_number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;