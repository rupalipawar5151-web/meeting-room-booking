const pool = require('../config/db');

// Overlap function check
async function findOverlappingBookings(roomId, date, startTime, endTime) {
    const [rows] = await pool.query(
        `SELECT * FROM booking 
         WHERE room_id = ? 
           AND booking_date = ? 
           AND start_time < ? 
           AND end_time > ?`,
        [roomId, date, endTime, startTime]
    );
    return rows;
}


async function createBooking(roomId, bookedBy, purpose, date, startTime, endTime) {
    const [result] = await pool.query(
        `INSERT INTO booking (room_id, booked_by, purpose, booking_date, start_time, end_time)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [roomId, bookedBy, purpose, date, startTime, endTime]
    );
    return result.insertId;
}

async function getAllRooms() {
    const [rows] = await pool.query(`SELECT * FROM room ORDER BY id`);
    return rows;
}

async function getBookingsByDate(date) {
    const [rows] = await pool.query(
        `SELECT * FROM booking WHERE booking_date = ? ORDER BY start_time`,
        [date]
    );
    return rows;
}

module.exports = { findOverlappingBookings, createBooking, getAllRooms, getBookingsByDate };