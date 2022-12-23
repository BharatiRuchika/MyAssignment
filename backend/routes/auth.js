var express = require('express');
var router = express.Router();
const user = require("../module/user")

router.post("/register",user.register)
router.post("/login",user.validateUser)
router.get("/logout",user.Logout)
module.exports = router;