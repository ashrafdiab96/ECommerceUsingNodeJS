/**
 * @file ApiFeatures.js
 * @desc collect features for filtering and search
 * @version 1.0.0
 * @author AshrafDiab
 */

class ApiFeatures {
    constructor (mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    /**
     * @method limitFields
     * enabel client to filter data
     * @returns object
     */
    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['page', 'limit', 'sort', 'fields'];
        excludesFields.forEach((field) => delete queryStringObj[field]);
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryStr = JSON.parse(queryStr);
        this.mongooseQuery = this.mongooseQuery.find(queryStr);
        return this;
    }

    /**
     * @method limitFields
     * enabel client to select limited fields
     * @returns object
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
     * enabel client to select limited fields
     * @returns object
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
     * handel search
     * @returns object
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
     * handel pagination
     * @param {*} countDocuments 
     * @returns object
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
