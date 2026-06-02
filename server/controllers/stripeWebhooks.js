import Stripe from 'stripe';
import config from '../config/config.js'
import Booking from '../models/booking.js'

// API for handling stripe webhook

export const stripeWebhooks = async(req, res) => {
// Stripe Gateway

const stripeInstance = new Stripe(config.STRIPE_SECRET_KEY);

const signature = req.headers['stripe-signature'];

let event;

try{

    event = stripeInstance.webhooks.constructEvent(req.body, signature, config.STRIPE_WEBHOOK_SECRET)

}catch(error){

    res.status(400).send(`Webhook error ${err.message}`)
}

// Handle event

if(event.type === 'payment_intent.succeeded'){
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata

    const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
    });

    const { bookingId } = session.data[0].metadata;

    // Mark Payment as Paid

    await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentMethod: "Stripe"})
    
}else{
    console.log("Unhandled event type: ", event.type)
}

res.json({
    received: true
})

}