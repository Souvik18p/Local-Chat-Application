const express = require('express');
const db = require('./database');
const jwt = require('jsonwebtoken');
const rooms = express.Router();

const secretKey = 'your_secret_key';

// Middleware to verify token
rooms.use((req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
});

// Create a room
rooms.post('/create', (req, res) => {
    const { name } = req.body;

    db.run(`INSERT INTO rooms (name) VALUES (?)`, [name], function(err) {
        if (err) return res.status(500).send('Room already exists.');
        res.status(201).send({ id: this.lastID, name });
    });
});

// Get all rooms
rooms.get('/list', (req, res) => {
    db.all(`SELECT * FROM rooms`, [], (err, rooms) => {
        if (err) return res.status(500).send('Error retrieving rooms.');
        res.status(200).send(rooms);
    });
});

module.exports = rooms;
