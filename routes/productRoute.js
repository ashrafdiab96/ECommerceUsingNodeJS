/**
 * @file productRoute.js
 * @desc products routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validator/productValidator');

// CRUD methods and middlewares
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImage,
} = require('../controllers/productController');

// reviews route -> for nested routes
const reviewsRoute = require("./reviewRoute");

// authentication controller -> to authenticate and autherrizate some routes
const authController = require('../controllers/authController');

const router = express.Router();

// nested route to get subcategories which belng to parent category
router.use('/:productId/reviews', reviewsRoute);

router
    .route('/')
    .get(getProducts)
    .post(
        authController.protect,
        authController.allowedTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImage,
        createProductValidator,
        createProduct
    );

router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        authController.protect,
        authController.allowedTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImage,
        updateProductValidator,
        updateProduct
    )
    .delete(
        authController.protect,
        authController.allowedTo('admin'),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;