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

exports.getAllEmployees=async (req,res,next)=>{
  const employees=employee.find();
  if(employees){
    res.status(200).json({
      sucess:true,
      employees
    })
  }
  else{
    res.staus(404).json({
      success:false,
      message:"no employee found"
    })
  }
}

exports.updateEmployee=async(req,res,next)=>{

 try{
  if(req.body.avatar){
  const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale"
  })
}
const {firstName,lastName,email,password}=req.body
const emp=await employee.findById(req.params.id);

if(emp){
  emp.firstName=firstName || emp.firstName;
  emp.lastName=lastName || emp.lastName;
  emp.email=email || emp.email;
  emp.password=password ||emp.password;
  emp.avatar={
    public_id:myCloud.public_id,
    url:myCloud.secure_url
  } || emp.avatar

  const updatedEmp=await emp.save();}

  else{
    res.status(404).json({ message: 'employee not found' });
  }}
  catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
  }

  exports.deleteEmployee=async(req,res,next)=>{
    try{
    const emp=await employee.findById(req.params.id);

    if(emp){
     await emp.remove();
     res.status(200).json({message:"employee removed"})
    }
    else{
      res.status(400).json({message:"employee not found"})
    }}
    catch(error){
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }

  }