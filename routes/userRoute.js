/**
 * @file userRoute.js
 * @desc user routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
    updateLoggedUserValidator,
} = require('../utils/validator/userValidator');

// CRUD methods and middlewares
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

// authentication controller -> to authenticate and autherrizate some routes
// const authController = require('../controllers/authController');

const router = express.Router();

// user routes 
// router.put('/activeMe', authController.protect, activateLoggedUser);

// authentication middleware
// router.use(authController.protect, authController.checkActivation);
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

// admin routes
// autherization middleware
// router.use(authController.allowedTo('admin'));

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