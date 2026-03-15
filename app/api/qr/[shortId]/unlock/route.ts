import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    const { password } = await req.json();

    if (!shortId || !password) {
      return NextResponse.json({ error: "ID and Password required" }, { status: 400 });
    }

    await dbConnect();

    const qrData = await QRCode.findOne({ shortId });

    if (!qrData) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (qrData.password !== password) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Success - return the actual destination
    const destination = qrData.url.startsWith('http') ? qrData.url : `https://${qrData.url}`;

    return NextResponse.json({ success: true, url: destination });
  } catch (error: any) {
    console.error("Unlock Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
