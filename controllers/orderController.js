/**
 * @file orderController.js
 * @desc order controller
 * @version 1.0.0
 * @author AshrafDiab
 */
// stripe payment gateway
const stripe = require('stripe')(process.env.STRIPE_SECRECT);
// const stripe = require('stripe')('sk_test_51MLRr0BjgE7KTuZvZ8vBT64mE1K1zYzPXONJAgPoaOTyGXoAVEtpPGYLLl3EQX95VIi9De6eUYPJ01h2K6ar8a0k00Y6NpqyQG');

// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');

// CRUD functions handler
const factory = require('./handlersFactory');
// handle errors
const ApiError = require('../utils/ApiError');
// order model
const Order = require('../models/orderModel');
// cart model
const Cart = require('../models/cartModel');
// product model
const Product = require('../models/productModel');
// user model
const User = require('../models/userModel');

/**
 * @method createCashOrder
 * @desc create cash order
 * @route POST /api/v1/order/cartId
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} order
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // get user cart
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(
            new ApiError(`Cart with id: ${req.params.cartId} is not found`, 404)
        );
    }
    // get order price
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;
    // create order
    // const order = false;
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
    });
    // change product quantity and solt after order created
    if (order) {
        const bulkOptions = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        }));
        await Product.bulkWrite(bulkOptions, {});
        // clear user cart
        await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ data: order });
});

/**
 * @middleware filterOrderForLoggedUser
 * @desc add user role to filter object
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role == 'user') req.filterObj = { user: req.user._id };
    next();
});

/**
 * @method getOrders
 * @desc get all orders by admin
 * @route POST /api/v1/orders
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {Array[object]} orders
 */
exports.getOrders = factory.getAll(Order);

/**
 * @method getOrder
 * @desc get specific order by id
 * @route POST /api/v1/orders/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} order
 */
exports.getOrder = factory.getOne(Order);

/**
 * @method updateOrderPaidStatus
 * @desc update order paid status to true by admin
 * @route PUT /api/v1/orders/:id/paid
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} order
 */
exports.updateOrderPaidStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    console.log(order)
    if (!order) {
        return next(
            new ApiError(`Order with id: ${req.params.id} is not found`, 404)
        );
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ data: updatedOrder });
});

/**
 * @method updateOrderDeliverStatus
 * @desc update order deliver status to true by admin
 * @route PUT /api/v1/orders/:id/paid
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} order
 */
exports.updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(
            new ApiError(`Order with id: ${req.params.id} is not found`, 404)
        );
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ data: updatedOrder });
});

/**
 * @method checkoutSession
 * @desc get stripe checkout session and send it in response
 * @route PUT /api/v1/checkout-session/:cartId
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} order
 */
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // get user cart
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(
            new ApiError(`Cart with id: ${req.params.cartId} is not found`, 404)
        );
    }
    // get order price
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;

    // create stripe product
    const product = await stripe.products.create({
        name: `${req.user.name}`,
        description: 'Submit payment'
    });

    // create stripe price
    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: totalPrice * 100,
        currency: 'egp',
      });

    // create stripe session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: price.id,
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
    });

    res.status(200).json({ session });
});

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;
    const customerEmail = session.customer_email;
    const cart = await Cart.findById(cartId);
    const user = await User.findOne({ email: customerEmail });
    // create the order
    const order = await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });
    // change product quantity and solt after order created
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
        }));
        await Product.bulkWrite(bulkOption, {});

        // clear user cart
        await Cart.findByIdAndDelete(cartId);
    }
};

exports.webhockCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOCK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type == 'checkout.session.completed') {
        // create online payment order
        createCardOrder(event.data.object);
    }
    res.status(200).json({ received: true });
});
