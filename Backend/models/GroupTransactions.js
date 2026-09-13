const mongoose = require("mongoose");

const GroupTransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // references User
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true }, //references Group
    includedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IndividualTransactions', required: true }],
    amount: { type: Number, required: true },
    description: {type: String, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'TransactionCategory' }, // one-to-one with TransactionCategory
    date: { type: Date, default: Date.now }
},{timestamps: true});

module.exports = mongoose.model("GroupTransactions", GroupTransactionSchema);
