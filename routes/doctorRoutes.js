const express = require('express');
const bcrypt = require('bcrypt');
const Login = require('../models/LoginModel');
const Doctor = require('../models/DoctorModel');
const Brand = require('../models/BrandModel');

const app = express();

app.post('/add', async (req, res) => {
    const { name, brandID, identificationNumber, phone, email, password, address } = req.body;

    if (!identificationNumber || !password || !name || !phone || !brandID || !address) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const brand = await Brand.findById(brandID);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newLogin = new Login({ username: identificationNumber, password: hashedPassword, role: '1' });
        await newLogin.save();

        const newDoctor = new Doctor({ name, brandID, identificationNumber, phone, email, address });
        await newDoctor.save();

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
