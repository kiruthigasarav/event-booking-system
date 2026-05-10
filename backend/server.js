const cors = require('cors');//connenct frontend
const express = require('express');
const app = express();
app.use(cors({
    origin: '*'
}));
const db = require('./db');

app.use(express.json());
app.post('/add-event', (req, res) => {
    const { title, date, venue, total_seats } = req.body;

    const sql = 'INSERT INTO events (title, date, venue, total_seats) VALUES (?, ?, ?, ?)';

    db.query(sql, [title, date, venue, total_seats], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error adding event');
        } else {
            res.send('Event added successfully ');
        }
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//  Get All Events
app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events';

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error fetching events');
        } else {
            res.json(result);
        }
    });
});


// Book Ticket
app.post('/book-ticket', (req, res) => {
    const { user_id, event_id, seat_number } = req.body;

    // Step 1: Check if seat already booked
    const checkSql = 'SELECT * FROM bookings WHERE event_id = ? AND seat_number = ?';

    db.query(checkSql, [event_id, seat_number], (err, result) => {
        if (err) {
            return res.send('Error checking seat');
        }

        if (result.length > 0) {
            return res.send(' Seat already booked');
        }

        // Step 2: Insert booking
        const bookSql = 'INSERT INTO bookings (user_id, event_id, seat_number) VALUES (?, ?, ?)';

        db.query(bookSql, [user_id, event_id, seat_number], (err, result) => {
            if (err) {
                return res.send('Error booking ticket');
            }

            res.send('Ticket booked successfully ');
        });
    });
});

//  Get All Bookings
app.get('/bookings', (req, res) => {
    const sql = `
        SELECT b.id, u.name, e.title, b.seat_number
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN events e ON b.event_id = e.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error fetching bookings');
        } else {
            res.json(result);
        }
    });
});

// Get available seats for an event
app.get('/available-seats/:event_id', (req, res) => {
    const eventId = req.params.event_id;

    // Step 1: Get total seats
    const eventSql = 'SELECT total_seats FROM events WHERE id = ?';

    db.query(eventSql, [eventId], (err, eventResult) => {
        if (err) return res.send('Error fetching event');

        const totalSeats = eventResult[0].total_seats;

        // Step 2: Get booked seats
        const bookedSql = 'SELECT seat_number FROM bookings WHERE event_id = ?';

        db.query(bookedSql, [eventId], (err, bookedResult) => {
            if (err) return res.send('Error fetching bookings');

            const bookedSeats = bookedResult.map(b => b.seat_number);

            res.json({
                total_seats: totalSeats,
                booked_seats: bookedSeats,
                available_seats: totalSeats - bookedSeats.length
            });
        });
    });
});

app.get('/my-bookings/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT e.title, e.venue, b.seat_number
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.send('Error fetching user bookings');
        }
        res.json(result);
    });
});

app.put('/update-event/:id', (req, res) => {
    const { title, date, venue, total_seats } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE events 
        SET title=?, date=?, venue=?, total_seats=? 
        WHERE id=?
    `;

    db.query(sql, [title, date, venue, total_seats, id], (err) => {
        if (err) return res.send(err);
        res.send('Event updated');
    });
});

app.delete('/delete-event/:id', (req, res) => {
    const id = req.params.id;

    // Step 1: delete bookings first
    const deleteBookings = 'DELETE FROM bookings WHERE event_id = ?';

    db.query(deleteBookings, [id], (err) => {
        if (err) return res.send('Error deleting bookings');

        // Step 2: delete event
        const deleteEvent = 'DELETE FROM events WHERE id = ?';

        db.query(deleteEvent, [id], (err) => {
            if (err) return res.send('Error deleting event');

            res.send('Event deleted successfully');
        });
    });
});
app.get('/', (req, res) => {
    res.send('Backend Running Successfully');
});