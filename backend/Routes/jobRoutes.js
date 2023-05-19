const express=require("express");
const { createJob, jobDetails, getAllJobs, enrollment } = require("../Controllers/jobController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const router=express.Router();


router.route("/createJob").post(isAuthenticatedUser,authorizeRoles("Organization"),createJob);
router.route("/job/:id").get(jobDetails)
router.route("/jobs").get(getAllJobs);
router.route("/enroll").post(isAuthenticatedUser,authorizeRoles("student"),enrollment)
module.exports=router