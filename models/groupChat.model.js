const mongoose = require("mongoose");

const groupChatSchema = mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  chat: {
    userId: String,
    message: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

module.exports = GroupChat;
