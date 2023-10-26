const { Group, User, GroupChat } = require("../models");
var ObjectId = require("mongoose").Types.ObjectId;
const main = require("../server");

const getAllGroup = async (req, res) => {
  try {
    const getUserData = await Group.find({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: getUserData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const createNewGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const createGroup = await Group.create({
      userId: req.user.id,
      groupName,
      groupMembers: [req.user.id],
    });
    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: createGroup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const editGroupDetail = async (req, res) => {
  try {
    const { id } = req.body;
    const group = await Group.findOne({ _id: id, userId: req.user.id });
    if (!group) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "Group not found",
      });
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: updatedGroup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.body;

    const group = await Group.findOne({ _id: id, userId: req.user.id });
    if (!group) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "Group not found",
      });
    }
    const deletedGroup = await Group.deleteOne({
      _id: id,
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Group deletd successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const addMemberInGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const findMember = await User.findById({ _id: memberId });
    if (!findMember) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "this member has no account",
      });
    }

    const findGroup = await Group.findOne({ id: groupId, userId: req.user.id });
    if (!findGroup) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "Group not found",
      });
    }
    const findGroupMember = await Group.findOne({
      groupMembers: new ObjectId(req.user.id),
    });
    if (findGroupMember) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "you are allready member of this group",
      });
    }

    findGroup.groupMembers = [...findGroup.groupMembers, id];
    await findGroup.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Add member successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const createMessage = async (req, res) => {
  const { text, id } = req.body;

  const findGroup = await Group.findById(id);
  console.log(findGroup, "findGroup");
  if (!findGroup) {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      error: "Group not found",
    });
  }
  const findGroupMember = await Group.find({
    groupMembers: new ObjectId(req.user.id),
  });
  if (!findGroupMember) {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      error: "you are not member of this group",
    });
  }

  try {
    main.io.on("connection", (socket) => {
      console.log("A user connected", socket.id);
      socket.broadcast.emit(`${id}`, text);
      // socket.on("chat-message", (message) => {
      //   console.log(message);
      // });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  } catch (error) {
    console.log("this is socket error", error);
  }

  const createChat = await GroupChat.create({
    groupId: id,
    chat: { userId: req.user.id, message: text },
  });

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Add message successfully",
    data: createChat,
  });
};

const likeAndDislike = async (req, res, next) => {
  try {
    const { chatId, groupId } = req.body;

    const findUserChatId = await GroupChat.findOne({
      $and: [{ _id: chatId }, { likes: { $in: [req.user.id] } }],
    });
    let like;
    if (findUserChatId) {
      like = await GroupChat.findByIdAndUpdate(
        chatId,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
    } else {
      like = await GroupChat.findByIdAndUpdate(
        chatId,
        {
          $addToSet: { likes: req.user._id },
        },
        { new: true }
      );
    }

    main.io.on("connection", (socket) => {
      console.log("A user connected", socket.id);
      socket.broadcast.emit(`${groupId}`, text);
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
    res.status(200).json({
      success: true,
      like,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const searchGroup = async (req, res) => {
  try {
    let searchParams = req.query.search
      ? { groupName: { $regex: `${req.query.search}`, $options: "i" } }
      : { groupMembers: req.user.id };
    const getUserData = await Group.find(searchParams);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: getUserData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getAllGroup,
  likeAndDislike,
  createNewGroup,
  editGroupDetail,
  deleteGroup,
  addMemberInGroup,
  createMessage,
  searchGroup,
};
