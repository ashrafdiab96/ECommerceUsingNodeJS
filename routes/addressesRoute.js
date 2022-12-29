/**
 * @file addressesRoute.js
 * @desc addresses routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    addAddressToUserValidator,
    deleteUserAddressValidator,
} = require('../utils/validator/addressesValidator');

const {
    getLoggedUserAddresses,
    addAddressToUser,
    removeAddressFromUser,
} = require('../controllers/addressesController');

const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.allowedTo('user', 'admin'));

router.route('/')
    .get(getLoggedUserAddresses)
    .post(addAddressToUserValidator, addAddressToUser);

router.route('/:addressId')
    .delete(deleteUserAddressValidator, removeAddressFromUser);

module.exports = router;
