import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  url: string; // The destination or actual hosted file link
  type: "url" | "doc" | "video" | "audio" | "wifi" | "vcard";
  shortId: string;
  filename?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  password?: string;
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
  instagram: { type: String },
  github: { type: String },
  linkedin: { type: String },
  password: { type: String },
  expiresAt: { type: Date },
}, { timestamps: true });

// Since Next.js API Routes might recompile this file during dev,
// we prevent re-declaring the model.
export default mongoose.models.QRCode ||
  mongoose.model<IQRCode>("QRCode", QRCodeSchema);
