import mongoose, { mongo } from "mongoose";
import User from "./user.js";

const hotelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    contact: {type: String, required: true},
    owner: {type: String, required: true, ref: User},
    city: {type: String, required: true}

}, {timestamps: true});

const Hotel = mongoose.model("hotel", hotelSchema);

export default Hotel;