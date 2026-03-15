import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  url: string; // The destination or actual hosted file link
  type: "url" | "doc" | "video" | "audio" | "wifi" | "vcard";
  shortId: string;
  filename?: string;
  password?: string;
  createdAt: Date;
  expiresAt?: Date;
}

const QRCodeSchema: Schema = new Schema({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["url", "doc", "video", "audio", "wifi", "vcard"],
    required: true,
  },
  shortId: { type: String, required: true, unique: true },
  filename: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 },
});

// Since Next.js API Routes might recompile this file during dev,
// we prevent re-declaring the model.
export default mongoose.models.QRCode ||
  mongoose.model<IQRCode>("QRCode", QRCodeSchema);
