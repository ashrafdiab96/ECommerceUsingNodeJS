/**
 * @file userModel.js
 * @desc user model
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

/* create user schema */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

/* set image url */
const setImageUrl = (doc) => {
    if (doc.profileImg) {
        const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
        doc.profileImg = imageUrl;
    }
};

/* mongoose middleware to return image url on get and update */
userSchema.post('init', (doc) => setImageUrl(doc));

/* mongoose middleware to return image url on save */
userSchema.post('save', (doc) => setImageUrl(doc));

/* mongoose middleware to hash password on save */
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

/* create user model */
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
