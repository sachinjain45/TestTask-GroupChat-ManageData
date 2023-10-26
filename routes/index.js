const express = require("express");
const router = express();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
router.use("/auth", authRoute);
router.use("/user", userRoute);

module.exports = router;
