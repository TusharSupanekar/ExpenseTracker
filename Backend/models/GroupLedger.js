const mongoose = require("mongoose");

const GroupLedgerSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true }, 
    paidby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: {type: Number, required: true}
});

module.exports = mongoose.model("GroupLedger", GroupLedgerSchema);