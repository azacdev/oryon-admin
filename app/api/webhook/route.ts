// api/webhooks/paystack.ts
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const data = req.body;
    const eventType = data.event;

    // Handle different Paystack events
    switch (eventType) {
      case "charge.success":
        await handleSuccessfulCharge(data);
        break;
      // Add more cases for other events as needed

      default:
        break;
    }

    res.status(200).end(); // Respond to Paystack immediately
  } catch (error) {
    console.error("Error handling Paystack webhook:", error);
    res.status(500).end();
  }
}

// Handle a successful charge event
async function handleSuccessfulCharge(data: any) {
  // Extract relevant information from the Paystack webhook data
  const { reference, metadata } = data.data;

  // Update the order in your database based on the extracted information
  const order = await prismadb.order.update({
    where: {
      id: metadata.orderId, // Corrected from metadata.id
    },
    data: {
      isPaid: true,
      address: metadata.state,
      phone: metadata.phone,
    },
    include: {
      orderItems: true,
    },
  });

  const productIds = order.orderItems.map((orderItems) => orderItems.productId);

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

  console.log(`Order with reference ${reference} marked as paid.`);
}
