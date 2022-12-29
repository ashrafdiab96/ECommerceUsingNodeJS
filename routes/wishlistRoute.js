/**
 * @file wishlistRoute.js
 * @desc wishlist routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    addProductToWishlistValidator,
    removeProductFromWishlistValidator,
} = require('../utils/validator/wishlistValidator');

const {
    getLoggedUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
} = require('../controllers/wishlistController');

const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.allowedTo('user', 'admin'));

router.route('/')
    .get(getLoggedUserWishlist)
    .post(addProductToWishlistValidator, addProductToWishlist);

router.route('/:productId')
    .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
