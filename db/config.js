const mongoose = require("mongoose");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const init = async () => {
  const password = await bcrypt.hash("admin", 10);
  const findAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!findAdmin) {
    await User.create({
      firstName: "admin",
      email: "admin@gmail.com",
      lastName: "admin",
      password: `${password}`,
      role: "admin",
    });
  }
};

exports.dbConnection = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/testTask")
    .then(() => {
      console.log("DB connected");
      init();
    })
    .catch((error) => {
      console.log("error", error);
      process.exit(1);
    });
};
