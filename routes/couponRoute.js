/**
 * @file couponRoute.js
 * @desc coupon routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator,
} = require('../utils/validator/couponValidator');

// CRUD methods and middlewares
const {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');

// authentication controller -> to authenticate and autherrizate some routes
// const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect, authController.allowedTo('admin', 'manager'));

router
    .route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);

router
    .route('/:id')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
