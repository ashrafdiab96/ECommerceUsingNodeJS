const crypto = require('crypto');

const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');

/* upload user profile image */
exports.createUserImage = uploadSingleImage('profileImg');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
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
 * @return object
 */
exports.signup = asyncHandler(async (req, res, next) => {
    // create new user
    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });

    // generate token
    const token = generateToken(user._id);
    res.status(201).json({ data: user, token });
});

/**
 * @method login
 * @desc hahndle user login
 * @route POST /api/v1/auth/login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access public
 * @return object
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
 * @returns 
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
    console.log(decoded);
    return decoded;
};

/**
 * @middleware protect
 * @desc check token validation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void
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
 * @return void
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
 * @method allowedTo
 * check if authenticated user has permission to access routes or not
 * @param {...any} roles 
 * @returns 
 */
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    }
    next();
});

/**
 * @method forgetPassword
 * @desc handle forget password
 * @route POST /api/v1/auth/forgetPassword
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // get user and check if exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(
            `User with email: ${ req.body.email } is not found`, 404
        ));
    }
    // generate reset code (6 random digits), encrypt it
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    // save hashed reset code in the db
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    // send the reset code via email
    const message = `
        Hi ${user.name},\n
        We received a request to reset your ${process.env.APP_NAME} password.\n
        ${resetCode}\n
        Enter this code to reset your password.\n
        Please note that this code is valid for only 10 minutes.
    `;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code',
            message,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
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
 * @return void
 */
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    // get user based on reset code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');
    
    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
        // passwordResetVerified: false,
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
 * @return void
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
