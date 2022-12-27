/**
 * @file brandRoute.js
 * @desc brands routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../utils/validator/brandValidator');

const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImge,
} = require('../controllers/brandController');

const autController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(getBrands)
    .post(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadBrandImage,
        resizeImge,
        createBrandValidator,
        createBrand
    );

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadBrandImage,
        resizeImge,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        autController.protect,
        autController.allowedTo('admin'),
        deleteBrandValidator,
        deleteBrand
    );

module.exports = router;