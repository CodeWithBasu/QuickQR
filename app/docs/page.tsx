"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Shield, 
  Zap, 
  ExternalLink, 
  ChevronLeft, 
  Lock, 
  Database, 
  Server, 
  Cpu,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen relative bg-black text-zinc-100 font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* Background Pattern */}
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        
        {/* Navigation */}
        <div className="mb-16">
          <Link href="/">
            <Button variant="ghost" className="text-zinc-500 hover:text-white gap-2 pl-0 hover:bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              Back to Generator
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-6 mb-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Documentation</h1>
          </div>
          <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
            QuickQR is a high-performance engine designed for secure, contextual, and dynamic data distribution. 
            Understand how our core architecture handles your matrices.
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            <section id="introduction" className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                System Overview
              </h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                QuickQR functions as a dynamic routing layer between your data and the end-user. 
                Unlike traditional QR codes that hardcode URLs, our engine generates unique 
                shortlink identifiers (`/q/shortId`) that point to records in our secure database.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl space-y-3">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Data Persistence</h3>
                  <p className="text-zinc-500 text-xs">All matrices are registered in MongoDB, enabling full lifecycle control including expirations and revocations.</p>
                </div>
                <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl space-y-3">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Edge Routing</h3>
                  <p className="text-zinc-500 text-xs">Our Next.js router handles incoming scans, validating security protocols before redirecting to the destination.</p>
                </div>
              </div>
            </section>

            <section id="security" className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Security Protocols
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-emerald-500 uppercase tracking-widest">Shield Protocol (PIN)</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Sensitive media or documents can be protected with 4-digit PIN encryption. 
                      Upon scanning, the user is redirected to a secure unlock page (`/unlock/[id]`) 
                      where the correct key must be entered to decrypt access.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-zinc-200 uppercase tracking-widest">Expiration Control</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Set TTL (Time-To-Live) values on your matrices. Once the expiration window passes, 
                      the shortlink automatically invalidates, and viewers will receive an "Expired" status.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="features" className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Contextual Routing
              </h2>
              <div className="p-8 bg-zinc-950/30 border border-zinc-800 rounded-3xl space-y-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Our engine appends the original filename to the short-URL structure. 
                  This "Contextual Routing" ensures that when a recipient scans a QR for a document named `Invoice_2026.pdf`, 
                  the browser preview displays the filename, building trust before the redirect occurs.
                </p>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-500">
                  <span className="text-emerald-500">GET</span> /q/Abc123XY/<span className="text-zinc-300 underline underline-offset-4 decoration-emerald-500/30">Invoice_2026.pdf</span>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="p-8 bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl space-y-6">
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">Technical Core</div>
              <h3 className="text-lg font-semibold text-white tracking-tight leading-snug">Engineered for Privacy.</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                QuickQR ensures your data stays masked until the correct credentials are provided. Perfect for enterprise media distribution.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                  Contact Support
                </Button>
              </div>
            </div>

            <div className="p-8 border border-zinc-900 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Powered By</h3>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Next.js 15</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">MongoDB</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Lucide Icons</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Closing */}
        <div className="mt-32 pt-20 border-t border-zinc-900 flex flex-col items-center space-y-8">
          <p className="text-zinc-500 text-sm text-center max-w-sm italic leading-relaxed">
            "We believe in clean data and secure matrices. Professional QR generation, simplified."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-zinc-800" />
            <span className="text-[9px] text-zinc-700 uppercase tracking-[0.4em] font-medium leading-none">
              &copy; 2026 QuickQR Engine
            </span>
            <div className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </div>

      </div>
    </div>
  )
}
