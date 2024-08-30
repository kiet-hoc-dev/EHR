const express = require('express');
const bcrypt = require('bcrypt');
const Login = require('../models/LoginModel');
const Hospital = require('../models/HospitalModel');

const app = express();

app.post('/add', async (req, res) => {
    const { name, username, password } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Please enter complete information' });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const newLogin = new Login({ username, password: hashedPassword, role: 0 });
        await newLogin.save();

        const newHopital = new Hospital({ name, username });
        await newHopital.save();

        return res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        if (err.code === 11000) {
            await Login.deleteOne({ username });
            return res.status(400).json({ message: 'user already exists' });
        }
        return res.status(500).json({ message: 'Error adding to login or hopital table', error: err });
    }
});

module.exports = app;