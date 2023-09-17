import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./route/auth.js"

const app = express()
dotenv.config()

const connect = async ()=>{
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log('connect to local mongodb');
  }catch (error){
    console.log(error);
    throw error;
  }
};
mongoose.connection.on("disconnected", ()=> {
  console.log("mongoDB disconnected");
})

app.use(express.json())
app.use("/api/auth", authRoute)

app.listen(8888,()=>{
  connect()
  console.log('app run success');
})

export default app