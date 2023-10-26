const { User } = require("../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  try {
    const getUserData = await User.find({ role: { $ne: "admin" } });
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

const createNewUser = async (req, res) => {
  try {
    let { firstName, email, lastName, password } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "Email is already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      firstName,
      email,
      lastName,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      statusCode: 201,
      data: createUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const editUserDetail = async (req, res) => {
  try {
    const { id, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: "User not found",
      });
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: "Invalid login details",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid) {
      const logoutString = crypto.randomBytes(10).toString("hex");
      const token = jwt.sign({ email, logout: logoutString }, "shhhhh");
      user.logout = logoutString;
      await user.save();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: "Invalid login details",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    await User.updateOne({ email: req.user.email }, { logout: null });

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Logout successfully",
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
  getAllUser,
  createNewUser,
  login,
  editUserDetail,
  logout,
};
