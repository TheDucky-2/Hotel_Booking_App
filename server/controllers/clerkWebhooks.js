import User from "../models/user.js";
import { Webhook } from "svix";
import config from "../config/config.js";

const clerkWebhooks= async(req, res) => {

    try{
        // Creating an Svix instance with clerk webhook secret.
        const webhook = new Webhook(config.CLERK_WEBHOOKS_SECRET)

        // Getting headers
        const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        const payload = req.body.toString();

        // Verifying headers
        await webhook.verify(payload, headers)

        console.log(req.body)

        // Getting data from request body
        const {data, type} = JSON.parse(payload);

        const userData = {
            id : data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url
        }

        switch(type){
            case "user.created": {
                await User.create(userData);
                break;

            }

            case "user.updated": {
                await User.findByIdAndUpdate({clerkId: data.id}, userData);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete({clerkId: data.id});
                break;
            }

            default:
                break;
        }
        res.json({success: true, message: "Webhook Received"})

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export default clerkWebhooks;