import prismadb from "@lib/prismadb";
import { Product } from "@prisma/client";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds, values, items } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product Ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const totalAmount = items.reduce((total: number, item: Product) => {
      const matchingProduct: any = products.find(
        (product) => product.id === item.id
      );
      if (matchingProduct) {
        total += matchingProduct.price * item.quantity;
      }
      return total;
    }, 0 as number);

    const fields = {
      email: values.email,
      amount: totalAmount * 100,
      metadata: {
        orderId: order.id,
        state: values.state,
        products: products,
        firstname: values.firstname,
        phone: values.phone,
        totalPrice: totalAmount,
        items: items,
        cancel_action: "http://localhost:3001/checkout",
      },
    };

    const url = "https://api.paystack.co/transaction/initialize";

    const paystackResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
      },
      body: JSON.stringify(fields),
    });

    if (!paystackResponse.ok) {
      throw new Error(
        `Paystack API returned status ${paystackResponse.status}`
      );
    }

    const paystackResult = await paystackResponse.json();

    return new NextResponse(JSON.stringify(paystackResult), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error has occurred" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
