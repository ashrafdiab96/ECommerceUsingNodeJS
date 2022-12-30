/**
 * @file ApiFeatures.js
 * @desc collect features for filtering and search
 * @version 1.0.0
 * @author AshrafDiab
 */

class ApiFeatures {
    /**
     * @constructor
     * @desc assign mongoose query and query string 
     * @param {*} mongooseQuery -> mongoose query (find())
     * @param {*} queryString -> request query parameters
     * @returns {void} void
     */
    constructor (mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    /**
     * @method filter
     * @desc enabel client to filter data
     * @returns {object} this
     */
    filter() {
        // take copy of query string and delete specific keywords from it
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['page', 'limit', 'sort', 'fields'];
        excludesFields.forEach((field) => delete queryStringObj[field]);
        // set $ pre any comparison operator
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryStr = JSON.parse(queryStr);
        // apply query string (comparison operators)
        this.mongooseQuery = this.mongooseQuery.find(queryStr);
        return this;
    }

    /**
     * @method sort
     * @desc enabel client to sort data
     * @returns {object} this
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    /**
     * @method limitFields
     * @desc enabel client to select limited fields
     * @returns {object} this
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    /**
     * @method search
     * @desc handel search
     * @returns {object} this
     */
    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName == 'Product') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    /**
     * @method paginate
     * @desc handel pagination
     * @param {*} countDocuments 
     * @returns {object} this
     */
    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        const pagination = {};
        pagination.cuurentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

}

module.exports = ApiFeatures;
