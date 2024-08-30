const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    identificationNumber: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    sex: { type: String, required: true },
    address: { type: String, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
