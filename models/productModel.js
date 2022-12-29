/**
 * @file productModel.js
 * @desc product model
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');

/* create product schema */
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Product title is required'],
        unique: [true, 'Product must be unique'],
        minlength: [3, 'Too short product name'],
        maxlength: [100, 'Too long product name'],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Too short product description'],
        maxlength: [2000, 'Too long product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        trim: true,
        required: [true, 'Product price is required'],
        max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'Product cover image is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belongs to parent category'],
    },
    subcategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

/* make virtual populate to get product reviews */
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});

/* mongoose middlewaer */
productSchema.pre(/^find/, function(next) {
    this.populate({ path: 'category', select: 'name -_id' });
    next();
});

/* set image url */
const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const images = [];
        doc.images.forEach((image) => {
            const imgUrl = `${process.env.BASE_URL}/products/${image}`;
            images.push(imgUrl);
        });
        doc.images = images;
    }
};

/* mongoose middleware to return image url on get and update */
productSchema.post('init', (doc) => setImageUrl(doc));

/* mongoose middleware to return image url on create */
productSchema.post('save', (doc) => setImageUrl(doc));

/* create product model */
const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;