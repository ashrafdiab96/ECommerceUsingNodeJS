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

const autController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImage,
        createProductValidator,
        createProduct
    );

router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImage,
        updateProductValidator,
        updateProduct
    )
    .delete(
        autController.protect,
        autController.allowedTo('admin'),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;