import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"

const app = express()
dotenv.config()

const connect = async ()=>{
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("connected to mongodb!");
  }catch (error){
    throw error;
  }
};
mongoose.connection.on("disconnected", ()=> {
  console.log("mongoDB disconnected");
})

app.use("/api/auth", authRoute)

app.listen(8888,()=>{
  connect()
  console.log("connect to api!!")
})