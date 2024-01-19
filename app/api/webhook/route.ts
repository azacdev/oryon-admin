import { NextResponse } from "next/server";
import prismadb from "@lib/prismadb";
import { Product } from "@prisma/client";
const crypto = require("crypto");

export async function POST(req: Request) {
  const body = await req.json();
  console.log("requestBody", body);
  const headers = req.headers;
  const secret = process.env.PAYSTACK_SECRET_TEST_KEY;
  const metadata = body.data.metadata;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  const signature = headers.get("x-paystack-signature");

  if (hash !== signature) {
    const eventType = body.event;
    const chargeData = body.data;
    const status = chargeData.status;

    if (eventType === "charge.success") {
      if (status === "success") {
        const quantity = metadata.items.map((item: Product) => item.quantity);
        const order = await prismadb.order.update({
          where: {
            id: metadata?.orderId,
          },
          data: {
            isPaid: true,
            address: metadata.state,
            phone: metadata.phone,
            quantity: quantity,
            totalPrice: metadata.totalPrice,
          },
          include: {
            orderItems: true,
          },
        });

        // const productIds = order.orderItems.map(
        //   (orderItems) => orderItems.productId
        // );

        const productsToUpdate: any = {};
        metadata.items.forEach((item: Product) => {
          productsToUpdate[item.id] = item.quantity;
        });

        // await prismadb.product.updateMany({
        //   where: {
        //     id: {
        //       in: [...productIds],
        //     },
        //   },
        //   data: {
        //     isArchived: true,
        //   },
        // });

        for (const [productId, quantity] of Object.entries(productsToUpdate)) {
          console.log(typeof quantity);
          console.log(productId);

          await prismadb.product.update({
            where: {
              id: productId,
            },
            data: {
              isArchived: Number(quantity) <= 0 && true,
              outOfStock: Number(quantity) <= 0 && true,
              quantity: {
                decrement: Number(quantity),
              },
            },
          });
        }

        return new NextResponse(null, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Payment unsuccessful" },
          { status: 400 }
        );
      }
    }
  } else {
    return NextResponse.json(
      { message: "This request isn't from Paystack" },
      { status: 401 }
    );
  }
}
