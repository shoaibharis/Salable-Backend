const express=require("express");
const { registerOrganization, loginOrg } = require("../Controllers/orgController");
const { logout } = require("../Controllers/orgController");
const router=express.Router();

router.route("/register/Organization").post(registerOrganization);
router.route("/login/Organization").post(loginOrg)
router.route("/logout/Organization").get(logout);

module.exports=router;

