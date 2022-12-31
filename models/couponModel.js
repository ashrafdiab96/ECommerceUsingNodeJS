/**
 * @file couponModel.js
 * @desc coupon model
 * @version 1.0.0
 * @author AshrafDiab
 */

// mongo db ODM
const mongoose = require('mongoose');

/* create schema for coupon */
const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon name is required'],
        unique: true,
        uppercase: true,
    },
    expire: {
        type: Date,
        required: [true, 'Coupon expire time is required'],
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount value is required'],
    },
}, { timestamps: true });

/* create coupon model */
const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = CouponModel;
