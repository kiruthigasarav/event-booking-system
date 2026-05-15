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

    try {

        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err) {
                    console.log(err);
                    return res
                        .status(500)
                        .send("Database error");
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
                            return res
                                .status(500)
                                .send(
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

    } catch (error) {

        console.log(error);

        res
            .status(500)
            .send("Server error");
    }
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {

                console.log(err);

                return res
                    .status(500)
                    .send("Login failed");
            }

            if (result.length === 0) {

                return res.status(401).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!validPassword) {

                return res.status(401).json({
                    message: "Invalid password"
                });
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
                token,
                user
            });
        }
    );
});

/* ================= VERIFY TOKEN ================= */

function verifyToken(req, res, next) {

    const authHeader =
        req.headers["authorization"];

    if (!authHeader) {

        return res
            .status(403)
            .send("Token required");
    }

    const token =
        authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {

            if (err) {

                return res
                    .status(401)
                    .send("Invalid token");
            }

            req.user = decoded;

            next();
        }
    );
}

/* ================= EVENTS ================= */

// GET EVENTS
app.get("/events", (req, res) => {

    db.query(
        "SELECT * FROM events",
        (err, result) => {

            if (err) {

                console.log(err);

                return res
                    .status(500)
                    .send("Error fetching events");
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
        total_seats
    } = req.body;

    const sql =
        "INSERT INTO events (title, date, venue, total_seats) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [
            title,
            date,
            venue,
            total_seats
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res
                    .status(500)
                    .send("Error adding event");
            }

            res.send(
                "Event added successfully"
            );
        }
    );
});

// UPDATE EVENT
app.put(
    "/update-event/:id",
    (req, res) => {

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

                    return res
                        .status(500)
                        .send(
                            "Error updating event"
                        );
                }

                res.send(
                    "Event updated successfully"
                );
            }
        );
    }
);

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

/* ================= BOOKINGS ================= */

// BOOK TICKET
app.post(
    "/book-ticket",
    (req, res) => {

        const {
            user_id,
            event_id,
            seat_number
        } = req.body;

        const checkSql =
            "SELECT * FROM bookings WHERE event_id=? AND seat_number=?";

        db.query(
            checkSql,
            [
                event_id,
                seat_number
            ],
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
                    (err2) => {

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
    }
);

// MY BOOKINGS
app.get(
    "/my-bookings/:user_id",
    (req, res) => {

        const sql = `
            SELECT 
                e.title,
                e.venue,
                b.seat_number
            FROM bookings b
            JOIN events e
            ON b.event_id = e.id
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

/* ================= START SERVER ================= */

const PORT =
    process.env.PORT || 8080;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});