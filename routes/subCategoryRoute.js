/**
 * @file subCategoryRoute.js
 * @desc sub category routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require('../utils/validator/subCategoryValidator');

const {
    getSubCategories,
    getSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    createFilterObj,
    setCategoryIdToParams,
} = require('../controllers/subCategoryController');

const autController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObj, getSubCategories)
    .post(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        setCategoryIdToParams,
        createSubCategoryValidator,
        createSubCategory
    );

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        autController.protect,
        autController.allowedTo('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        autController.protect,
        autController.allowedTo('admin'),
        deleteSubCategoryValidator,
        deleteSubCategory
    );

module.exports = router;