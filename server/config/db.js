import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {

    try{
        mongoose.connection.on("connected", ()=> console.log("Connected to MongoDB successfully"))
        await mongoose.connect(`${config.MONGODB_URI}`)
    }catch(error){
        console.log(error.message);
    }

}

export default connectDB;