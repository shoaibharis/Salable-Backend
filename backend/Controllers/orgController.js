const cloudinary=require("cloudinary")
const catchAsyncErrors=require("../Middlewares/catchAsyncErrors")
const ErrorHandler=require("../Utils/errorHandler");
const sendToken=require("../Utils/jwtToken")
const employee=require("../Models/Users/employeeModel")
const organization=require("../Models/Users/organizationModel")

exports.registerOrganization=catchAsyncErrors(async(req,res,next)=>{
    const {orgName,orgType,orgEmail,password,avatar}=req.body;
    
    const user=await organization.create({
        orgName,
        orgEmail,
        orgType,
        password,
        avatar
    })

    if(!user){
        next(new ErrorHandler(400,"Organization already exists"))
    }

    sendToken(user,201,res)
})

exports.loginOrg=catchAsyncErrors(async(req,res,next)=>{
    const{orgEmail,password}=req.body;
    //
    if(!orgEmail || !password){
      return next(new ErrorHandler("Please Enter email and password",400))
    }
    const user=await organization.findOne({orgEmail}).select("+password");
    if(!user){
      return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
  
  
     if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid Email or Password",401))  
   }
     
   sendToken(user,200,res);
    
  })
  
  //logout
exports.logout=catchAsyncErrors(async(req,res,next)=>{
  
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  })
    res.status(200).json({
      success:true,
      message:"Logged Out"
    })
  })


