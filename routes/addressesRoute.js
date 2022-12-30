/**
 * @file addressesRoute.js
 * @desc addresses routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    addAddressToUserValidator,
    deleteUserAddressValidator,
} = require('../utils/validator/addressesValidator');

// CRUD methods and middlewares
const {
    getLoggedUserAddresses,
    addAddressToUser,
    removeAddressFromUser,
} = require('../controllers/addressesController');

// authentication controller -> to authenticate and autherrizate some routes
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.allowedTo('user', 'admin'));

router.route('/')
    .get(getLoggedUserAddresses)
    .post(addAddressToUserValidator, addAddressToUser);

router.route('/:addressId')
    .delete(deleteUserAddressValidator, removeAddressFromUser);

module.exports = router;
