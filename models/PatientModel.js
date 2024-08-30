const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    identificationNumber: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    sex: { type: String, required: true },
    insuranceNumber: { type: String, required: true },
    address: { type: String, required: true }
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
