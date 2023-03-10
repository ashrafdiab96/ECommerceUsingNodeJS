/**
 * @file userController.js
 * @desc uaer controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs image processing package
const sharp = require('sharp');
// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');
// create a strong unique random values
const { v4: uuidv4 } = require('uuid');
// hashing and encrypt passwords
const bcrypt = require('bcryptjs');

// CRUD functions handler
const factory = require('./handlersFactory');
// handle upload images
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
// generate new token
const generateToken = require('../utils/generateToken');
// handle errors
const ApiError = require('../utils/ApiError');
// user model
const User = require('../models/userModel');

/**
 * @method uploadUserImage
 * @desc upload user profile image
 * @param {string} fieldName
 */
exports.uploadUserImage = uploadSingleImage('profileImg');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */
exports.resizeImge = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${fileName}`);
        
        req.body.profileImg = fileName;
    }
    next();
});

/**
 * @method getUsers
 * @desc get all users
 * @route GET /api/v1/users
 * @access public
 * @param {Model} User
 * @param {string} ModelName
 * @return {array[object]} users
 */
exports.getUsers = factory.getAll(User, 'User');

/**
 * @method getUser
 * @desc get specific user by id
 * @route GET /api/v1/users/:id
 * @access public
 * @param {Model} User
 * @return {object} user
 */
exports.getUser = factory.getOne(User);

/**
 * @method createUser
 * @desc create new user
 * @route POST /api/v1/users
 * @access private
 * @param {Model} User
 * @return {object} user
 */
exports.createUser = factory.createOne(User);

/**
 * @method updateUser
 * @desc update specific user by id except password
 * @route PUT /api/v1/users/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} user
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            slug: req.body.slug,
            phone: req.body.phone,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
    { new: true });
    if (!document) {
        return next(new ApiError(`Document with id: ${req.params.id} is not found`, 404));
    }
    res.status(200).json({ data: document });
});

/**
 * @method changeUserPassword
 * @desc chenge user password and hash it
 * @route PUT /api/v1/users/changePassword/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} user
 */
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
    { new: true });
    if (!document) {
        return next(new ApiError(`Document with id: ${req.params.id} is not found`, 404));
    }
    res.status(200).json({ data: document });
});

/**
 * @method deleteUser
 * @desc delete specific user by id
 * @route DELETE /api/v1/users/:id
 * @access private
 * @param {Model} User
 * @return {void} user
 */
exports.deleteUser = factory.deleteOne(User);

/**
 * @method getLoggedUserData
 * @desc set user id in request params and call get() method after this middleware
 * @route GET /api/v1/users/getMe
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

/**
 * @method updateLoggedUserPassword
 * @desc update logged user password
 * @route POST /api/v1/users/updateMyPassword
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
    { new: true });
    const token = generateToken(user._id);
    res.status(200).json({ data: user, token });
});

/**
 * @method updateLoggedUserData
 * @desc update logged user data except password and role
 * @route POST /api/v1/users/updateMyData
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const user = await User.findOneAndUpdate(req.user._id, {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,

    }, { new: true });

    res.status(200).json({ data: user });
});

/**
 * @method deactivateLoggedUser
 * @desc enable user to deactivate his account
 * @route DELETE /api/v1/users/deleteMe
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
    await User.findOneAndUpdate(req.user._id, { active: false });
    res.status(204).json({ status: 'success' });
});

/**
 * @method activateLoggedUser
 * @desc enable user to activate his account
 * @route PUT /api/v1/users/activeMe
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.activateLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOneAndUpdate(req.user._id, { active: true });
    res.status(200).json({ data: user, status: 'success' });
});
