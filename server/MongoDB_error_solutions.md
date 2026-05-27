# Clerk + Vercel + MongoDB Webhook Debugging Guide

A complete debugging walkthrough for fixing Clerk webhooks not inserting users into MongoDB when deploying an Express backend on Vercel.

This guide documents every issue encountered and how each one was resolved.

---

# Initial Symptoms

The following problems were occurring:

* Vercel deployment returning `500` errors
* Clerk webhook requests failing
* MongoDB not receiving user data
* Backend working locally but not on Vercel
* Webhook verification failing with `401 Unauthorized error`
* MongoDB collections appearing empty
* Data unexpectedly appearing in the `test` database instead of ``hotel_booking`` database.
* Mongoose insert operations timing out

---

# Tech Stack

* Node.js
* Express.js
* Clerk Authentication
* Clerk Webhooks
* MongoDB Atlas
* Mongoose
* Vercel

---

# 1. Clerk Webhook Route Was Configured Incorrectly

## Problem

The webhook route used:

```js
app.use("/api/clerk", clerkWebhooks);
```

Clerk webhooks require the **raw request body** for Svix signature verification.

Using `app.use()` without `express.raw()` breaks verification.

---

# Fix

Use:

```js
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
```

---

# 2. express.json() Middleware Order Was Wrong

## Problem

`express.json()` was running before webhook verification.

This modifies the request body and causes Clerk/Svix signature verification to fail.

---

# Fix

Webhook route MUST come before `express.json()`.

Correct order:

```js
app.use(cors());

app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());
```

---

# 3. Incorrect Webhook Verification Payload

## Problem

Webhook verification used:

```js
await webhook.verify(JSON.stringify(req.body), headers)
```

This fails because Clerk expects the raw payload.

---

# Fix

Use:

```js
const payload = req.body.toString();

await webhook.verify(payload, headers);

const { data, type } = JSON.parse(payload);
```

---

# 4. Wrong Clerk Secret

## Problem

Webhook verification returned `401 Unauthorized error`.

Cause:

Wrong secret key was being used.

Common mistake:

Using:

* `CLERK_SECRET_KEY`
* `CLERK_PUBLISHABLE_KEY`

instead of:

* Clerk Webhook Signing Secret

---

# Fix

Use the webhook signing secret from Clerk Dashboard:

```env
CLERK_WEBHOOKS_SECRET=whsec_xxxxxxxxx
```

---

# 5. Vercel Deployment Protection Blocked Clerk

## Problem

Webhook endpoint returned:

```html
Authentication Required
```

This was Vercel Deployment Protection blocking external requests.

Clerk could not access the webhook endpoint.

---

# Fix

In Vercel:

1. Open Project Settings
2. Go to Deployment Protection
3. Disable:

   * Vercel Authentication
   * Password Protection
   * Trusted IP Restrictions

Webhook endpoints must be publicly accessible.

---

# 6. Invalid MongoDB Namespace Errors

## Problem

MongoDB returned:

```txt
Invalid namespace specified: /hotel_booking.users
```

Cause:

MongoDB URI was malformed.

This line caused problems:

```js
await mongoose.connect(`${config.MONGODB_URI}/hotel_booking`)
```

The URI already contained a database path.

Appending another `/hotel_booking` created malformed paths.

---

# Fix

Use:

```js
await mongoose.connect(config.MONGODB_URI)
```

ONLY.

Database name should already exist inside the URI.

Correct `.env` example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_booking
```

---

# 7. MongoDB Defaulted To test Database

## Problem

Data was appearing in:

```txt
test.users
```

instead of:

```txt
hotel_booking.users
```

Cause:

The deployed Vercel environment variable still used the old URI.

---

# Fix

Update `MONGODB_URI` inside Vercel Project Environment Variables.

Then redeploy.

Important lesson:

Local `.env` and Vercel env variables are separate.

---

# 8. MongoDB Connection Was Not Awaited

## Problem

Mongoose returned:

```txt
Operation `users.insertOne()` buffering timed out after 10000ms
```

Cause:

Requests were hitting the API before MongoDB finished connecting.

---

# Fix

Start the server ONLY after MongoDB connects.

Correct startup pattern:

```js
import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';

await connectDB();

const app = express();

// Middlewares
app.use(cors())            // Enabling Cross-Origin Resource Sharing
app.use(clerkMiddleware())

// API for listening to clerk webhooks

app.post("/api/clerk", express.raw({type: 'application/json'}), clerkWebhooks);

app.use(express.json())

app.get("/", (req, res) => res.send("API is working fine."));

const PORT = config.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
```

---

# 9. Wrong Mongoose Query Methods

## Problem

Errors like:

```txt
Cast to ObjectId failed at path "_id"
```

Cause:

Using:

```js
findByIdAndUpdate()
```

with:

```js
{ clerkId: data.id }
```

`findByIdAndUpdate()` only works with MongoDB `_id`.

---

# Fix

Use:

```js
findOneAndUpdate({ clerkId: data.id }, userData)
```

and:

```js
findOneAndDelete({ clerkId: data.id })
```

---

# 10. Clerk Data Caused Undefined Errors

## Problem

Errors like:

```txt
Cannot read properties of undefined (reading '0')
```

Cause:

Some Clerk payloads may not contain `email_addresses`.

---

# Fix

Use optional chaining.

Correct:

```js
email: data.email_addresses?.[0]?.email_address || ""
```

---

# 11. Incorrect Schema Design

## Problem

Custom `_id` handling caused conflicts.

---

# Fix

Allow MongoDB to generate `_id` automatically.

Correct schema:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
  },

  email: String,

  username: String,

  image: String,
});

const User = mongoose.model("user", userSchema);

export default User;
```

---

# 12. Correct Final Webhook Controller

```js
import User from "../models/user.js";
import { Webhook } from "svix";
import config from "../config/config.js";

const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(config.CLERK_WEBHOOKS_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString();

    await webhook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId: data.id },
          userData
        );
        break;

      case "user.deleted":
        await User.findOneAndDelete({
          clerkId: data.id,
        });
        break;

      default:
        break;
    }

    res.json({
      success: true,
      message: "Webhook Received",
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;
```

---

# 13. Correct Final server.js

```js
import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';

await connectDB();

const app = express();

// Middlewares
app.use(cors())            // Enabling Cross-Origin Resource Sharing
app.use(clerkMiddleware())

// API for listening to clerk webhooks

app.post("/api/clerk", express.raw({type: 'application/json'}), clerkWebhooks);

app.use(express.json())

app.get("/", (req, res) => res.send("API is working fine."));

const PORT = config.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
```

---

# Important Lessons Learned

## 1. Local env and Vercel env are separate

Updating `.env` locally does NOT update Vercel.

---

## 2. Clerk webhooks require raw body

Using `express.json()` before verification breaks Svix signatures.

---

## 3. Vercel Deployment Protection blocks external webhooks

Webhook endpoints must be publicly accessible.

---

## 4. MongoDB defaults to test database

If URI parsing fails or DB name is missing.

---

## 5. Mongoose auto-pluralizes model names

```js
mongoose.model("user", schema)
```

creates:

```txt
users
```

collection.

---

## 6. Serverless environments require awaited DB connections

Cold starts expose async timing issues more aggressively.

---

# Final Result

After all fixes:

* Clerk webhook verification succeeded
* Vercel accepted requests
* MongoDB connected correctly
* Users inserted into `hotel_booking.users`
* User creation, update, and deletion all worked successfully

---

# Estimated Time Lost

~12 hours.

Hopefully this saves someone else's time from being wasted debugging this error.
