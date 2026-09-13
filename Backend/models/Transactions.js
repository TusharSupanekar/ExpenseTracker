const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // references User
    includedMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    description: {type: String, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'TransactionCategory' }, // one-to-one with TransactionCategory
    date: { type: Date, default: Date.now }
},{timestamps: true});

module.exports = mongoose.model("IndividualTransactions", TransactionSchema);
