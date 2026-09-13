const mongoose = require("mongoose");

const userFriendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // references the user
    friend: { type: String, required: true},
    friendEmail: {type: String, required: true},
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Friends", userFriendSchema);
