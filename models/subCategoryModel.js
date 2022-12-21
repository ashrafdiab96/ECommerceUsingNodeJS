/**
 * @file subCategoryModel.js
 * @desc sub category model
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');

/* create schema for sub category */
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Sub categoru name is required'],
        unique: [true, 'Sub category name must be unique'],
        minlength: [3, 'Too short sub category name'],
        maxlength: [32, 'Too long sub category name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Sub category must be belongs to parent category'],
    },
}, { timestamps: true });

/* create model for sub category */
const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;