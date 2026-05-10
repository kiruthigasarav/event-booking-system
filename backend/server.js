const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

// ================= EVENTS =================

// Add event
app.post("/add-event", (req, res) => {
    const { title, date, venue, total_seats } = req.body;

    const sql =
        "INSERT INTO events (title, date, venue, total_seats) VALUES (?, ?, ?, ?)";

    db.query(sql, [title, date, venue, total_seats], (err) => {
        if (err) {
            console.log(err);
            return res.send("Error adding event");
        }
        res.send("Event added successfully");
    });
});

// Get events
app.get("/events", (req, res) => {
    db.query("SELECT * FROM events", (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error fetching events");
        }
        res.json(result);
    });
});

// Update event
app.put("/update-event/:id", (req, res) => {
    const { title, date, venue, total_seats } = req.body;

    const sql =
        "UPDATE events SET title=?, date=?, venue=?, total_seats=? WHERE id=?";

    db.query(sql, [title, date, venue, total_seats, req.params.id], (err) => {
        if (err) return res.send("Error updating event");
        res.send("Event updated");
    });
});

// Delete event
app.delete("/delete-event/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM bookings WHERE event_id=?", [id], (err) => {
        if (err) return res.send("Error deleting bookings");

        db.query("DELETE FROM events WHERE id=?", [id], (err2) => {
            if (err2) return res.send("Error deleting event");
            res.send("Event deleted");
        });
    });
});

// ================= BOOKINGS =================

// Book ticket
app.post("/book-ticket", (req, res) => {
    const { user_id, event_id, seat_number } = req.body;

    const checkSql =
        "SELECT * FROM bookings WHERE event_id=? AND seat_number=?";

    db.query(checkSql, [event_id, seat_number], (err, result) => {
        if (err) return res.send("Error checking seat");

        if (result.length > 0) {
            return res.send("Seat already booked");
        }

        const sql =
            "INSERT INTO bookings (user_id, event_id, seat_number) VALUES (?, ?, ?)";

        db.query(sql, [user_id, event_id, seat_number], (err) => {
            if (err) return res.send("Error booking ticket");
            res.send("Ticket booked successfully");
        });
    });
});

// My bookings
app.get("/my-bookings/:user_id", (req, res) => {
    const sql = `
        SELECT e.title, e.venue, b.seat_number
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
    `;

    db.query(sql, [req.params.user_id], (err, result) => {
        if (err) return res.send("Error fetching bookings");
        res.json(result);
    });
});

// ================= START SERVER =================

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});