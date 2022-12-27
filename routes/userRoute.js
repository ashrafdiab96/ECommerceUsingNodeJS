/**
 * @file userRoute.js
 * @desc user routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
    updateLoggedUserValidator,
} = require('../utils/validator/userValidator');

const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImge,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deactivateLoggedUser,
    activateLoggedUser,
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const router = express.Router();

// User
router.put('/activeMe', authController.protect, activateLoggedUser);

router.use(authController.protect, authController.checkActivation);
router.get('/getMe', getLoggedUserData, getUser);
router.put(
    '/updateMyPassword',
    updateLoggedUserPassword
);

router.put(
    '/updateMyData',
    updateLoggedUserValidator,
    updateLoggedUserData
);

router.delete('/deleteMe', deactivateLoggedUser);

// Admin
router.use(authController.allowedTo('admin'));

router.put('/changePassword/:id', changePasswordValidator, changeUserPassword);

router
    .route('/')
    .get(getUsers)
    .post(
        uploadUserImage,
        resizeImge,
        createUserValidator,
        createUser
    );

router
    .route('/:id')
    .get(getUserValidator, getUser)
    .put(
        uploadUserImage,
        resizeImge,
        updateUserValidator,
        updateUser
    )
    .delete(deleteUserValidator, deleteUser);

module.exports = router;