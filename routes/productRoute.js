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
} = require('../controllers/productController');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(createProductValidator, createProduct);

router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;