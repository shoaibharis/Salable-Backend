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

// @desc      Get all organizations
// @route     GET /api/organizations
// @access    Public
 exports.getOrganizations = async (req, res) => {
    try {
      const Organizations = await organization.find();
      res.json(Organizations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  // @desc      Get single organization
// @route     GET /api/organizations/:id
// @access    Public
exports.getOrganizationById = async (req, res) => {
  try {
    const Organization = await organization.findById(req.params.id);
    if (Organization) {
      res.json(Organization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc      Update an organization
// @route     PUT /api/organizations/:id
// @access    Private
exports.updateOrganization = async (req, res) => {
  try {
    const { orgName,orgType,orgEmail,password,avatar} = req.body;

    const Organization = await organization.findById(req.params.id);

    if (Organization) {
      Organization.orgName = orgName || Organization.orgName;
      Organization.orgType = orgType || Organization.orgType;
      Organization.orgEmail = orgEmail|| Organization.orgEmail;
      Organization.password= password || Organization.password;
      Organization.avatar=avatar || Organization.avatar;

      const updatedOrganization = await organization.save();
      res.json(updatedOrganization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc      Delete an organization
// @route     DELETE /api/organizations/:id
// @access    Private
exports.deleteOrganization = async (req, res) => {
  try {
    const Organization = await organization.findById(req.params.id);

    if (Organization) {
      await Organization.remove();
      res.json({ message: 'Organization removed' });
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
