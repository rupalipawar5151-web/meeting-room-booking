CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    capacity INT NOT NULL
);

CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    booked_by VARCHAR(100) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room(id)
);