const { findOverlappingBookings, createBooking, getAllRooms, getBookingsByDate } = require('../models/bookingModel');

async function bookRoom(req, res) {
    try {
        // Data coming from the frontend (the booking form)
        const { roomId, bookedBy, purpose, date, startTime, endTime } = req.body;

        // Check 1: make sure no field is missing
        if (!roomId || !bookedBy || !purpose || !date || !startTime || !endTime) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check 2: start time must be before end time
        if (startTime >= endTime) {
            return res.status(400).json({ error: "Start time must be before end time" });
        }

        // Check 3: does this new slot overlap with an existing booking?
        const conflicts = await findOverlappingBookings(roomId, date, startTime, endTime);

        if (conflicts.length > 0) {
            // Overlap found -> reject the booking
            return res.status(409).json({
                error: "This room is already booked for that time slot",
                conflicts
            });
        }

        // No overlap -> safe to save the booking
        const newBookingId = await createBooking(roomId, bookedBy, purpose, date, startTime, endTime);

        res.status(201).json({
            message: "Booking successful",
            bookingId: newBookingId
        });

    } catch (err) {
        // Catches unexpected errors (e.g. database down)
        console.error(err);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
}

// Send back the list of rooms (for the dropdown and chart)
async function getRooms(req, res) {
    try {
        const rooms = await getAllRooms();
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not load rooms" });
    }
}

// Send back all bookings for a given date (for the daily chart)
async function getBookingsForDate(req, res) {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: "date query parameter is required" });
        }
        const bookings = await getBookingsByDate(date);
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not load bookings" });
    }
}

module.exports = { bookRoom, getRooms, getBookingsForDate };