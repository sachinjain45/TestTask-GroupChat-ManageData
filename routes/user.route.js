const express = require("express");
const router = express();
const { checkToken, checkRole } = require("../utils");
const {
  createNewGroup,
  getAllGroup,
  editGroupDetail,
  deleteGroup,
  addMemberInGroup,
  createMessage,
  likeAndDislike,
  searchGroup,
} = require("../controllers");

router.route("/getAllGroup").get(checkToken, checkRole("user"), getAllGroup);
router
  .route("/createNewGroup")
  .post(checkToken, checkRole("user"), createNewGroup);
router
  .route("/editGroupDetail")
  .patch(checkToken, checkRole("user"), editGroupDetail);
router.route("/deleteGroup").delete(checkToken, checkRole("user"), deleteGroup);
router
  .route("/addMemberInGroup")
  .post(checkToken, checkRole("user"), addMemberInGroup);
router
  .route("/likeAndDislike")
  .patch(checkToken, checkRole("user"), likeAndDislike);

router
  .route("/createMessage")
  .post(checkToken, checkRole("user"), createMessage);

router.route("/searchGroup").get(checkToken, checkRole("user"), searchGroup);

module.exports = router;
