import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import { Viewport } from "next"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QuickQR - The Modern QR Generator",
  description: "Generate QR codes from URLs, documents, audio, and video files securely and easily.",
  applicationName: "QuickQR",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuickQR",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}

