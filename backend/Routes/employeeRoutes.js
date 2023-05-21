const express=require("express");
const { registeremployee, loginUser,logout, getemployee, getAllEmployees, updateEmployee, deleteEmployee } = require("../Controllers/employeeController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const router=express.Router();


router.route("/register/Student").post(registeremployee)
router.route("/login/Student").post(loginUser)
router.route("/logout/Student").get(logout)
router.route("/myDetails").get(isAuthenticatedUser,getemployee)
router.route("/allEmployees").get(isAuthenticatedUser,getAllEmployees);
router.route("/updateEmployee/:id").put(isAuthenticatedUser,("employee"),updateEmployee);
router.route("/deleteEmployee/:id").delete(isAuthenticatedUser,authorizeRoles("Organization"),deleteEmployee);
module.exports=router