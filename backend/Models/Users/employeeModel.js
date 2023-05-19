const mongoose=require("mongoose")
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto")

const employeeSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"],
        maxLength:[40,"Name cannot exceed 40 Characters"],
        minLength:[1,"Name should have more than 4 characters"]
    },
    lastName:{
        type:String,
        required:[true,"last name is required"],
        maxLength:[40,"Name cannot exceed 40 Characters"],
        minLength:[1,"Name should have more than 4 characters"]
    },
    education:[
        {
            degree :{
                type:String,
                required:[true,"Degree is required"]
            },
            institute:{
                 type:String,
                 required:[true,"Institute is required"]
            },
            graduated:{
                type:String,
                required:[true,"Institute is required"]
            }
        }
],
     email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
     },

    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password should be greater than 8"],
        select:false
    },
    avatar:{
            
             public_id:{
             type:String,
             required:true 
         },
         url:{
             type:String,
             required:true 
         }                
    },
    role:{
        type:String,
        default:"student"
    },
    enrolledJobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs"
    }],
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

employeeSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next() 
    }
this.password=await bcrypt.hash(this.password,10)
})

employeeSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

employeeSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}


module.exports=mongoose.model("employee",employeeSchema);