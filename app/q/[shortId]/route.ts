import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    
    if (!shortId) {
      console.error("Missing shortId in request");
      return NextResponse.redirect(new URL("/", req.url));
    }

    await dbConnect();

    // Find the QR data by shortId (case-insensitive for safety)
    const qrData = await QRCode.findOne({ 
      shortId: { $regex: new RegExp(`^${shortId}$`, 'i') } 
    });

    if (!qrData || !qrData.url) {
      console.error(`QR data not found for ID: ${shortId}`);
      // Fallback: Redirect to home with a query param to show an error toast if you implement one later
      return NextResponse.redirect(new URL("/?error=notfound", req.url));
    }

    // Redirect the user to the actual destination URL
    // Ensure the URL is absolute
    const destination = qrData.url.startsWith('http') ? qrData.url : `https://${qrData.url}`;
    
    return NextResponse.redirect(new URL(destination));
  } catch (error: any) {
    console.error("QR Redirect Error:", error);
    // Generic fallback to home
    return NextResponse.redirect(new URL("/", req.url));
  }
}
