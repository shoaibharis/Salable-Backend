const job=require("../Models/jobModel");
const employee=require("../Models/Users/employeeModel");
const cloudinary=require("cloudinary")
const catchAsyncErrors=require("../Middlewares/catchAsyncErrors")
const ErrorHandler=require("../Utils/errorHandler");
const sendToken=require("../Utils/jwtToken")
const ApiFeatures=require("../Utils/apiFeatures")


exports.createJob=catchAsyncErrors(async (req,res,next)=>{
  
    const {
        title,
        description,
        type,
        category,
        hours,
        stipend}=req.body

    const newJob=await job.create({
        title,
        description,
        type,
        category,
        hours,
        stipend,
        organization:req.user._id,
        createdAt:Date.now()
    })

    res.status(200).json({
        success:true,
        newJob
    })
})

exports.jobDetails=catchAsyncErrors(async(req,res,next)=>{

    const jobInfo=await job.findById(req.params.id);

    if(!jobInfo){
        res.status(400).json({
            success:false,
            message:"job not found"
        })}
    
        res.status(200).json({
        success:true,
        jobInfo
    })

})

exports.getAllJobs=catchAsyncErrors(async(req,res,next)=>{
    const resultPerPage=8;
    const jobsCount=await job.countDocuments();
      
    const apiFeature=new ApiFeatures(job.find(),req.query).search().filter().pagination(resultPerPage)

   const jobsInfo =await apiFeature.query
   console.log(jobsInfo)
     res.status(200).json({
         success:true,
         jobsInfo,
         jobsCount,
         resultPerPage,
     })
 
})

exports.enrollment=catchAsyncErrors( async (req,res,next)=>{
 
    const {jobID}=req.body
    console.log(jobID)

    const selectedJob=await job.findById(jobID);

    if(!selectedJob){
        res.status(400).json({
            sucess:false,
            message:"job does not exist"
        })
    }
    
    req.user.enrolledJobs.push(jobID),
   
    selectedJob.enrolledStudents.push(req.user._id)
    
    await req.user.save();
    await selectedJob.save();
    
    res.status(201).json({
        success:true,
        message:"Enrolled SuccessFully"
    })

})