const mongoose = require('mongoose');

/**
 * create schema for category
 */
const categorySchema = new mongoose.Schema({
    name: String,
});

/**
 * create model for category
 */
const CategoryModel = mongoose.model('Category', categorySchema); 

module.exports = CategoryModel;