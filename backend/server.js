const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= HOME ================= */

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !role
    ) {
        return res.send("All fields required");
    }

    const checkUserSql =
        "SELECT * FROM users WHERE email=?";

    db.query(
        checkUserSql,
        [email],
        async (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Database error"
                );
            }

            if (result.length > 0) {
                return res.send(
                    "Email already exists"
                );
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const sql =
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

            db.query(
                sql,
                [
                    name,
                    email,
                    hashedPassword,
                    role
                ],
                (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        return res.send(
                            "Registration failed"
                        );
                    }

                    res.send(
                        "User registered successfully"
                    );
                }
            );
        }
    );
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=?";

    db.query(
        sql,
        [email],
        async (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Login failed"
                );
            }

            if (result.length === 0) {
                return res.send(
                    "User not found"
                );
            }

            const user = result[0];

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!validPassword) {
                return res.send(
                    "Invalid password"
                );
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                success: true,
                token,
                user
            });
        }
    );
});

/* ================= EVENTS ================= */

// GET EVENTS
app.get("/events", (req, res) => {
    db.query(
        "SELECT * FROM events ORDER BY id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Error fetching events"
                );
            }

            res.json(result);
        }
    );
});

// ADD EVENT
app.post("/add-event", (req, res) => {
    const {
        title,
        date,
        venue,
        total_seats,
        organizer_id
    } = req.body;

    const sql =
        "INSERT INTO events (title, date, venue, total_seats, organizer_id) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [
            title,
            date,
            venue,
            total_seats,
            organizer_id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Error adding event"
                );
            }

            res.send(
                "Event added successfully"
            );
        }
    );
});

// UPDATE EVENT
app.put("/update-event/:id", (req, res) => {
    const {
        title,
        date,
        venue,
        total_seats
    } = req.body;

    const sql =
        "UPDATE events SET title=?, date=?, venue=?, total_seats=? WHERE id=?";

    db.query(
        sql,
        [
            title,
            date,
            venue,
            total_seats,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Error updating event"
                );
            }

            res.send(
                "Event updated successfully"
            );
        }
    );
});

// DELETE EVENT
app.delete(
    "/delete-event/:id",
    (req, res) => {
        const id = req.params.id;

        db.query(
            "DELETE FROM bookings WHERE event_id=?",
            [id],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.send(
                        "Error deleting bookings"
                    );
                }

                db.query(
                    "DELETE FROM events WHERE id=?",
                    [id],
                    (err2) => {
                        if (err2) {
                            console.log(err2);
                            return res.send(
                                "Error deleting event"
                            );
                        }

                        res.send(
                            "Event deleted successfully"
                        );
                    }
                );
            }
        );
    }
);

/* ================= BOOK TICKET ================= */

app.post("/book-ticket", (req, res) => {
    const {
        user_id,
        event_id,
        seat_number
    } = req.body;

    const checkSql =
        "SELECT * FROM bookings WHERE event_id=? AND seat_number=?";

    db.query(
        checkSql,
        [event_id, seat_number],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(
                    "Error checking seat"
                );
            }

            if (result.length > 0) {
                return res.send(
                    "Seat already booked"
                );
            }

            const sql =
                "INSERT INTO bookings (user_id, event_id, seat_number) VALUES (?, ?, ?)";

            db.query(
                sql,
                [
                    user_id,
                    event_id,
                    seat_number
                ],
                (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        return res.send(
                            "Error booking ticket"
                        );
                    }

                    res.send(
                        "Ticket booked successfully"
                    );
                }
            );
        }
    );
});

/* ================= MY BOOKINGS ================= */

app.get(
    "/my-bookings/:user_id",
    (req, res) => {
        const sql = `
        SELECT 
            e.title,
            e.venue,
            b.seat_number,
            u.name
        FROM bookings b
        JOIN events e 
        ON b.event_id = e.id
        JOIN users u
        ON b.user_id = u.id
        WHERE b.user_id = ?
    `;

        db.query(
            sql,
            [req.params.user_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(
                        "Error fetching bookings"
                    );
                }

                res.json(result);
            }
        );
    }
);

/* ================= ORGANIZER EVENT BOOKINGS ================= */

app.get(
    "/event-bookings/:event_id",
    (req, res) => {
        const sql = `
        SELECT 
            e.title,
            u.name,
            u.email,
            b.seat_number
        FROM bookings b
        JOIN users u
        ON b.user_id = u.id
        JOIN events e
        ON b.event_id = e.id
        WHERE b.event_id = ?
    `;

        db.query(
            sql,
            [req.params.event_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(
                        "Error fetching event bookings"
                    );
                }

                res.json(result);
            }
        );
    }
);

/* ================= SERVER ================= */

const PORT =
    process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});