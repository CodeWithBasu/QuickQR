"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/ui/dot-pattern"
import AdvancedQRCode, { QRCodeRef } from "@/components/ui/AdvancedQRCode"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Download, Link as LinkIcon, QrCode, FileText, Video, Music, Loader2, Zap, Clock, Palette, Image as ImageIcon } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from "sonner"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://your-website.com")
  const [qrValue, setQrValue] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState("url")
  const [isGenerating, setIsGenerating] = useState(false)
  const [expiration, setExpiration] = useState("")
  const [mounted, setMounted] = useState(false)

  // Advanced QR Customizer States
  const [qrColor1, setQrColor1] = useState("#ffffff")
  const [qrColor2, setQrColor2] = useState("#a1a1aa") // zinc-400
  const [dotStyle, setDotStyle] = useState("square")
  const [logoFile, setLogoFile] = useState<string | null>(null)
  
  const advancedQrRef = useRef<QRCodeRef>(null)

  // Initialize once mounted
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setQrValue(window.location.origin)
      
      // Check for errors in the URL (from failed redirects)
      const params = new URLSearchParams(window.location.search)
      if (params.get("error") === "notfound") {
        toast.error("The scanned QR link was not found.")
      } else if (params.get("error") === "expired") {
        toast.error("The scanned QR link has expired.", { icon: "⏳" })
      }
    }
  }, [])

  // Logo Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogoFile(null)
    }
  }

  const handleDownload = () => {
    if (advancedQrRef.current) {
      advancedQrRef.current.download()
    }
  }

  // Generates shortlink in the database
  const generateQRCode = async (inputUrl: string, type: "url" | "doc" | "video" | "audio", filename?: string) => {
    try {
      setIsGenerating(true)
      toast.loading("Registering QR in database...", { id: "qr-gen" })
      
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: inputUrl, 
          type, 
          filename, 
          expirationDuration: expiration || undefined 
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Build complete URL based on the current window origin pointing to the shortlink
        let trackingUrl = `${window.location.origin}/q/${data.data.shortId}`
        
        // Contextual routing: Appends the filename directly to the URL so that when users scan the QR, 
        // their smartphone displays the actual filename before they click it, rather than just a random ID.
        if (filename && type !== "url") {
          const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
          trackingUrl += `/${encodeURIComponent(safeName)}`
        }

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
                    }}
                    appearance={{
                      button: "ut-ready:bg-white ut-ready:text-black ut-uploading:bg-zinc-800 ut-uploading:text-white ut-uploading:after:bg-emerald-500 ut-readying:bg-zinc-800 text-sm font-semibold w-64 h-12 rounded-xl border-none shadow-lg transition-all",
                      container: "border-zinc-800 bg-zinc-950/40 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-600 hover:bg-zinc-900/40 transition-all py-8 group",
                      label: "text-zinc-200 font-medium group-hover:text-white transition-colors",
                      allowedContent: "text-zinc-500 text-xs mt-2 group-hover:text-zinc-400 transition-colors",
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
                    }}
                    appearance={{
                      button: "ut-ready:bg-white ut-ready:text-black ut-uploading:bg-zinc-800 ut-uploading:text-white ut-uploading:after:bg-emerald-500 ut-readying:bg-zinc-800 text-sm font-semibold w-64 h-12 rounded-xl border-none shadow-lg transition-all",
                      container: "border-zinc-800 bg-zinc-950/40 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-600 hover:bg-zinc-900/40 transition-all py-8 group",
                      label: "text-zinc-200 font-medium group-hover:text-white transition-colors",
                      allowedContent: "text-zinc-500 text-xs mt-2 group-hover:text-zinc-400 transition-colors",
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
                    }}
                    appearance={{
                      button: "ut-ready:bg-white ut-ready:text-black ut-uploading:bg-zinc-800 ut-uploading:text-white ut-uploading:after:bg-emerald-500 ut-readying:bg-zinc-800 text-sm font-semibold w-64 h-12 rounded-xl border-none shadow-lg transition-all",
                      container: "border-zinc-800 bg-zinc-950/40 h-56 rounded-2xl border-2 border-dashed hover:border-zinc-600 hover:bg-zinc-900/40 transition-all py-8 group",
                      label: "text-zinc-200 font-medium group-hover:text-white transition-colors",
                      allowedContent: "text-zinc-500 text-xs mt-2 group-hover:text-zinc-400 transition-colors",
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-2 hover:border-zinc-700 transition-colors">
                <Clock className="w-4 h-4 text-zinc-500" />
                {mounted ? (
                  <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger className="w-[140px] h-8 border-0 bg-transparent text-zinc-300 text-sm focus:ring-0 shadow-none p-0 flex justify-between">
                      <SelectValue placeholder="No Expiration" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                      <SelectItem value="never">No Expiration</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="30d">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-[140px] h-8 flex items-center text-zinc-500 text-sm">Loading...</div>
                )}
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4 py-1">
                {activeTab === "url" 
                  ? "Enter a URL to safely encode into the database."
                  : "Upload a file to generate a secure sharing link."}
              </p>
            </div>

            {/* Advanced QR Customizer Accordion */}
            <div className="mt-8">
              <Accordion type="single" collapsible className="w-full bg-zinc-950/40 border border-zinc-800 rounded-2xl px-4 py-2">
                <AccordionItem value="customize" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-zinc-200 font-medium tracking-wide">Advanced Visual Settings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6 space-y-6">
                    {/* Dot Styles */}
                    <div className="space-y-3">
                      <Label className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Dot Style</Label>
                      <Select value={dotStyle} onValueChange={setDotStyle}>
                        <SelectTrigger className="w-full h-12 bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-emerald-500/20 rounded-xl">
                          <SelectValue placeholder="Select dot style" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="square">Sharp Squares</SelectItem>
                          <SelectItem value="rounded">Rounded Squares</SelectItem>
                          <SelectItem value="dots">Circular Dots</SelectItem>
                          <SelectItem value="classy">Classy Curves</SelectItem>
                          <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color Gradients */}
                    <div className="space-y-4">
                      <Label className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Gradient Colors</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <span className="text-zinc-600 text-[10px] uppercase">Primary</span>
                          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
                            <input type="color" value={qrColor1} onChange={(e) => setQrColor1(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent border-0 p-0 cursor-pointer" />
                            <span className="text-zinc-400 text-sm font-mono">{qrColor1}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <span className="text-zinc-600 text-[10px] uppercase">Secondary</span>
                          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
                            <input type="color" value={qrColor2} onChange={(e) => setQrColor2(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent border-0 p-0 cursor-pointer" />
                            <span className="text-zinc-400 text-sm font-mono">{qrColor2}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Custom Logo */}
                    <div className="space-y-3">
                      <Label className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Center Logo (Optional)</Label>
                      <label htmlFor="logo-upload" className="flex items-center justify-center gap-2 w-full h-12 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
                        <ImageIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-400 text-sm">{logoFile ? "Change Logo Image" : "Upload Logo Image"}</span>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                      {logoFile && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setLogoFile(null)}
                          className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 h-10 mt-2 rounded-lg"
                        >
                          Remove Current Logo
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                  className="p-4 rounded-xl shadow-xl border flex items-center justify-center min-h-[250px] min-w-[250px]"
                  style={{ 
                    backgroundColor: "#000000",
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <AdvancedQRCode 
                    ref={advancedQrRef}
                    data={qrValue}
                    color1={qrColor1}
                    color2={qrColor2}
                    dotStyle={dotStyle}
                    logoFile={logoFile}
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
        
        {/* Footer */}
        <div className="mt-16 text-center text-zinc-500 text-sm font-medium tracking-wide">
          <p className="flex items-center justify-center gap-1">
            Made with <span className="text-red-500 mx-1 animate-pulse">❤️</span> and <span className="text-amber-700 mx-1">☕</span> by <span className="text-white hover:text-zinc-300 transition-colors cursor-default">Basudev</span>
          </p>
          <p className="mt-2 text-xs opacity-60">
            &copy; {new Date().getFullYear()} QuickQR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

