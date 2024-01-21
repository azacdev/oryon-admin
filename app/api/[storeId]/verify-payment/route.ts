import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  console.log(reference);

  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    if (!reference) {
      return new NextResponse("Transaction reference is missing", {
        status: 400,
      });
    }
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`,
      },
    });

    if (!verifyResponse.ok) {
      console.log(verifyResponse.status);
      throw new Error(`Paystack API returned status ${verifyResponse.status}`);
    }

    const verifyResult = await verifyResponse.json();
    console.log(verifyResult);

    // Check the status from the verification result
    if (verifyResult.status && verifyResult.data.status === "success") {
      return new NextResponse("Verification successful", {
        status: 200,
        headers: corsHeaders,
      });
    } else {
      // Handle unsuccessful verification
      return new NextResponse("Verification failed", {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    return new NextResponse("An error occurred during verification", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
