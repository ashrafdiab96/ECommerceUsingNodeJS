const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');

/**
 * @method getAll
 * @desc get all documents
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return array[objects] 
 */
exports.getAll = (Model, mdelName) => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .paginate(documentsCounts)
        .filter()
        .search(mdelName)
        .limitFields()
        .sort();
    
    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({ paginationResult, result: documents.length, data: documents });
});

/**
 * @method getOne
 * @desc get specific sub category by id
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return object
 */
exports.getOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
        return next(new ApiError(`Document with id ${id} is not found`, 404));
    }
    res.status(200).json({ data: document });
});

/**
 * @method createOne
 * @desc create new document
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object
 */
exports.createOne = (Model) => asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(200).json({ data: document });
});

/**
 * @method updateOne
 * @desc update specific document by id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return object 
 */
exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate( req.params.id, req.body, { new: true });
    if (!document) {
        return next(new ApiError(`Document with id: ${req.params.id} is not found`, 404));
    }
    res.status(200).json({ data: document });
});

/**
 * @method deleteOne
 * @desc delete specific document by id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void 
 */
exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete({ _id: id });
    if (!document) {
        return next(new ApiError(`Document with id: ${id} is not found`, 404));
    }
    res.status(204).json();
});
