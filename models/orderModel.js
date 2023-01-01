/**
 * @file orderModel.js
 * @desc order model
 * @version 1.0.0
 * @author AshrafDiab
 */

// mongo db ODM
const mongoose = require('mongoose');

/* create schema for order */
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belongs to user'],
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
        color: String,
        price: Number,
    }],
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    shippingAddress: {
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    totalOrderPrice: Number,
    paymentMethodType: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['card', 'cash'],
        default: 'cash',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: Date,

}, { timestamps: true });

/* middleware to populate user and product */
orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user', select: 'name profileImg email phone',
    }).populate({
        path: 'cartItems.product', select: 'title imageCover',
    });
    next();
});

/* create order model */
const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
