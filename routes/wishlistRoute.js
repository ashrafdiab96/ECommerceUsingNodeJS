/**
 * @file wishlistRoute.js
 * @desc wishlist routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    addProductToWishlistValidator,
    removeProductFromWishlistValidator,
} = require('../utils/validator/wishlistValidator');

// CRUD methods and middlewares
const {
    getLoggedUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
} = require('../controllers/wishlistController');

// authentication controller -> to authenticate and autherrizate some routes
// const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect, authController.allowedTo('user', 'admin'));

router.route('/')
    .get(getLoggedUserWishlist)
    .post(addProductToWishlistValidator, addProductToWishlist);

router.route('/:productId')
    .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
