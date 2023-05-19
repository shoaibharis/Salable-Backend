const employee=require("../Models/Users/employeeModel");
const cloudinary=require("cloudinary")
const catchAsyncErrors=require("../Middlewares/catchAsyncErrors")
const ErrorHandler=require("../Utils/errorHandler");
const sendToken=require("../Utils/jwtToken")
exports.registeremployee=async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
      })
    const {firstName,lastName,email,password,avatar}=req.body
  const user=await employee.create({
    
    firstName,
    lastName,
    email,
    password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
          }
    
  })

  if(!user){
    next(new ErrorHandler(400,"user already registered"))
    }

  sendToken(user,200,res)

}

exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
  const{email,password}=req.body;
  //
  if(!email || !password){
    return next(new ErrorHandler("Please Enter email and password",400))
  }
  const user=await employee.findOne({email}).select("+password");
  if(!user){
    return next(new ErrorHandler("Invalid email or password",401));
  }
  const isPasswordMatched=await user.comparePassword(password);

//   isPasswordMatched.then(function(result){
//    if(!result){
//     return next(new ErrorHandler("Invalid Email or Password",401)) ;
//    }
//   else{
//     sendToken(user,200,res);
//   }
// })    

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
  
exports.getemployee=catchAsyncErrors(async(req,res,next)=>{
  const user=await employee.findOne(req.user.id)
  
  res.status(200).json({
    sucess:true,
    user
  })
})