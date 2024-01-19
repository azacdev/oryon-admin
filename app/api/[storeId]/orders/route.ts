import { auth } from "@clerk/nextjs";
import prismadb from "@lib/prismadb";

import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // check if user is trying to modify someone elses store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }

    const order = await prismadb.orderItem.deleteMany({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
