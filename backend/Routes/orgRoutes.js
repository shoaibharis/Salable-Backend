const express=require("express");
const { registerOrganization, loginOrg, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization } = require("../Controllers/orgController");
const { logout } = require("../Controllers/orgController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const router=express.Router();

router.route("/register/Organization").post(registerOrganization);
router.route("/login/Organization").post(loginOrg)
router.route("/logout/Organization").get(logout);
router.route("/allOrganizations").get(isAuthenticatedUser,getOrganizations);
router.route("/organization/:id").get(isAuthenticatedUser,getOrganizationById);
router.route("/updateOrganization/:id").put(isAuthenticatedUser,authorizeRoles("Organization"),updateOrganization);
router.route("/deleteOrganization/:id").delete(isAuthenticatedUser,authorizeRoles("Organization"),deleteOrganization);



module.exports=router;

