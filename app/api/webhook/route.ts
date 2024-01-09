// Use 'use strict' instead of 'use server' for strict mode
"use strict";

import { NextResponse } from "next/server";
import prismadb from "@lib/prismadb";

const crypto = require("crypto");

export async function POST(req: Request) {
  const body = await req.json();
  // console.log('requestBody', requestBody)
  const headers = req.headers;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const cartItems = body.data.metadata.itemsInCart;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  const signature = headers.get("x-paystack-signature");

  if (hash !== signature) {
    // Retrieve the request's body

    const eventType = body.event;
    const chargeData = body.data;
    const status = chargeData.status;

    console.log(eventType);
    console.log(chargeData);
    console.log(status);
    
    // if (eventType === "charge.success") {
    //   if (status === "success") {
    //     // Success! Confirm the customer's payment
    //     try {

    //       return NextResponse.json(
    //         {
    //           message:
    //             "Failed Transaction Notification Message Sent Successfully",
    //         },
    //         { status: 200 }
    //       );
    //     } catch (err) {
    //       console.error("Error response body:", err);
    //       // You might want to handle or log the error more appropriately
    //       return NextResponse.json({
    //         error: "An error occurred while sending the message.",
    //       });
    //     }

    //     // return NextResponse.json({ message: 'Payment unsuccessful' }, { status: 400 });
    //   }
    // }
  } else {
    return NextResponse.json(
      { message: "This request isn't from Paystack" },
      { status: 401 }
    );
  }
}
