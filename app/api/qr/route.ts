import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";

export async function POST(req: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "DB configuration missing on server" }, { status: 500 });
    }

    await dbConnect();

    const body = await req.json();
    const { url, type, filename } = body;

    if (!url || !type) {
      return NextResponse.json({ error: "URL and Type required" }, { status: 400 });
    }

    // Generate a clean lowercase alphanumeric ID
    const shortId = Math.random().toString(36).substring(2, 9).toLowerCase();

    console.log(`Generating QR for ${url} with ID ${shortId}`);

    const newQrEntry = await QRCode.create({
      url,
      type,
      shortId,
      filename: filename || "Untitled",
    });

    if (!newQrEntry) {
      throw new Error("Failed to save to database");
    }

    return NextResponse.json(
      { 
        success: true, 
        data: {
          shortId: newQrEntry.shortId,
          url: newQrEntry.url
        } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("QR Creation Error Details:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Database saving failed" },
      { status: 500 }
    );
  }
}
