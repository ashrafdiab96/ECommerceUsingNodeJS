/**
 * @file cartRoute.js
 * @desc cart routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions

// CRUD methods and middlewares
const {
    addProductToCart,
    getLoggedUserCart,
    removeProductFromCart,
    clearCart,
    updateCartItemQuantity,
    applyCoupon,
} = require('../controllers/cartController');

// authentication controller -> to authenticate and autherrizate some routes
// const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect, authController.allowedTo('admin', 'user', 'manager'));

router
    .route('/')
    .get(getLoggedUserCart)
    .post(addProductToCart)
    .put(applyCoupon)
    .delete(clearCart);

router
    .route('/:itemId')
    .put(updateCartItemQuantity)
    .delete(removeProductFromCart)

module.exports = router;
