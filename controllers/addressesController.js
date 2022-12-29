/**
 * @file addressesController.js
 * @desc addresses controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

/**
 * @method getLoggedUserAddresses
 * @desc get logged user adresses
 * @route GET /api/v1/adresses
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {array[object]} addresses
 */

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses');
    res.status(200).json({ result: user.addresses.length, data: user.addresses });
});

/**
 * @method addAddressToUser
 * @desc add an address to user addresses array
 * @route GET /api/v1/addresses
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {array[object]} addresses
 */

exports.addAddressToUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body },
    }, { new: true });
    res.status(200).json({ data: user.addresses });
});

/**
 * @method removeAddressFromUser
 * @desc renove an address from user addresses array
 * @route DELETE /api/v1/addresses
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {array[object]} addresses
 */

exports.removeAddressFromUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } },
    }, { new: true });
    res.status(200).json({ data: user.addresses });
});
