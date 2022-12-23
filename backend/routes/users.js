var express = require('express');
var router = express.Router();
const user = require("../module/user")
const {isAuthenticatedUser} = require("../middlewares/auth");
router.get("/getUsers",isAuthenticatedUser,user.getUsers);
router.post("/addUser",isAuthenticatedUser,user.addUser);
router.put("/edit",isAuthenticatedUser,user.editUser);
module.exports = router;
