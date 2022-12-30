/**
 * @file reviewsModel.js
 * @desc reviews model
 * @version 1.0.0
 * @author AshrafDiab
 */

// mongo db ODM
const mongoose = require('mongoose');

// product model
const Product = require('./productModel');

/* create reviews schema */
const reviewsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, 'Minimum ratings value is 1.0'],
        max: [5, 'Maximum ratings value is 5.0'],
        required: [true, 'Review ratings required'],
    },
    // parent reference (one to many)
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belongs to user'],
    },
     // parent reference (one to many)
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belongs to product'],
    },
}, { timestamps: true });


/**
 * @middleware
 * @desc make population for user
 * @param {any} matchWord
 * @param {any} toMakePopulation
 */
reviewsSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});

/**
 * @middleware
 * @desc calculate average rating and quantity for product
 * @param {string} productId
 * @returns {void} void
 */
reviewsSchema.statics.calcAvgRatingAndQty = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: 'product',
                avgRating: { $avg: '$rating' },
                ratingQty: { $sum: 1 },
            }
        }
    ]);
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRating,
            ratingsQuantity: result[0].ratingQty,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

/* save ratings data after save or update rating */
reviewsSchema.post('save', async function () {
    await this.constructor.calcAvgRatingAndQty(this.product);
});

/* save ratings data after delete rating */
reviewsSchema.post('remove', async function () {
    await this.constructor.calcAvgRatingAndQty(this.product);
});

/* create review model */
const ReviewModel = mongoose.model('Review', reviewsSchema);

module.exports = ReviewModel;