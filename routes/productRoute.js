/**
 * @file productRoute.js
 * @desc products routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validator/productValidator');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImage,
} = require('../controllers/productController');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(uploadProductImage, resizeProductImage, createProductValidator, createProduct);

router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(uploadProductImage, resizeProductImage, updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;