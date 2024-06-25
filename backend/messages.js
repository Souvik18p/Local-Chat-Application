const express = require('express');
const db = require('./database');
const jwt = require('jsonwebtoken');
const messages = express.Router();

const secretKey = 'your_secret_key';

// Middleware to verify token
messages.use((req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
});

// Send a message
messages.post('/send', (req, res) => {
    const { room_id, message } = req.body;

    db.run(`INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)`, [room_id, req.userId, message], function(err) {
        if (err) return res.status(500).send('Error sending message.');
        res.status(201).send({ id: this.lastID, room_id, user_id: req.userId, message });
    });
});

// Get messages from a room
messages.get('/:roomId', (req, res) => {
    const roomId = req.params.roomId;

    db.all(`SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id WHERE room_id = ? ORDER BY timestamp`, [roomId], (err, messages) => {
        if (err) return res.status(500).send('Error retrieving messages.');
        res.status(200).send(messages);
    });
});

module.exports = messages;
