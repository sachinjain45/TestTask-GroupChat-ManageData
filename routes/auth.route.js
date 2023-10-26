const express = require("express");
const router = express();
const { checkToken, checkRole } = require("../utils");
const {
  signinValidation,
  signupValidation,
  editUserDetailValidation,
} = require("../validations/index");
const {
  getAllUser,
  createNewUser,
  login,
  editUserDetail,
  logout,
} = require("../controllers");

router
  .route("/getAllUser")
  .get(checkToken, checkRole("admin", "user"), getAllUser);
router
  .route("/adminAddUser")
  .post(checkToken, checkRole("admin"), signupValidation, createNewUser);

router
  .route("/adminEditUser")
  .post(
    checkToken,
    checkRole("admin"),
    editUserDetailValidation,
    editUserDetail
  );

router.route("/login").post(signinValidation, login);
router.route("/logOut").get(checkToken, logout);

module.exports = router;
