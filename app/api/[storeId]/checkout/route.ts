import prismadb from "@lib/prismadb";
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
    const { productIds, values } = await req.json();

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

    const calculateAmount = () => {
      return products.reduce(
        (total: number, item: any) => total + Number(item.price),
        0
      ) * 100;
    };
    const amount = calculateAmount();

    const fields = {
      email: values.email,
      amount: amount,
      metadata: {
        orderId: order.id,
        state: values.state,
        products: products,
        firstname: values.firstname,
        phone: values.phone,
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
