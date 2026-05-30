import Hotel from "../models/hotel.js"
import User from "../models/user.js"
import config from "../config/config.js"

export const registerHotel = async (req, res) => {

    try{

        const {name, address, contact, city} = req.body;
        const owner = req.user._id

        // Check if user is already registered

        const hotel = await Hotel.findOne({owner})

        if(hotel){
            return res.json({
                success: false,
                message: "Hotel Already Registered"
            })
        }

        // Adding the hotel
        await Hotel.create({
            name, address, contact, city, owner
        });

        // adding user role as Hotel owner
        await User.findByIdAndUpdate(owner, {role: config.HOTEL_OWNER});

        res.json({
            success: true,
            message: "Hotel Registered Successfully!"
        })


    }catch(error){

        res.json({
            success: false,
            message: error.message
        })

    }


} 