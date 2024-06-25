const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const auth = express.Router();
const secretKey = 'your_secret_key';

// Register
auth.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(500).send('User already exists.');

        const token = jwt.sign({ id: this.lastID }, secretKey, { expiresIn: 86400 });
        res.status(201).send({ auth: true, token });
    });
});

// Login
auth.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

module.exports = auth;
