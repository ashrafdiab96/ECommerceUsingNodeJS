/**
 * @file cartController.js
 * @desc cart controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');

// handle errors
const ApiError = require('../utils/ApiError');
// cart model
const Cart = require('../models/cartModel');
// coupon model
const Coupon = require('../models/couponModel');
// product model
const Product = require('../models/productModel');

/**
 * @method calculateTotalCartPrice
 * @desc calculate total cart price
 * @param {object} cart 
 * @returns {number} totalPrice
 */
const calculateTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

/**
 * @method addProductToCart
 * @desc add product to cart and calculate total price
 * @route POST /api/v1/cart
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {object} cart
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    // get product to add
    const product = await Product.findById(productId);
    // get logged user caer
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        // check if there is no cart create one
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }],
        });
    } else {
        // of there is a cart, check if sent product already exists, increase quantity
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() == productId && item.color == color
        );
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
            console.log('index')
        } else {
            // if sent product is not exists, add it to cart
            cart.cartItems.push({ product: productId, color, price: product.price });
        }
    }
    // calculate total price
    calculateTotalCartPrice(cart);
    
    await cart.save();
    res.status(200).json({ cartItems: cart.cartItems.length, data: cart });
});

/**
 * @method getLoggedUserCart
 * @desc get logged user cart
 * @route GET /api/v1/cart
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {object} cart
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(
            `There is no cart for this user ${req.user._id}`, 404
        ));
    }
    res.status(200).json({ cartItems: cart.cartItems.length, data: cart });
});

/**
 * @method removeProductFromCart
 * @desc remove product from cart and calculate total price
 * @route DELETE /api/v1/cart/:itemId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {object} cart
 */
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.itemId } },
    }, { new: true });
    if (!cart) {
        return next(new ApiError(
            `There is no cart for this user ${req.user._id}`, 404
        ));
    }
    calculateTotalCartPrice(cart);
    
    await cart.save();
    res.status(200).json({ cartItems: cart.cartItems.length, data: cart });
});

/**
 * @method clearCart
 * @desc clear cart
 * @route DELETE /api/v1/cart
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {void} void
 */
exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(
            `There is no cart for this user ${req.user._id}`, 404
        ));
    }
    res.status(204).json();
});

/**
 * @method updateCartItemQuantity
 * @desc update cart item quantity
 * @route PUT /api/v1/cart/:itemId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {object} cart
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(
            `There is no cart for this user ${req.user._id}`, 404
        ));
    }
    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() == req.params.itemId
    );

    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(new ApiError(
            `There is no item for this id ${req.params.itemId}`, 404
        ));
    }
    calculateTotalCartPrice(cart);

    await cart.save();
    res.status(200).json({ cartItems: cart.cartItems.length, data: cart });
});

/**
 * @method applyCoupon
 * @desc apply coupon on cart
 * @route PUT /api/v1/cart/applyCoupon
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @access private
 * @returns {object} cart
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // get coupon
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });
    if (!coupon) {
        return next(new ApiError(
            `The coupon ${req.body.coupon} is invalid or expired`, 400
        ));
    }
    const cart = await Cart.findOne({ user: req.user._id });
    const totalPrice = cart.totalCartPrice;
    const discount = (totalPrice - ((totalPrice * coupon.discount) / 100)).toFixed(2);
    cart.totalPriceAfterDiscount = discount;
    await cart.save();
    res.status(200).json({ cartItems: cart.cartItems.length, data: cart });
});
