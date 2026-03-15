"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/ui/dot-pattern"
import AdvancedQRCode, { QRCodeRef } from "@/components/ui/AdvancedQRCode"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Download, Link as LinkIcon, QrCode, FileText, Video, Music, Loader2, Zap, Clock, Palette, Image as ImageIcon, Wifi, User, Shield, Phone, Mail, Building, Briefcase, Lock, Instagram, Github, Linkedin, ExternalLink, Code2, Coffee, Heart } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from "sonner"
import JSZip from "jszip"
import Link from "next/link"

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://your-website.com")
  const [qrValue, setQrValue] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState("url")
  const [isGenerating, setIsGenerating] = useState(false)
  const [expiration, setExpiration] = useState("")
  const [mounted, setMounted] = useState(false)
  
  // Password Protection States
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState("")

  // Wi-Fi States
  const [wifiSsid, setWifiSsid] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiEncryption, setWifiEncryption] = useState("WPA")

  // vCard States
  const [vCardName, setVCardName] = useState("")
  const [vCardPhone, setVCardPhone] = useState("")
  const [vCardEmail, setVCardEmail] = useState("")
  const [vCardOrg, setVCardOrg] = useState("")
  const [vCardTitle, setVCardTitle] = useState("")
  const [vCardInstagram, setVCardInstagram] = useState("")
  const [vCardGithub, setVCardGithub] = useState("")
  const [vCardLinkedin, setVCardLinkedin] = useState("")

  // Batch States
  const [batchInput, setBatchInput] = useState("")
  const [isBatching, setIsBatching] = useState(false)

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
  const generateQRCode = async (inputUrl: string, type: "url" | "doc" | "video" | "audio" | "wifi" | "vcard", filename?: string) => {
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
          expirationDuration: expiration || undefined,
          password: usePassword && password ? password : undefined,
          instagram: vCardInstagram || undefined,
          github: vCardGithub || undefined,
          linkedin: vCardLinkedin || undefined
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

  const generateWifiQR = () => {
    if (!wifiSsid) {
      toast.error("Please provide a Network SSID");
      return;
    }
    const wifiString = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`
    setQrValue(wifiString)
    toast.success("Wi-Fi network encoded!")
  }

  const generateVCardQR = () => {
    if (!vCardName) {
      toast.error("Please provide a Full Name");
      return;
    }
    let vcardString = `BEGIN:VCARD
VERSION:3.0
FN:${vCardName}
TEL:${vCardPhone}
EMAIL:${vCardEmail}
ORG:${vCardOrg}
TITLE:${vCardTitle}`

    if (vCardInstagram) vcardString += `\nURL:https://instagram.com/${vCardInstagram.replace('@', '')}`
    if (vCardGithub) vcardString += `\nURL:https://github.com/${vCardGithub}`
    if (vCardLinkedin) vcardString += `\nURL:${vCardLinkedin.startsWith('http') ? vCardLinkedin : `https://linkedin.com/in/${vCardLinkedin}`}`
    
    vcardString += `\nEND:VCARD`
    setQrValue(vcardString)
    toast.success("Social Contact Card encoded!")
  }

  const handleBatchGenerate = async () => {
    const lines = batchInput.split("\n").filter(l => l.trim().length > 0)
    if (lines.length === 0) {
      toast.error("Please provide at least one URL");
      return;
    }

    setIsBatching(true)
    const zip = new JSZip()
    const toastId = "batch-gen"
    toast.loading(`Processing 0/${lines.length} items...`, { id: toastId })

    try {
      // Import styling library for background generation
      const { default: QRCodeStyling } = await import("qr-code-styling")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        toast.loading(`Processing ${i + 1}/${lines.length}: ${line.slice(0, 20)}...`, { id: toastId })

        // 1. Register in Database
        const res = await fetch("/api/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            url: line, 
            type: "url",
            expirationDuration: expiration || undefined,
            password: usePassword && password ? password : undefined
          })
        })
        const data = await res.json()
        
        if (data.success) {
          const finalUrl = `${window.location.origin}/q/${data.data.shortId}`
          
          // 2. Generate Image Blob
          const qr = new QRCodeStyling({
            width: 500,
            height: 500,
            data: finalUrl,
            image: logoFile || undefined,
            dotsOptions: {
              type: dotStyle as any,
              gradient: {
                type: "linear",
                rotation: Math.PI / 4,
                colorStops: [{ offset: 0, color: qrColor1 }, { offset: 1, color: qrColor2 }]
              }
            },
            backgroundOptions: { color: "#ffffff" },
            imageOptions: { crossOrigin: "anonymous", margin: 10, imageSize: 0.4 },
            cornersSquareOptions: { type: (dotStyle === "square" ? "square" : "extra-rounded") as any, color: qrColor1 },
            cornersDotOptions: { type: (dotStyle === "square" ? "square" : "dot") as any, color: qrColor2 }
          })

          const blob = await qr.getRawData("png")
          if (blob) {
            const fileName = `QR_${i+1}_${data.data.shortId}.png`
            zip.file(fileName, blob)
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = `QuickQR_Batch_${Date.now()}.zip`
      link.click()
      
      toast.success(`Batch complete! Generated ${lines.length} QR codes.`, { id: toastId })
      setBatchInput("")
    } catch (err) {
      console.error(err)
      toast.error("Batch processing failed.", { id: toastId })
    } finally {
      setIsBatching(false)
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
              <TabsList className="grid w-full grid-cols-7 bg-zinc-950 border border-zinc-800/80 rounded-xl mb-8 p-1 overflow-x-auto h-auto min-w-[300px]">
                <TabsTrigger value="url" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <LinkIcon className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="doc" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <FileText className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <Video className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="audio" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <Music className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">Audio</span>
                </TabsTrigger>
                <TabsTrigger value="wifi" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <Wifi className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">WiFi</span>
                </TabsTrigger>
                <TabsTrigger value="vcard" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <User className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger value="batch" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg text-[9px] md:text-xs h-10 p-1">
                  <Zap className="w-3.5 h-3.5 md:mr-1.5" /> <span className="hidden md:inline">Batch</span>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
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
                    endpoint="docUploader"
                    onBeforeUploadBegin={(files) => {
                      const isDoc = files.every(file => 
                        file.type.includes('pdf') || 
                        file.type.includes('word') || 
                        file.type.includes('text') ||
                        file.name.endsWith('.pdf') || 
                        file.name.endsWith('.docx') || 
                        file.name.endsWith('.doc') || 
                        file.name.endsWith('.txt')
                      );
                      
                      const isVideoOrAudio = files.some(file => 
                        file.type.includes('video') || 
                        file.type.includes('audio')
                      );

                      if (isVideoOrAudio || !isDoc) {
                        toast.error("Please provide a docs or pdf");
                        return [];
                      }
                      return files;
                    }}
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
                    endpoint="videoUploader"
                    onBeforeUploadBegin={(files) => {
                      const isVideo = files.every(file => file.type.includes('video'));
                      if (!isVideo) {
                        toast.error("Please provide a video file");
                        return [];
                      }
                      return files;
                    }}
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
                  {/* Creator Profile for Video */}
                  <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                    <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <User className="w-3 h-3" /> Creator Profile (Optional)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="Instagram" value={vCardInstagram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardInstagram(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                       <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="GitHub" value={vCardGithub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardGithub(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                       <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="LinkedIn" value={vCardLinkedin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardLinkedin(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <div className="space-y-4">
                  <Label className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">Upload Audio (MP3, WAV)</Label>
                  <UploadDropzone
                    endpoint="audioUploader"
                    onBeforeUploadBegin={(files) => {
                      const isAudio = files.every(file => file.type.includes('audio'));
                      if (!isAudio) {
                        toast.error("Please provide an audio file");
                        return [];
                      }
                      return files;
                    }}
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
                  {/* Creator Profile for Audio */}
                  <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                    <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <User className="w-3 h-3" /> Creator Profile (Optional)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="Instagram" value={vCardInstagram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardInstagram(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                       <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="GitHub" value={vCardGithub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardGithub(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                       <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <Input placeholder="LinkedIn" value={vCardLinkedin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardLinkedin(e.target.value)} className="bg-zinc-950/30 border-zinc-800 h-10 pl-9 text-xs" />
                       </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="mt-0 space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Network SSID</Label>
                       <Input placeholder="Home Wi-Fi" value={wifiSsid} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiSsid(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Encryption</Label>
                       <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                             <SelectItem value="WPA">WPA/WPA2</SelectItem>
                             <SelectItem value="WEP">WEP</SelectItem>
                             <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                  </div>
                  {wifiEncryption !== "nopass" && (
                    <div className="space-y-2">
                       <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Password</Label>
                       <Input type="password" placeholder="••••••••" value={wifiPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiPassword(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                    </div>
                  )}
                  <Button onClick={generateWifiQR} disabled={isGenerating} className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-zinc-700">
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Wi-Fi QR"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vcard" className="mt-0 space-y-4">
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Full Name</Label>
                          <Input placeholder="Basudev" value={vCardName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardName(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Phone Number</Label>
                           <Input placeholder="+91 1234567890" value={vCardPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardPhone(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Email Address</Label>
                        <Input type="email" placeholder="basu@example.com" value={vCardEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardEmail(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Organization</Label>
                           <Input placeholder="CodeWithBasu" value={vCardOrg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardOrg(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Job Title</Label>
                           <Input placeholder="Lead Developer" value={vCardTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVCardTitle(e.target.value)} className="bg-zinc-950 border-zinc-800 h-12" />
                       </div>
                    </div>



                    <Button onClick={generateVCardQR} disabled={isGenerating} className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-zinc-700">
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Business Card QR"}
                    </Button>
                 </div>
              </TabsContent>

              <TabsContent value="batch" className="mt-0 space-y-4">
                 <div className="space-y-4">
                    <Label className="text-zinc-400 flex items-center text-xs font-semibold tracking-widest uppercase">Batch URL Processor (One per line)</Label>
                    <textarea 
                      placeholder="https://google.com&#10;https://github.com&#10;https://basudev.dev"
                      value={batchInput}
                      onChange={(e) => setBatchInput(e.target.value)}
                      className="w-full bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 h-40 rounded-xl px-5 py-4 text-sm focus-visible:ring-1 focus-visible:ring-white/20 font-mono resize-none"
                    />
                    <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                       <Zap className="w-4 h-4 text-amber-500" />
                       <p className="text-[10px] text-zinc-500">Each link will be registered in the database with your current visual settings.</p>
                    </div>
                    <Button 
                      onClick={handleBatchGenerate} 
                      disabled={isBatching} 
                      className="w-full h-14 bg-white text-black hover:bg-zinc-200 transition-all font-bold rounded-xl"
                    >
                      {isBatching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Bundle (.zip)"}
                    </Button>
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

            {/* Advanced Configuration */}
            <div className="mt-8 space-y-4">
              {/* Shield Protocol (Password Protection) */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-zinc-900/40 to-black border border-emerald-500/20 rounded-3xl space-y-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-500 hover:border-emerald-500/30 group/shield">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-emerald-500/20 flex items-center justify-center group-hover/shield:scale-105 transition-transform duration-500">
                          <Shield className="w-6 h-6 text-emerald-500" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-zinc-100 text-sm font-semibold tracking-wide">Shield Protocol</span>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] leading-none mt-1">Encrypted Gateway</span>
                       </div>
                    </div>
                    <Switch 
                      checked={usePassword} 
                      onCheckedChange={setUsePassword}
                      className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-800 scale-110 shadow-lg"
                    />
                 </div>
                 
                 {usePassword && (
                    <div className="space-y-4 pt-4 border-t border-emerald-500/10 animate-in fade-in slide-in-from-top-3 duration-500">
                       <div className="flex items-center justify-between">
                          <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">Secret 4-Digit PIN</Label>
                          <Lock className="w-3 h-3 text-emerald-500/50" />
                       </div>
                       <Input 
                         maxLength={4} 
                         placeholder="0000" 
                         value={password} 
                         onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                         className="bg-zinc-950 border-emerald-500/20 h-16 text-center text-3xl tracking-[0.8em] font-mono text-emerald-400 focus:border-emerald-500/50 shadow-inner rounded-2xl"
                       />
                       <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                          <Zap className="w-3.5 h-3.5 text-emerald-500" />
                          <p className="text-zinc-500 text-[10px] font-medium leading-normal">Scanners will be prompted for this PIN before redirection.</p>
                       </div>
                    </div>
                 )}
              </div>

              {/* Advanced QR Customizer Accordion */}
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

                {/* Profile Attribution Preview */}
                {(vCardInstagram || vCardGithub || vCardLinkedin) && (
                  <div className="flex gap-4 mt-4 py-2 px-4 bg-white/5 border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {vCardInstagram && <Instagram className="w-4 h-4 text-pink-500" />}
                    {vCardGithub && <Github className="w-4 h-4 text-zinc-300" />}
                    {vCardLinkedin && <Linkedin className="w-4 h-4 text-blue-400" />}
                  </div>
                )}
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

              <div className="w-full mt-auto space-y-3">
                <Button 
                  onClick={handleDownload}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 border-0 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center group relative z-20 shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                  Export QR Matrix
                </Button>
                <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold">
                  High-Resolution PNG • 500x500px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 flex flex-col items-center space-y-8 pb-10">
          
          <div className="flex flex-col items-center gap-6">
            {/* Unique Developer Badge */}
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-full hover:border-zinc-700/80 hover:bg-zinc-900/40 transition-all duration-500 group shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <Code2 className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform duration-500" />
              <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />
              <span className="text-zinc-400 text-xs font-medium tracking-tight">Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-zinc-400 text-xs font-medium tracking-tight">&</span>
              <Coffee className="w-3.5 h-3.5 text-amber-600 group-hover:-translate-y-0.5 transition-transform duration-500" />
              <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />
              <span className="text-zinc-400 text-xs font-medium tracking-tight">by</span>
              <a 
                href="https://github.com/CodeWithBasu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-emerald-400 font-bold text-xs tracking-wide transition-all duration-300 ml-0.5 flex items-center gap-1.5"
              >
                Basudev
                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-500" />
              </a>
            </div>
            
            {/* Social & Docs Bar */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-zinc-950/40 border border-zinc-900 rounded-xl p-1">
                <a href="https://github.com/CodeWithBasu" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-300">
                  <Github className="w-4.5 h-4.5" />
                </a>
                <a href="https://www.instagram.com/wandersoul________?igsh=MTR2dDJua2NpeHI5Yw%3D%3D" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-pink-500 hover:bg-zinc-800/50 rounded-lg transition-all duration-300">
                  <Instagram className="w-4.5 h-4.5" />
                </a>
                <a href="https://www.linkedin.com/in/basudev-moharana" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-zinc-800/50 rounded-lg transition-all duration-300">
                  <Linkedin className="w-4.5 h-4.5" />
                </a>
              </div>
              
              <div className="w-[1px] h-8 bg-zinc-800/50" />
              
              <Link href="/docs" className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-500 group">
                <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
                Documentation
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-[9px] text-zinc-700 uppercase tracking-[0.4em] font-medium leading-none">
              &copy; 2026 QuickQR Engine
            </p>
            <div className="h-1 w-8 bg-gradient-to-r from-transparent via-zinc-800 to-transparent rounded-full" />
            <p className="text-[8px] text-zinc-800 uppercase tracking-widest font-bold">
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
