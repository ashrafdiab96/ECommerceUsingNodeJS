/**
 * @file productController.js
 * @desc sub product controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs image processing package
const sharp = require('sharp');
// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');
// create a strong unique random values
const { v4: uuidv4 } = require('uuid');

// CRUD functions handler
const factory = require('./handlersFactory');
// handle upload images
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
// product model
const Product = require('../models/productModel');

/**
 * @method uploadProductImage
 * @desc upload product images
 * @param {Array[object]} imagesData
 */
exports.uploadProductImage = uploadMixOfImages([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
]);

/**
 * @middleware resizeProductImage
 * @desc resize uploaded images
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverName}`);
        
        req.body.imageCover = imageCoverName;
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                
                req.body.images.push(imageName);
            })
        );
    }
    next();
});

/**
 * @method getProducts
 * @desc get all sub products
 * @route GET /api/v1/products
 * @access public
 * @param {Model} Product
 * @param {string} ModelName
 * @return {Array[object]} products
 */
exports.getProducts = factory.getAll(Product, 'Product');

/**
 * @method getProduct
 * @desc get specific product by id
 * @route GET /api/v1/products/:id
 * @access public
 * @param {Model} Product
 * @return {object} product
 */
exports.getProduct = factory.getOne(Product, 'reviews');

/**
 * @method createProduct
 * @desc create new product
 * @route POST /api/v1/products
 * @access private
 * @param {Model} Product
 * @return {object} product
 */
exports.createProduct = factory.createOne(Product);

/**
 * @method updateProduct
 * @desc update specific product by id
 * @route PUT /api/v1/products/:id
 * @access private
 * @param {Model} Product
 * @return {object} product
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @method deleteProduct
 * @desc delete specific product by id
 * @route DELETE /api/v1/products/:id
 * @access private
 * @param {Model} Product
 * @return {void} void 
 */
exports.deleteProduct = factory.deleteOne(Product);