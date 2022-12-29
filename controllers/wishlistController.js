/**
 * @file wishlistController.js
 * @desc wishlist controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

/**
 * @method getLoggedUserWishlist
 * @desc get logged user wishlist
 * @route GET /api/v1/wishlist
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {array[object]} wishlist
 */

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ result: user.wishlist.length, data: user.wishlist });
});

/**
 * @method addProductToWishlist
 * @desc add a product to user wishlist array
 * @route GET /api/v1/wishlist
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} userWishlist
 */

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId },
    }, { new: true });
    res.status(200).json({ data: user.wishlist });
});

/**
 * @method removeProductFromWishlist
 * @desc renove a product from user wishlist array
 * @route DELETE /api/v1/wishlist
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId },
    }, { new: true });
    res.status(200).json({ data: user.wishlist });
});
