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
} = require('../controllers/categoryController');
const subCategoryRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute);

router
    .route('/')
    .get(getCategories)
    .post(createCategoryValidator, createCategory);
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;