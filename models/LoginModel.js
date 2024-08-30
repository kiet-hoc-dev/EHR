const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true } // 0: hospital, 1: doctor, 2: patient
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
