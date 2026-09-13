const mongoose = require("mongoose");

const CategorySpendsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'TransactionCategories', required: true },
    totalAmountSpent: {type: Number, default: 0}
});

module.exports = mongoose.model("CategorySpends", CategorySpendsSchema);