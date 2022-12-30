/**
 * @file categoryRoute.js
 * @desc category routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require('../utils/validator/categoryValidator');

// CRUD methods and middlewares
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require('../controllers/categoryController');

// sub category route -> for nested routes
const subCategoryRoute = require('./subCategoryRoute');

// authentication controller -> to authenticate and autherrizate some routes
const autController = require('../controllers/authController');

const router = express.Router();

// nested route to get subcategories which belng to parent category
router.use('/:categoryId/subcategories', subCategoryRoute);

router
    .route('/')
    .get(getCategories)
    .post(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        autController.protect,
        autController.allowedTo('admin'),
        deleteCategoryValidator,
        deleteCategory
    );

module.exports = router;
