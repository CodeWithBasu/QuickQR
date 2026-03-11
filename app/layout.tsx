import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QuickQR - The Modern QR Generator",
  description: "Generate QR codes from URLs, documents, audio, and video files securely and easily.",
    generator: 'v0.app'
}

import { Toaster } from "sonner"

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

