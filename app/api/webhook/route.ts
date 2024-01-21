import { NextResponse } from "next/server";
import prismadb from "@lib/prismadb";
import { Product } from "@prisma/client";
const crypto = require("crypto");

export async function POST(req: Request) {
  const body = await req.json();
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
    console.log(status);

    if (eventType === "charge.success") {
      if (status === "success") {
        await prismadb.order.update({
          where: {
            id: metadata?.orderId,
          },
          data: {
            isPaid: true,
            address: metadata.state,
            phone: metadata.phone,
            productList: metadata.productList,
            totalPrice: metadata.totalPrice,
          },
          include: {
            orderItems: true,
          },
        });

        const productsToUpdate: any = {};
        metadata.items.forEach((item: Product) => {
          productsToUpdate[item.id] = item.quantity;
        });

        for (const [productId, quantity] of Object.entries(productsToUpdate)) {
          await prismadb.product.updateMany({
            where: {
              id: productId,
            },
            data: {
              isArchived: Number(quantity) === 0 && true,
              outOfStock: Number(quantity) === 0 && true,
              quantity: {
                decrement: Number(quantity),
              },
            },
          });
        }
        console.log(`${process.env.FRONTEND_STORE_URL}/checkout?success=1`);

        return new NextResponse(null, {
          status: 302, // Redirect status code
          headers: {
            Location: `${process.env.FRONTEND_STORE_URL}/checkout?success=1`, // Replace with your desired URL
          },
        });
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
