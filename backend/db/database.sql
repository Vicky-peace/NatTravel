create database NatTravel

use NatTravel

CREATE TABLE Holidays (
    id INT PRIMARY KEY IDENTITY,
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    price FLOAT NOT NULL
);

-- Accommodations table
CREATE TABLE Accommodations (
    id INT PRIMARY KEY IDENTITY,
    holiday_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    number_of_rooms INT NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (holiday_id) REFERENCES Holidays(id)
);

-- Activities table
CREATE TABLE Activities (
    id INT PRIMARY KEY IDENTITY,
    holiday_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (holiday_id) REFERENCES Holidays(id)
);

-- Users table
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Bookings table
CREATE TABLE Bookings (
    id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL,
    holiday_id INT NOT NULL,
    accommodation_id INT NOT NULL,
    activity_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (holiday_id) REFERENCES Holidays(id),
    FOREIGN KEY (accommodation_id) REFERENCES Accommodations(id),
    FOREIGN KEY (activity_id) REFERENCES Activities(id)
);