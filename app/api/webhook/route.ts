// Use 'use strict' instead of 'use server' for strict mode
("use strict");

import { NextResponse } from "next/server";
import prismadb from "@lib/prismadb";

const crypto = require("crypto");

export async function POST(req: Request) {
  const body = await req.json();
  // console.log('requestBody', requestBody)
  const headers = req.headers;
  const secret = process.env.PAYSTACK_SECRET_TEST_KEY;
  const metadata = body.data.metadata;

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

    if (eventType === "charge.success") {
      if (status === "success") {
        // Success! Confirm the customer's payment
        const order = await prismadb.order.update({
          where: {
            id: metadata?.orderId,
          },
          data: {
            isPaid: true,
            address: metadata.state,
            phone: metadata?.phone || "",
          },
          include: {
            orderItems: true,
          },
        });

        const productIds = order.orderItems.map(
          (orderItems) => orderItems.productId
        );

        await prismadb.product.updateMany({
          where: {
            id: {
              in: [...productIds],
            },
          },
          data: {
            isArchived: true,
          },
        });

        return NextResponse.json(
          { message: "Payment unsuccessful" },
          { status: 400 }
        );
      }
    }
    return new NextResponse(null, { status: 200 });
  }
}
