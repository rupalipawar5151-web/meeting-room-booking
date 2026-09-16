require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Connect the booking routes: any request to /api/bookings goes to bookingRoutes.js
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chalu aahe: http://localhost:${PORT}`);
});