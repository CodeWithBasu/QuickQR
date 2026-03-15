import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params; // NextJS 15 requires awaiting params
    await dbConnect();

    const qrData = await QRCode.findOne({ shortId });

    if (!qrData) {
      return NextResponse.json(
        { error: "QR code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: qrData }, { status: 200 });
  } catch (error: any) {
    console.error("QR Code Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch QR data" },
      { status: 500 }
    );
  }
}
