const express=require("express");
const { registeremployee, loginUser,logout, getemployee, getAllEmployees } = require("../Controllers/employeeController");
const { isAuthenticatedUser } = require("../Middlewares/auth");
const router=express.Router();


router.route("/register/Student").post(registeremployee)
router.route("/login/Student").post(loginUser)
router.route("/logout/Student").get(logout)
router.route("/myDetails").get(isAuthenticatedUser,getemployee)
router.route("/allEmployees").get(isAuthenticatedUser,getAllEmployees);
module.exports=router