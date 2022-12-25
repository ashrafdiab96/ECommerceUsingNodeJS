/**
 * @file brandModel.js
 * @desc brand model
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');

/* create brand schema */
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name must be unique'],
        minlength: [3, 'Too short brand name'],
        maxlength: [32, 'Too long brand name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, { timestamps: true });

/* set image url */
const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

/* mongoose middleware to return image url on get and update */
brandSchema.post('init', (doc) => setImageUrl(doc));

/* mongoose middleware to return image url on save */
brandSchema.post('save', (doc) => setImageUrl(doc));

/* create brand model */
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;