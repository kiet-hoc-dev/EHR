const express = require('express');
const bcrypt = require('bcrypt');
const Login = require('../models/LoginModel');
const Patient = require('../models/PatientModel')

const app = express();

app.post('/add', async (req, res) => {
    const { name, insuranceNumber, identificationNumber, phone, email, password, address, sex } = req.body;

    if (!identificationNumber || !password || !name || !phone || !insuranceNumber || !address || !sex) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newLogin = new Login({ username: identificationNumber, password: hashedPassword, role: '1' });
        await newLogin.save();

        const newPatient = new Patient({ name, insuranceNumber, identificationNumber, phone, email, address, sex });
        await newPatient.save();

        return res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        if (err.code === 11000) {
            await Login.deleteOne({ username: identificationNumber });
            return res.status(400).json({ message: 'user already exists' });
        }
        return res.status(500).json({ message: 'Server error', error: err });
    }
});

module.exports = app;
