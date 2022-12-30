/**
 * @file reviewRoute.js
 * @desc reviews routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require('../utils/validator/reviewValidator');

// CRUD methods and middlewares
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    createFilterObj,
    setProductIdToParams,
} = require('../controllers/reviewsController');

// authentication controller -> to authenticate and autherrizate some routes
const autController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObj, getReviews)
    .post(
        autController.protect,
        autController.allowedTo('user', 'admin'),
        setProductIdToParams,
        createReviewValidator,
        createReview
    );

router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        autController.protect,
        autController.allowedTo('user', 'admin'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        autController.protect,
        autController.allowedTo('admin', 'manager', 'user'),
        deleteReviewValidator,
        deleteReview
    );

module.exports = router;