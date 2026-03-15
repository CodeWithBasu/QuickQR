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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* System Overview */}
            <section id="overview" className="space-y-8 relative">
              <div className="absolute -left-6 top-1.5 w-1.5 h-12 bg-emerald-500 rounded-r-full hidden md:block" />
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-sm font-mono tracking-widest uppercase mb-1 hidden sm:inline-block">Core</span>
                  System Architecture
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  QuickQR functions as a dynamic routing layer between your data and the end-user. 
                  Unlike traditional QR codes that hardcode static URLs, our engine generates unique 
                  identifiers that act as pointers to rich, controllable database records.
                </p>
              </div>

              {/* Architecture Diagram Visualization */}
              <div className="relative h-64 w-full bg-zinc-950/50 border border-zinc-800/80 rounded-3xl overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                <div className="flex items-center justify-between w-full max-w-lg px-8 relative z-10">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:-translate-y-2 transition-transform duration-500">
                      <Zap className="w-6 h-6 text-zinc-300" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Generate</span>
                  </div>

                  {/* Connect Line */}
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-zinc-800 via-emerald-500/50 to-zinc-800 relative">
                     <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.1)] relative group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_4s_linear_infinite]" />
                      <Database className="w-7 h-7 text-emerald-500" />
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold font-mono tracking-widest uppercase">MongoDB Store</span>
                  </div>

                  {/* Connect Line */}
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-zinc-800 via-emerald-500/50 to-zinc-800 relative">
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:translate-x-2 transition-transform duration-500">
                      <Server className="w-6 h-6 text-zinc-300" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Edge Route</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-8 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors border border-zinc-800/80 rounded-3xl space-y-4">
                  <Database className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-base font-bold text-white tracking-wide uppercase">High-Speed Persistence</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Every generated matrix is registered in our NoSQL structure, enabling rapid read/write operations for dynamic tracking and live metric updates.
                  </p>
                </div>
                <div className="p-8 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors border border-zinc-800/80 rounded-3xl space-y-4">
                  <Server className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-base font-bold text-white tracking-wide uppercase">Next.js Edge Middleware</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Routing is handled securely at the edge. Incoming scans are intercepted to validate access tokens and protocol compliance prior to redirect.
                  </p>
                </div>
              </div>
            </section>

            {/* Defense Mechanisms */}
            <section id="security" className="space-y-10 relative">
              <div className="absolute -left-6 top-1.5 w-1.5 h-12 bg-emerald-500 rounded-r-full hidden md:block" />
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-sm font-mono tracking-widest uppercase mb-1 hidden sm:inline-block">Security</span>
                  Defense Mechanisms
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  When distributing sensitive documents or private enterprise media, default URLs expose your resources. 
                  QuickQR wraps your destination in layers of protection.
                </p>
              </div>

              <div className="grid gap-6">
                
                {/* Shield Protocol Feature Block */}
                <div className="relative overflow-hidden p-8 md:p-10 bg-gradient-to-br from-zinc-900/80 to-black border border-zinc-800 rounded-[2.5rem] group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700" />
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                      <Shield className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">Shield Protocol <span className="text-zinc-600 font-normal">/</span> PIN Encrypted Gateway</h3>
                        <p className="text-emerald-500/80 text-[11px] font-mono uppercase tracking-[0.3em]">Advanced Protection</p>
                      </div>
                      <p className="text-zinc-400 text-base leading-relaxed">
                        Rather than directly exposing the target URL, the engine halts the connection at an intermediary 
                        `<span className="text-zinc-200">/unlock/[id]</span>` route. The true destination URL remains securely 
                        hidden on the server-side until the client provides a correct mathematical match for the 4-digit PIN hash.
                      </p>
                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 pt-2">
                        <Lock className="w-4 h-4 text-emerald-500/50" />
                        <span>Max 5 attempt limit before temporary cooldown.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expiration Control Feature Block */}
                <div className="relative overflow-hidden p-8 md:p-10 bg-gradient-to-br from-zinc-900/80 to-black border border-zinc-800 rounded-[2.5rem] group">
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Zap className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">Time-To-Live (TTL) Control</h3>
                        <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-[0.3em]">Automated Expiration</p>
                      </div>
                      <p className="text-zinc-400 text-base leading-relaxed">
                        Attach precise expiration windows (1H, 1D, 7D, 30D) to your generated matrices. 
                        Our database utilizes automated TTL indexes to instantly invalidate records 
                        the millisecond they expire, preventing unauthorized access to stale campaigns or sensitive temporary documents.
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
            </section>

            {/* Smart Context */}
            <section id="context" className="space-y-8 relative">
              <div className="absolute -left-6 top-1.5 w-1.5 h-12 bg-emerald-500 rounded-r-full hidden md:block" />
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-sm font-mono tracking-widest uppercase mb-1 hidden sm:inline-block">UX</span>
                  Contextual Routing
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  Trust is critical. When a user scans an obscure shortlink like `/q/A8Hj23`, they hesitate. 
                  Our engine solves this through intelligent URL appending.
                </p>
              </div>

              <div className="p-10 bg-zinc-950/60 border border-zinc-800 rounded-[2.5rem] space-y-6">
                <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
                  By dynamically attaching the original uploaded file's exact name to the end of the shortlink, 
                  modern smartphone cameras preview the <span className="text-white font-medium">actual filename</span> to the user before they even click to open the browser.
                </p>
                
                {/* Code UI Block */}
                <div className="bg-[#0c0c0c] p-6 rounded-2xl border border-zinc-900 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="flex items-center gap-2 mb-4 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  
                  <div className="font-mono text-sm space-y-3">
                    <div className="text-zinc-500">
                      <span className="text-zinc-600">// Standard Shortlink Preview (Low Trust)</span><br/>
                      <span className="text-blue-400">GET</span> https://quickqr.app/q/A8Hj23
                    </div>
                    
                    <div className="text-zinc-300">
                      <span className="text-zinc-600">// QuickQR Contextual Preview (High Trust)</span><br/>
                      <span className="text-emerald-400">GET</span> https://quickqr.app/q/A8Hj23/<span className="text-white bg-white/10 px-1 rounded">Q4_Financial_Report.pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8 relative">
            <div className="sticky top-12 space-y-8">
              
              {/* Directory Navigation */}
              <div className="p-8 bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-3xl space-y-6">
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-4">Documentation Directory</div>
                
                <ul className="space-y-4">
                  <li>
                    <a href="#overview" className="flex items-center gap-3 text-sm font-medium text-zinc-300 hover:text-white group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                        <Cpu className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                      System Architecture
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="flex items-center gap-3 text-sm font-medium text-zinc-300 hover:text-white group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                        <Lock className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      Defense Mechanisms
                    </a>
                  </li>
                  <li>
                    <a href="#context" className="flex items-center gap-3 text-sm font-medium text-zinc-300 hover:text-white group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                      Contextual Routing
                    </a>
                  </li>
                </ul>

                <div className="pt-6 mt-6 border-t border-zinc-800/50">
                  <h3 className="text-lg font-semibold text-white tracking-tight leading-snug mb-2">Need Technical Help?</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                    Our engineering team is available for custom enterprise deployments.
                  </p>
                  <Button className="w-full h-12 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Tech Stack Box */}
              <div className="p-8 border border-zinc-900 bg-zinc-950/50 rounded-3xl space-y-5 shadow-inner">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Core Technologies</h3>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <span className="text-xs text-zinc-300 font-medium">Next.js 15 App Router</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <span className="text-xs text-zinc-300 font-medium">MongoDB Native Provider</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-xs text-zinc-300 font-medium">UploadThing SDK</span>
                  </div>
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
