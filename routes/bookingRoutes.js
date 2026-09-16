const express = require('express');
const router = express.Router();
const { bookRoom, getRooms, getBookingsForDate } = require('../controllers/bookingController');

router.get('/rooms', getRooms);        // GET /api/bookings/rooms
router.get('/', getBookingsForDate);   // GET /api/bookings?date=2026-09-16
router.post('/', bookRoom);            // POST /api/bookings

module.exports = router;