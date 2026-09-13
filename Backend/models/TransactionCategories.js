const mongoose = require("mongoose");

const transactionCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model("TransactionCategories", transactionCategorySchema);
