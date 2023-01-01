/**
 * @file orderRoute.js
 * @desc order routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
// const {
    // getOrderValidator,
    // createOrderValidator,
    // updateOrderValidator,
    // deleteOrderValidator,
// } = require('../utils/validator/orderValidator');

// CRUD methods and middlewares
const {
    createCashOrder,
    filterOrderForLoggedUser,
    getOrders,
    getOrder,
    updateOrderPaidStatus,
    updateOrderDeliverStatus,
    checkoutSession,
} = require('../controllers/orderController');

// authentication controller -> to authenticate and autherrizate some routes
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.allowedTo('admin', 'user', 'manager'));

router
    .route('/checkout-session/:cartId')
    .get(checkoutSession)

router
    .route('/')
    .get(filterOrderForLoggedUser, getOrders);

router
    .route('/:cartId')
    .post(createCashOrder);
    
router
    .route('/:id')
    .get(getOrder);

router
    .route('/:id/pay')
    .put(authController.allowedTo('admin'), updateOrderPaidStatus);

router
    .route('/:id/deliver')
    .put(authController.allowedTo('admin'), updateOrderDeliverStatus);

module.exports = router;
