/**
 * @file cartModel.js
 * @desc cart model
 * @version 1.0.0
 * @author AshrafDiab
 */

// mongo db ODM
const mongoose = require('mongoose');

/* create schema for cart */
const cartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required'],
        },
        quantity: {
            type: Number,
            default: 1,
        },
        color: String,
        price: Number,
    }],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    
}, { timestamps: true });

/* create cart model */
const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;
