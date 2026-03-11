import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { url, type, filename } = body;

    if (!url || !type) {
      return NextResponse.json(
        { error: "URL and Type are required." },
        { status: 400 }
      );
    }

    const shortId = nanoid(8); // Generates an 8-character unique string

    const newQrEntry = await QRCode.create({
      url,
      type,
      shortId,
      filename: filename || undefined,
    });

    return NextResponse.json(
      { success: true, data: newQrEntry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("QR Code Creation Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate QR data" },
      { status: 500 }
    );
  }
}
