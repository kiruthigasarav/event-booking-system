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

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        const checkUser =
            "SELECT * FROM users WHERE email=?";

        db.query(
            checkUser,
            [email],
            async (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message:
                            "Database error"
                    });
                }

                if (result.length > 0) {

                    return res.status(400).json({
                        message:
                            "Email already exists"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );

                const sql =
                    `INSERT INTO users
                    (name, email, password, role)
                    VALUES (?, ?, ?, ?)`;

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

                            return res.status(500).json({
                                message:
                                    "Registration failed"
                            });
                        }

                        res.json({
                            message:
                                "User registered successfully"
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {

    const { email, password } =
        req.body;

    const sql =
        "SELECT * FROM users WHERE email=?";

    db.query(
        sql,
        [email],
        async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message:
                        "Database error"
                });
            }

            if (result.length === 0) {

                return res.status(401).json({
                    success: false,
                    message:
                        "User not found"
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
                    success: false,
                    message:
                        "Invalid password"
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
                success: true,
                message:
                    "Login successful",
                token,
                user
            });
        }
    );
});

/* ================= EVENTS ================= */

// GET EVENTS

app.get("/events", (req, res) => {

    const sql =
        "SELECT * FROM events";

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message:
                    "Error fetching events"
            });
        }

        res.json(result);
    });
});

/* ================= ADD EVENT ================= */

app.post("/add-event", (req, res) => {

    const {
        title,
        date,
        venue,
        total_seats,
        organizer_id
    } = req.body;

    const sql =
        `INSERT INTO events
        (title, date, venue,
        total_seats, organizer_id)
        VALUES (?, ?, ?, ?, ?)`;

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

                return res.status(500).json({
                    message:
                        "Error adding event"
                });
            }

            res.json({
                message:
                    "Event added successfully"
            });
        }
    );
});

/* ================= UPDATE EVENT ================= */

app.put("/update-event/:id", (req, res) => {

    const {
        title,
        date,
        venue,
        total_seats
    } = req.body;

    const sql =
        `UPDATE events
        SET title=?,
        date=?,
        venue=?,
        total_seats=?
        WHERE id=?`;

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

                return res.status(500).json({
                    message:
                        "Error updating event"
                });
            }

            res.json({
                message:
                    "Event updated successfully"
            });
        }
    );
});

/* ================= DELETE EVENT ================= */

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

                    return res.status(500).json({
                        message:
                            "Error deleting bookings"
                    });
                }

                db.query(
                    "DELETE FROM events WHERE id=?",
                    [id],
                    (err2) => {

                        if (err2) {

                            console.log(err2);

                            return res.status(500).json({
                                message:
                                    "Error deleting event"
                            });
                        }

                        res.json({
                            message:
                                "Event deleted successfully"
                        });
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

    const checkSeat =
        `SELECT * FROM bookings
        WHERE event_id=?
        AND seat_number=?`;

    db.query(
        checkSeat,
        [event_id, seat_number],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message:
                        "Error checking seat"
                });
            }

            if (result.length > 0) {

                return res.json({
                    message:
                        "Seat already booked"
                });
            }

            const sql =
                `INSERT INTO bookings
                (user_id, event_id, seat_number)
                VALUES (?, ?, ?)`;

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

                        return res.status(500).json({
                            message:
                                "Booking failed"
                        });
                    }

                    res.json({
                        message:
                            "Ticket booked successfully"
                    });
                }
            );
        }
    );
});

/* ================= MY BOOKINGS ================= */

app.get(
    "/my-bookings/:user_id",
    (req, res) => {

        const sql =
            `
            SELECT
            e.title,
            e.venue,
            e.date,
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

                    return res.status(500).json({
                        message:
                            "Error fetching bookings"
                    });
                }

                res.json(result);
            }
        );
    }
);

/* ================= ORGANIZER BOOKINGS ================= */

app.get(
    "/organizer-bookings/:organizer_id",
    (req, res) => {

        const sql = `
            SELECT 
                bookings.id,
                users.name,
                users.email,
                events.title,
                bookings.seat_number
            FROM bookings
            JOIN users
                ON bookings.user_id = users.id
            JOIN events
                ON bookings.event_id = events.id
            WHERE events.organizer_id = ?
        `;

        db.query(
            sql,
            [req.params.organizer_id],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res
                        .status(500)
                        .send(
                            "Error fetching organizer bookings"
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