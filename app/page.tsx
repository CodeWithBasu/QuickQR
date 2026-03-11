"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/ui/dot-pattern"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Link as LinkIcon, QrCode } from "lucide-react"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://your-website.com")
  const [debouncedUrl, setDebouncedUrl] = useState(url)
  const [isHovered, setIsHovered] = useState(false)

  // Hardcoded optimized defaults for the removed controls
  const QR_COLOR = "#ffffff"
  const QR_BG_COLOR = "#000000"
  const QR_SIZE = 280
  const QR_LEVEL = "H"

  // Auto-update QR code on URL change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrl(url)
    }, 300)
    return () => clearTimeout(handler)
  }, [url])

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = QR_SIZE
      canvas.height = QR_SIZE
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "qrcode.png"
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-zinc-100 font-sans selection:bg-white/20 overflow-hidden">
      
      {/* MagicUI Animated Dot Pattern Background - Optimized to prevent lag */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern
          width={32}
          height={32}
          cx={1}
          cy={1}
          cr={1.5}
          glow={false}
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)] fill-white/20 opacity-100 h-screen w-screen"
          )}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 py-16 md:px-12">
        
        {/* Sleek Header Section */}
        <div className="flex flex-col items-center mb-16 space-y-5">
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl mb-2 group transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <QrCode className="w-6 h-6 text-zinc-100 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Monochrome QR
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-light tracking-wide max-w-lg text-center">
            Generate pristine, high-fidelity matrices in pure darkness.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-center">
          
          {/* Main Controls Console - Brutalist & Clean */}
          <div className="w-full lg:w-1/2 space-y-8 group bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/50 shadow-2xl">
            
            {/* URL Input Section */}
            <div className="space-y-4">
              <Label htmlFor="url" className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">
                <LinkIcon className="w-4 h-4 mr-3 text-zinc-500" />
                Destination URL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-domain.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  suppressHydrationWarning
                  className="w-full bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 h-16 rounded-xl px-5 text-lg focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all font-mono shadow-inner hover:border-zinc-700 relative z-20"
                />
              </div>
            </div>
            
            <p className="text-zinc-500 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4 py-1">
              Your link is encoded immediately with highest precision error correction.
            </p>

          </div>

          {/* Minimalist Output Display */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            
            <div className="w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden min-h-[400px]">
              
              <div className="absolute top-6 left-6 flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              
              <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase absolute top-6 right-6">
                Preview Data
              </div>

              <div 
                className="relative mt-8 mb-12 flex items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-700 ease-out z-20"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div 
                  className="p-4 rounded-xl shadow-2xl border"
                  style={{ 
                    backgroundColor: QR_BG_COLOR,
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={debouncedUrl || "https://your-website.com"}
                    size={200}
                    fgColor={QR_COLOR}
                    bgColor={QR_BG_COLOR}
                    level={QR_LEVEL}
                    includeMargin={true}
                    className="block relative z-20"
                  />
                </div>
              </div>

              <Button 
                onClick={handleDownload}
                suppressHydrationWarning
                className="w-full mt-auto h-14 bg-white text-black hover:bg-zinc-200 border-0 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center group relative z-20"
              >
                <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Download PNG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

