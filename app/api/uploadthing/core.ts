import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Original generic endpoint
  mediaPost: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "64MB", maxFileCount: 1 },
    video: { maxFileSize: "128MB", maxFileCount: 1 },
    audio: { maxFileSize: "64MB", maxFileCount: 1 },
    blob: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", file.url);
      return { url: file.url };
    }),

  docUploader: f({
    pdf: { maxFileSize: "64MB", maxFileCount: 1 },
    blob: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  videoUploader: f({
    video: { maxFileSize: "128MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  audioUploader: f({
    audio: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
