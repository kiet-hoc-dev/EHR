const express = require('express');
const Brand = require('../models/BrandModel');
const Hospital = require('../models/HospitalModel');

const app = express();

app.post('/add', async (req, res) => {
    const { name, address, hospitalId } = req.body;

    if (!name || !address || !hospitalId) {
        return res.status(400).json({ message: 'Please enter complete information' })
    }

    try {
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital does not exist please re-enter' })
        }

        const newBrand = new Brand({ name, address, hospitalId })
        await newBrand.save()
        res.status(201).json({ message: 'Thêm chi nhánh thành công', id: newBrand._id })
    } catch (err) {
        return res.status(500).json({ message: 'Error add brand', error: err });
    }
})

module.exports = app;