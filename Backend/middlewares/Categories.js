const TransactionCategories = require('../models/TransactionCategories');

const CategoriesCtrl = {
    getCategories: async(req, res, next) => {
        const Categories = await TransactionCategories.find();
        req.body.categories = Categories;
        next();
    }
}

module.exports = CategoriesCtrl;