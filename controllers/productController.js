/**
 * @file productController.js
 * @desc sub product controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const factory = require('./handlersFactory');
const Product = require('../models/productModel');

/**
 * @method getProducts
 * @desc get all sub products
 * @route GET /api/v1/products
 * @access public
 * @return array[objects]
 */
exports.getProducts = factory.getAll(Product, 'Product');

/**
 * @method getProduct
 * @desc get specific product by id
 * @route GET /api/v1/products/:id
 * @access public
 * @return object
 */
exports.getProduct = factory.getOne(Product);

/**
 * @method createProduct
 * @desc create new product
 * @route POST /api/v1/products
 * @access private
 * @return object
 */
exports.createProduct = factory.createOne(Product);

/**
 * @method updateProduct
 * @desc update specific product by id
 * @route PUT /api/v1/products/:id
 * @access private
 * @return object
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @method deleteProduct
 * @desc delete specific product by id
 * @route DELETE /api/v1/products/:id
 * @access private
 * @return void 
 */
exports.deleteProduct = factory.deleteOne(Product);