import Booking from '../models/booking.js'
import Room from '../models/room.js';

// Check availability of room

const checkRoomAvailability = async ({checkInDate, checkOutDate, room}) => {

    try{

        const bookings = await Booking.find({
            room,
            checkInDate: {$lte : checkOutDate}, // checkin date should be less than checkout date
            checkOutDate: {$gte: checkInDate}  // checkout date should be greater than checkin date
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;
    }
    catch(error){   
        console.log(error)
    }
}

// API to check availability
// POST /api/bookings/check-availability
export const checkAvailability = async (req, res)=> {

    try{
        const {room, checkInDate, checkOutDate} = req.body;

        const isAvailable = await checkRoomAvailability({checkInDate, checkOutDate, room});

        res.json({
            success: true,
            isAvailable
        })
    }
    catch(error){   
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Creating a new booking
// POST /api/bookings/book

export const createBooking = async(req, res) => {

    try{

        // Checking availability before booking

        const {room, checkInDate, checkOutDate, guests} = req.body;

        const user = req.user._id;

        const isAvailable = checkRoomAvailability({
            checkInDate,
            checkOutDate,
            room
        })

        if(!isAvailable){
            return res.json({
                success: false,
                message: "Room is not available"
            })
        }

        const roomData = await Room.findById(room).populate("hotel");

        let totalPrice = roomData.pricePerNight;

        // Computing total price based on the number of nights

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        const timeDiff = checkOut.getTime() - checkIn.getTime();

        const nights = Math.ceil((timeDiff/1000*3600*24));

        totalPrice*=nights;

        // Creating a new booking

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })

        res.json({
            success: true,
            message: "Booking created successfully"
        })
    }catch(error){

        console.log(error)
        res.json({
            success: false,
            message: "Failed to create the booking"
        })
    }
}

// API to get all the bookings of a particular user
// GET api/bookings/user

export const getUserBookings = async(req, res) => {

    try{

        const user = req.user._id
        
        const bookings = await Bookings.find({user}).populate("hotel room").sort({createdAt: -1})
        res.json({
            success: true,
            bookings
        })
    }catch(error){
        res.json({
            success:false,
            message: "Failed to fetch bookings"
        })
    }
}

export const getHotelBookings = async(req, res) => {
    try
    {const hotel = await Hotel.findOne({owner: req.auth.userId});

    if(!hotel){
        return res.json({
            success:false,
            message: "No hotel found"
        });
    }

    const bookings = await Bookings.find({hotel: hotel._id}).populate("hotel room user").sort({createdAt: -1});

    // Total bookings

    const totalBookings = bookings.length;

    // Total revenue
    
    const totalRevenue = bookings.reduce((acc, bookning) => acc+ booking.totalPrice, 0)

    res.json({
        success:true,
        dashboardData: {totalBookings, totalRevenue, bookings}
    })}
    catch{error}{

        res.json({
            success:false,
            message: "Failed to fetch bookings"})
    }
}