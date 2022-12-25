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

const router = express.Router();

router
    .route('/')
    .get(getBrands)
    .post(uploadBrandImage, resizeImge, createBrandValidator, createBrand);

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadBrandImage, resizeImge, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;