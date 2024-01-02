// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// import { stripe } from "@lib/stripe";
// import prismadb from "@lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "+",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   const { productIds } = await req.json();

//   if (!productIds || productIds.length === 0) {
//     return new NextResponse("Product Ids are required", { status: 400 });
//   }

//   const products = await prismadb.product.findMany({
//     where: {
//       id: {
//         in: productIds,
//       },
//     },
//   });

//   const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//   products.forEach((product) => {
//     line_items.push({
//       quantity: 1,
//       price_data: {
//         currency: "USD",
//         product_data: {
//           name: product.name,
//         },
//         unit_amount: product.price.toNumber() * 100,
//       },
//     });
//   });

//   const order = await prismadb.order.create({
//     data: {
//       storeId: params.storeId,
//       isPaid: false,
//       orderItems: {
//         create: productIds.map((productId: string) => ({
//           product: {
//             connect: {
//               id: productId,
//             },
//           },
//         })),
//       },
//     },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items,
//     mode: "payment",
//     billing_address_collection: "required",
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.FRONTEND_STORE_URL}?success=1`,
//     cancel_url: `${process.env.FRONTEND_STORE_URL}?cancelled=1`,
//     metadata: {
//       orderId: order.id,
//     },
//   });

//   return NextResponse.json(
//     { url: session.url },
//     {
//       headers: corsHeaders,
//     }
//   );
// }

import Paystack from "paystack";
import { NextResponse } from "next/server";
import prismadb from "@lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://oryon-admin.vercel.app/",
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
  const { productIds } = await req.json();

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

  // @ts-ignore
  const paystack = new Paystack({
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  });

  const session = await paystack.transaction.initialize({
    amount: calculateTotalAmount(products),
    email: "azacdev@gmail.com", // Replace with the customer's email
    reference: generateUniqueReference(),
    callback_url: `${process.env.FRONTEND_STORE_URL}?success=1`,
  });

  return NextResponse.json(
    { url: session.data.authorization_url},
    {
      headers: corsHeaders,
    }
  );
}

function calculateTotalAmount(products: any) {
  return products.reduce(
    (total: number, product: any) => total + product.price.toNumber() * 100,
    0
  );
}

function generateUniqueReference() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
