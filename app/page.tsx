"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/ui/dot-pattern"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Link as LinkIcon, QrCode, FileText, Video, Music, Loader2, Zap } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from "sonner"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://your-website.com")
  const [qrValue, setQrValue] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState("url")
  const [isGenerating, setIsGenerating] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize once mounted
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setQrValue(window.location.origin)
      
      // Check for errors in the URL (from failed redirects)
      const params = new URLSearchParams(window.location.search)
      if (params.get("error") === "notfound") {
        toast.error("The scanned QR link was not found or has expired.")
      }
    }
  }, [])

  // Hardcoded optimized defaults
  const QR_COLOR = "#ffffff"
  const QR_BG_COLOR = "#000000"
  const QR_SIZE = 280
  const QR_LEVEL = "H"

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
      downloadLink.download = "quickqr.png"
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Generates shortlink in the database
  const generateQRCode = async (inputUrl: string, type: "url" | "doc" | "video" | "audio", filename?: string) => {
    try {
      setIsGenerating(true)
      toast.loading("Registering QR in database...", { id: "qr-gen" })
      
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl, type, filename })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Build complete URL based on the current window origin pointing to the shortlink
        const trackingUrl = `${window.location.origin}/q/${data.data.shortId}`
        setQrValue(trackingUrl)
        console.log("Generated tracking URL:", trackingUrl)
        toast.success("QR Code ready to scan!", { id: "qr-gen" })
      } else {
        console.error("Failed:", data.error)
        toast.error(`Error: ${data.error || "Generation failed"}`, { id: "qr-gen" })
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error. Check your connection.", { id: "qr-gen" })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-zinc-100 font-sans selection:bg-white/20 overflow-hidden">
      
      {/* MagicUI Animated Dot Pattern Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern
          width={40}
          height={40}
          cx={1}
          cy={1}
          cr={1.5}
          glow={true}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] fill-white/50 opacity-100 h-screen w-screen"
          )}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-16 md:px-12">
        
        {/* Sleek Header Section */}
        <div className="flex flex-col items-center mb-16 space-y-5">
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl mb-2 group transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <QrCode className="w-6 h-6 text-zinc-100 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
            QuickQR
          </h1>
          <p className="text-zinc-500 text-lg font-light tracking-wide max-w-lg text-center">
            Generate pristine matrices for URLs, documents, and media.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center justify-center">
          
          {/* Main Controls Console */}
          <div className="w-full lg:w-[55%] space-y-6 group bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/50 shadow-2xl relative z-20">
            
            <Tabs defaultValue="url" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-zinc-950 border border-zinc-800/80 rounded-xl mb-8 p-1">
                <TabsTrigger value="url" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-xs md:text-sm h-10">
                  <LinkIcon className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden md:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="doc" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-xs md:text-sm h-10">
                  <FileText className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden md:inline">Document</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-xs md:text-sm h-10">
                  <Video className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden md:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="audio" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-xs md:text-sm h-10">
                  <Music className="w-3.5 h-3.5 md:mr-2" /> <span className="hidden md:inline">Audio</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-0 space-y-4">
                <Label htmlFor="url" className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase mb-3">
                  <LinkIcon className="w-4 h-4 mr-3 text-zinc-500" />
                  Destination URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-domain.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 h-16 rounded-xl px-5 text-lg focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all font-mono shadow-inner hover:border-zinc-700"
                />
                <Button 
                  onClick={() => generateQRCode(url, "url")}
                  disabled={isGenerating || !url}
                  className="w-full h-14 mt-4 bg-white/10 hover:bg-white/20 text-white border border-zinc-700 rounded-xl font-medium tracking-wide transition-all duration-300"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4 mr-2" /> Generate Secure QR</>}
                </Button>
              </TabsContent>

              <TabsContent value="doc" className="mt-0">
                <div className="space-y-4">
                  <Label className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">Upload Document (PDF, DOCX)</Label>
                  <UploadDropzone
                    endpoint="mediaPost"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        generateQRCode(res[0].url, "doc", res[0].name)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`)
                    }}
                    content={{
                      label: "PDF, DOCX up to 64MB",
                      allowedContent: "Drop files or click to upload",
                      button({ ready, isUploading }) {
                        return (
                          <span className="text-black font-semibold">
                            {isUploading ? "Uploading..." : "Choose File"}
                          </span>
                        )
                      }
                    }}
                    appearance={{
                      button: ({ ready, isUploading }) => {
                        return cn(
                          "w-64 h-12 rounded-xl border-0 transition-all duration-300 shadow-lg px-6",
                          ready ? "bg-white hover:bg-zinc-200 cursor-pointer" : "bg-zinc-800 text-zinc-500",
                          isUploading && "bg-zinc-900 cursor-not-allowed opacity-50"
                        )
                      },
                      container: "border-zinc-800 bg-zinc-950/30 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-700 transition-colors py-8",
                      label: "text-zinc-400 font-medium",
                      allowedContent: "text-zinc-600 text-xs mt-1",
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-0">
                <div className="space-y-4">
                   <Label className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">Upload Video (MP4, MKV)</Label>
                   <UploadDropzone
                    endpoint="mediaPost"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        generateQRCode(res[0].url, "video", res[0].name)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`)
                    }}
                    content={{
                      label: "MP4, MKV up to 128MB",
                      allowedContent: "Drop files or click to upload",
                      button({ ready, isUploading }) {
                        return (
                          <span className="text-black font-semibold">
                            {isUploading ? "Uploading..." : "Choose File"}
                          </span>
                        )
                      }
                    }}
                    appearance={{
                      button: ({ ready, isUploading }) => {
                        return cn(
                          "w-64 h-12 rounded-xl border-0 transition-all duration-300 shadow-lg px-6",
                          ready ? "bg-white hover:bg-zinc-200 cursor-pointer" : "bg-zinc-800 text-zinc-500",
                          isUploading && "bg-zinc-900 cursor-not-allowed opacity-50"
                        )
                      },
                      container: "border-zinc-800 bg-zinc-950/30 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-700 transition-colors py-8",
                      label: "text-zinc-400 font-medium",
                      allowedContent: "text-zinc-600 text-xs mt-1",
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <div className="space-y-4">
                  <Label className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">Upload Audio (MP3, WAV)</Label>
                  <UploadDropzone
                    endpoint="mediaPost"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        generateQRCode(res[0].url, "audio", res[0].name)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`)
                    }}
                    content={{
                      label: "MP3, WAV up to 64MB",
                      allowedContent: "Drop files or click to upload",
                      button({ ready, isUploading }) {
                        return (
                          <span className="text-black font-semibold">
                            {isUploading ? "Uploading..." : "Choose File"}
                          </span>
                        )
                      }
                    }}
                    appearance={{
                      button: ({ ready, isUploading }) => {
                        return cn(
                          "w-64 h-12 rounded-xl border-0 transition-all duration-300 shadow-lg px-6",
                          ready ? "bg-white hover:bg-zinc-200 cursor-pointer" : "bg-zinc-800 text-zinc-500",
                          isUploading && "bg-zinc-900 cursor-not-allowed opacity-50"
                        )
                      },
                      container: "border-zinc-800 bg-zinc-950/30 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-700 transition-colors py-8",
                      label: "text-zinc-400 font-medium",
                      allowedContent: "text-zinc-600 text-xs mt-1",
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-2">
              <p className="text-zinc-500 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4 py-1">
                {activeTab === "url" 
                  ? "Enter a URL to safely encode into the database."
                  : "Upload a file to generate a secure sharing link."}
              </p>
            </div>

          </div>

          {/* Minimalist Output Display */}
          <div className="w-full lg:w-[45%] flex flex-col items-center">
            
            <div className="w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden min-h-[420px]">
              
              <div className="absolute top-6 left-6 flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              
              <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase absolute top-6 right-6">
                Preview Data
              </div>

              <div 
                className="relative mt-8 mb-8 flex items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-700 ease-out z-20"
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
                    value={qrValue}
                    size={200}
                    fgColor={QR_COLOR}
                    bgColor={QR_BG_COLOR}
                    level={QR_LEVEL}
                    includeMargin={true}
                    className="block relative z-20"
                  />
                </div>
              </div>

              {/* Debug URL Link */}
              <div className="w-full mb-6 px-4 py-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl flex items-center justify-between group/url">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mb-1">Scanning URL</span>
                  <span className="text-xs text-zinc-400 font-mono truncate max-w-[180px]">
                    {qrValue}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(qrValue)
                    toast.success("Link copied to clipboard")
                  }}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Localhost Warning */}
              {mounted && window.location.hostname === 'localhost' && (
                <div className="mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center space-x-2">
                   <Zap className="w-3.5 h-3.5 text-amber-500" />
                   <p className="text-[10px] text-amber-500/80 font-medium">
                     Running on localhost. Mobile scans may fail.
                   </p>
                </div>
              )}

              <Button 
                onClick={handleDownload}
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

