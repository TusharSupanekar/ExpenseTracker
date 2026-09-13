const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friends' }], // one-to-many with UserFriends
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTransactions' }], // one-to-many with UserTransactions
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserGroups' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransactionCategory'}] // one-to-many with TransactionCategory
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);