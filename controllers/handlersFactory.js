/**
 * @file handlersFactory.js
 * @desc handlers factory for shared methods
 * @version 1.0.0
 * @author AshrafDiab
 */

// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');

// handle errors
const ApiError = require('../utils/ApiError');
// handle filtering features
const ApiFeatures = require('../utils/ApiFeatures');

/**
 * @method getAll
 * @desc get all documents
 * @param {*} req 
 * @param {*} res
 * @returns {array[object]} documents 
 */
exports.getAll = (Model, modelName) => asyncHandler(async (req, res) => {
    // chcek if request has filterObj (comes from nested routes) add it to filter
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    // Get docuents count
    const documentsCounts = await Model.countDocuments();
    // Build query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .paginate(documentsCounts)
        .filter()
        .search(modelName)
        .limitFields()
        .sort();
    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({ paginationResult, result: documents.length, data: documents });
});

/**
 * @method getOne
 * @desc get specific document by id
 * @param {*} req 
 * @param {*} res
 * @return {object} document
 */
exports.getOne = (Model, populationOpt) => asyncHandler(async (req, res, next) => {
    // find document by id (build query)
    const { id } = req.params;
    let query = Model.findById(id);
    // check if is set population options, populate the query
    if (populationOpt) {
        query = query.populate(populationOpt);
    }
    // execute query
    const document = await query;
    // return error if document is not found
    if (!document) {
        return next(new ApiError(`Document with id ${id} is not found`, 404));
    }
    res.status(200).json({ data: document });
});

/**
 * @method createOne
 * @desc create new document
 * @param {*} req 
 * @param {*} res
 * @return {object} document
 */
exports.createOne = (Model) => asyncHandler(async (req, res) => {
    // create new document
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
});

/**
 * @method updateOne
 * @desc update specific document by id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {object} document 
 */
exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    // update document by id
    const document = await Model.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
    );
    // return error if document is not found
    if (!document) {
        return next(new ApiError(
            `Document with id: ${req.params.id} is not found`, 404
        ));
    }
    /* trigger save event */
    document.save();
    res.status(200).json({ data: document });
});

/**
 * @method deleteOne
 * @desc delete specific document by id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void 
 */
exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    // delete document by id
    const { id } = req.params;
    const document = await Model.findOneAndDelete({ _id: id });
    // return error if document is not found
    if (!document) {
        return next(new ApiError(`Document with id: ${id} is not found`, 404));
    }
    /* trigger remove event */
    document.remove();
    res.status(204).json();
});
