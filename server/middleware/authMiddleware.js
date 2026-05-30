import User from "../models/user.js"

// Middleware to check if user has been authenticated
export const authenticate = async(req, res, next)=> {

    const {userId} = req.auth();

    if(!userId){
        res.json({
            success: false,
            message: "Not Authenticated"})
    }else{
        const user = await User.findOne({clerkId: userId});
        req.user = user;
        next()
    }

}