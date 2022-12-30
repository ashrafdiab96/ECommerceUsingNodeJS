/**
 * @file brandRoute.js
 * @desc brands routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../utils/validator/brandValidator');

// CRUD methods and middlewares
const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImge,
} = require('../controllers/brandController');

// authentication controller -> to authenticate and autherrizate some routes
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
