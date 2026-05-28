import mongoose, { mongo } from "mongoose";
import Hotel from "./hotel.js";

const roomSchema = new mongoose.Schema({

    hotel: {type: String, ref:Hotel, required:true},
    roomType: {type: String, required:true},
    pricePerNight: {type: Number, required:true},
    amenities: {type:Array, required:true},
    images: [{type:String}],
    isAvailable: {type:Boolean, required:true}

}, {timestamps: true});

const Room = mongoose.model("room", roomSchema);

export default Room;