/**
 * @file categoryModel.js
 * @desc category model
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');

/* create schema for category */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category is required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
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
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};

/* mongoose middleware to return image url on get and update */
categorySchema.post('init', (doc) => setImageUrl(doc));

/* mongoose middleware to return image url on save */
categorySchema.post('save', (doc) => setImageUrl(doc));

/* create model for category */
const CategoryModel = mongoose.model('Category', categorySchema); 

module.exports = CategoryModel;