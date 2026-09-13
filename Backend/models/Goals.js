const mongoose = require("mongoose");

const GoalsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Goal: { type: String, required: true},
    GoalAmount: {type: Number, required: true},
    SavedAmount:  {type: Number, default: 0}
});

module.exports = mongoose.model("Goals", GoalsSchema);