//const app=require("./app.js");
const express=require("express")
const app=express();
const dotenv=require("dotenv")
const cors=require("cors")
const connectDatabase=require("./Config/database");
const errorMiddleWare=require("./Middlewares/error")
const employeeRoutes=require("./Routes/employeeRoutes")
const cookieParser=require("cookie-parser")
const organizationRoutes=require("./Routes/orgRoutes");
const jobRoutes=require("./Routes/jobRoutes")

dotenv.config({path:'./backend/config/config.env'})


app.use(express.json())
app.use(errorMiddleWare)
app.use(cookieParser())
app.use(cors());
connectDatabase();


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`);
})


//ROUTES
app.use("/api/v2",employeeRoutes)
app.use("/api/v2",organizationRoutes);
app.use("/api/v2",jobRoutes);