import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";

export async function GET(
  req: Request,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = await params;
    await dbConnect();

    const qrData = await QRCode.findOne({ shortId });

    if (!qrData) {
      // If the short link doesn't exist, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect the user to the actual destination URL
    return NextResponse.redirect(new URL(qrData.url));
  } catch (error: any) {
    console.error("QR Redirect Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
