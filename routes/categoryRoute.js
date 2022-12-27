/**
 * @file categoryRoute.js
 * @desc category routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require('../utils/validator/categoryValidator');

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require('../controllers/categoryController');
const subCategoryRoute = require('./subCategoryRoute');

const autController = require('../controllers/authController');

const router = express.Router();

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