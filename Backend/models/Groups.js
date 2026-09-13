const mongoose = require("mongoose");

const userGroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array of users in the group
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Groups", userGroupSchema);
