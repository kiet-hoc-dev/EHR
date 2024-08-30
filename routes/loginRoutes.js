const express = require('express');
const bcrypt = require('bcrypt');
const Login = require('../models/LoginModel');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const Hospital = require('../models/HospitalModel');

const app = express();

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và mật khẩu' });
    }

    try {
        // Find the user by username
        const user = await Login.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Sai username hoặc mật khẩu' });
        }

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Sai username hoặc mật khẩu' });
        }

        // Handle roles based on the user's role
        switch (user.role) {
            case '0': // Hospital (BV)
                const hospital = await Hospital.findOne({ username });
                if (hospital) {
                    return res.json(hospital);
                }
                return res.status(404).json({ message: 'Hospital not found' });

            case '1': // Doctor (Doctor)
                const doctor = await Doctor.findOne({ identificationNumber: username });
                if (doctor) {
                    return res.json(doctor);
                }
                return res.status(404).json({ message: 'Doctor not found' });

            case '2': // Patient (Patient)
                const patient = await Patient.findOne({ identificationNumber: username });
                if (patient) {
                    return res.json(patient);
                }
                return res.status(404).json({ message: 'Patient not found' });

            default:
                return res.status(400).json({ message: 'Invalid role' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu', error: err });
    }
});


module.exports = app;
