const CategoryModel = require('../models/categoryModel');

exports.getCategories = () => {
    (req, res) => {
        const name = req.body.name;
        console.log(name);
        const newCategory = new CategoryModel({name});
        newCategory.save().then((doc) => {
            console.log(doc);
            res.json(doc);
        }).catch((error) => {
            console.log(error);
            res.json(error);
        });
    }
}