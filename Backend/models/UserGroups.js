const mongoose = require("mongoose");

const userToGroupSchema = new mongoose.Schema({
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true }], 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("UserGroups", userToGroupSchema);