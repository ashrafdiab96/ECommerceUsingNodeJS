/**
 * @file subCategoryRoute.js
 * @desc sub category routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require('../utils/validator/subCategoryValidator');

// CRUD methods and middlewares
const {
    getSubCategories,
    getSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    createFilterObj,
    setCategoryIdToParams,
} = require('../controllers/subCategoryController');

// authentication controller -> to authenticate and autherrizate some routes
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
