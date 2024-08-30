const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
