const express=require("express")
const app=express();
const employeeRoutes=require("./Routes/employeeRoutes")
app.use(express.json)

app.use("/api/v2",employeeRoutes);
app.post("/api/v2/registerStudent",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"submitted"
    })
    console.log("hello")
})
module.exports=app