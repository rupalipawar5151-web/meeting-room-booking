# Meeting Room Booking System

Book meeting rooms by date and time, with automatic overlap
detection to prevent double booking, and a daily room chart to
see availability at a glance.

## Tech Stack
Node.js, Express, MySQL, HTML/CSS/JS

## Features
- Book a room (name, purpose, date, time)
- Blocks double booking via overlap detection
- Daily timeline chart per room
- Blocks past date/time bookings

## Setup
npm install

Create `.env`:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=meeting_room_db
PORT=3000

Run `sql/schema.sql` in MySQL, then:

node server.js

Open `http://localhost:3000`

## Author
Pawar Rupali Nivrutti — MCA-52
