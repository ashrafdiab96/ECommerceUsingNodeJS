/**
 * @file authController.js
 * @desc auth controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// builtin nodejs hashing package
const crypto = require('crypto');

// nodejs image processing package
const sharp = require('sharp');
// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');
// json web token -> package for generating token
const jwt = require('jsonwebtoken');
// hashing and encrypt passwords
const bcrypt = require('bcryptjs');
// create a strong unique random values
const { v4: uuidv4 } = require('uuid');

const factory = require('./handlersFactory');
// handle upload images
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
// handle send emails
const sendEmail = require('../utils/sendEmail');
// handle generate token
const generateToken = require('../utils/generateToken');
// handle errors
const ApiError = require('../utils/ApiError');
// user model
const User = require('../models/userModel');

/**
 * @method createUserImage
 * @desc upload user profile image
 * @param {*} fieldName
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
        const fileName = `user-${uuidv4()}-${Date.now()}-.jpeg`;
        await sharp()
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${fileName}`);
        
        req.body.profileImg = fileName;
    }
    next();
});

/**
 * @method signup
 * @desc signup new user
 * @route POST /api/v1/auth/signup
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access public
 * @return {object, string} {user, token}
 */
exports.signup = asyncHandler(async (req, res, next) => {
    // create new user
    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        profileImg: req.body.profileImg,
    });

    // generate token
    const token = generateToken(user._id);
    res.status(201).json({ data: user, token });
});
// exports.signup = factory.createOne(User)

/**
 * @method login
 * @desc hahndle user login
 * @route POST /api/v1/auth/login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access public
 * @return {object, string} {user, token}
 */
exports.login = asyncHandler(async (req, res, next) => {
    // check if user is exists and password is correct
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // generate token
    const token = generateToken(user._id);
    res.status(200).json({ data: user, token });
});

/**
 * @method checkUserToken
 * @desc check if token is exists & verify token no chenge happens, not expired
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object} decoded
 */
const checkUserToken = (req, res, next) => {
    // check if token is exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError(
            'You are not login, please login to access this route',
            401
        ));
    }

    // verify token (no chenge happens, not expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
};

/**
 * @middleware protect
 * @desc check if user is exists and don't change his password after token generated
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.protect = asyncHandler(async (req, res, next) => {
    // get user token
    const decoded = checkUserToken(req, res, next);
    
    // check if user is exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError(
            'The user that belongs to this token does no longer exists', 401
        ));
    }
    
    // check if user chenge his password after token generated
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10
        );
        if (passwordChangedTimestamp > decoded.iat) {
            return next(new ApiError(
                'User recently has changed his password, please login again', 401
            ));
        }
    }

    req.user = currentUser;
    next();
});

/**
 * @middleware checkActivation
 * @desc check if user is active or not
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.checkActivation = asyncHandler(async (req, res, next) => {
    // get user token
    const decoded = checkUserToken(req, res, next);
    
    // check if user is exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError(
            'The user that belongs to this token does no longer exists', 401
        ));
    }

    // check if user as deactivate
    if (!currentUser.active) {
        return next(new ApiError(
            'Your account is deactivate, please active your account', 401
        ));
    }
    next();
});

/**
 * @middleware allowedTo
 * @desc check if authenticated user has permission to access routes or not
 * @param {...any} roles 
 * @returns {void} void
 */
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    }
    next();
});

/**
 * @method generateResetCode
 * @desc generate token from 6 digits
 * @returns {integer} resetCode
 */
const generateResetCode = () => {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    return resetCode;
};

/**
 * @method hashGeneratedCode
 * @desc hash generated reset code
 * @param {integer} resetCode 
 * @returns {string} hashedResetCode
 */
const hashGeneratedCode = (resetCode) => {
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    return hashedResetCode;
};

/**
 * @method saveResetCodeData
 * @desc save generated reset code, expires and verified in the db
 * @param {integer} resetCode 
 * @returns {void} void
 */
const saveResetCodeData = asyncHandler(async (user, hashedResetCode) => {
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
});

/**
 * @method setResetCodeDataByUndefine
 * @desc save passwordResetCode, passwordResetExpires & passwordResetVerified -
 * - by undefined when any error occurs
 * @param {object} user 
 * @returns {void} void
 */
const setResetCodeDataByUndefine = asyncHandler(async (user) => {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
});

/**
 * @method sendResetEmail
 * @desc send reset code via email
 * @param {object} user
 * @param {integer} resetCode
 * @returns {void} void
 */
const sendResetEmail = asyncHandler(async (user, resetCode) => {
    const message = `
        Hi ${user.name},\n
        We are received a request to reset your ${process.env.APP_NAME} password.\n
        ${resetCode}\n
        Enter this code to reset your password.\n
        Please note that this code is valid for only 10 minutes.
    `;
    await sendEmail({
        email: user.email,
        subject: 'Your password reset code',
        message,
    });
});

/**
 * @method forgetPassword
 * @desc handle forget password
 * @route POST /api/v1/auth/forgetPassword
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // get user and check if exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(
            `User with email: ${ req.body.email } is not found`, 404
        ));
    }
    
    // generate reset code, hash it and save it in the db
    const resetCode = generateResetCode();
    const hashedResetCode = hashGeneratedCode(resetCode);
    await saveResetCodeData(user, hashedResetCode);
    
    // send the reset code via email
    try {
        await sendResetEmail(user, resetCode);
    } catch (error) {
        await setResetCodeDataByUndefine(user);
        return next(new ApiError('There is an error in sending email', 500));
    }
    res.status(200).json({ success: 'Success', message: 'Reset code sent to email' });
});

/**
 * @method verifyResetCode
 * @desc verify reset password code
 * @route POST /api/v1/auth/verifyResetdCode
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = hashGeneratedCode(req.body.resetCode);
    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ApiError('Reset code is invlid or expired', 400));
    }
    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({ status: 'Success' });
});

/**
 * @method resetPassord
 * @desc reset password
 * @route POST /api/v1/auth/resetPassword
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.resetPassord = asyncHandler(async (req, res, next) => {
    // get user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(
            `User with email: ${req.body.email} is not found`, 404
        ));
    }
    // check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError(
            `Reset code not verified`, 400
        ));
    }
    // update oassword and reset password code, expires and verified
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    // generate token
    const token = generateToken(user._id);
    res.status(200).json({ token });
});
