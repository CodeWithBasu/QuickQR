"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UnlockPage({ params }: { params: Promise<{ shortId: string }> }) {
  const router = useRouter();
  const { shortId } = use(params);
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUnlock = async () => {
    if (pin.length < 4) return;
    
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/qr/${shortId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        toast.success("Access Granted. Redirecting...", { icon: "🔓" });
        
        // If it's a file type, go to the viewer instead of direct download
        if (["doc", "video", "audio"].includes(data.type)) {
          router.push(`/viewer/${shortId}`);
        } else {
          window.location.href = data.url;
        }
      } else {
        toast.error(data.error || "Invalid PIN. Access Denied.");
        setPin("");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-zinc-100 font-sans selection:bg-emerald-500/20 overflow-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern
          width={40}
          height={40}
          cx={1}
          cy={1}
          cr={1.5}
          glow={true}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] fill-zinc-500/30 opacity-100 h-screen w-screen"
          )}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
          {/* Cyberpunk Accents */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Lock Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:border-emerald-500/50 transition-colors duration-500">
                <Lock className={cn(
                  "w-8 h-8 transition-all duration-500",
                  isVerifying ? "text-emerald-500 animate-pulse" : "text-zinc-400 group-hover:text-emerald-400"
                )} />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white uppercase italic">
                Secure Terminal
              </h1>
              <p className="text-zinc-500 text-sm">
                This encrypted link is protected. Enter the 4-digit security PIN to proceed.
              </p>
            </div>

            {/* OTP Input */}
            <div className="py-4">
              <InputOTP 
                maxLength={4} 
                value={pin} 
                onChange={setPin}
                onComplete={handleUnlock}
                disabled={isVerifying}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot index={0} className="w-14 h-16 text-2xl border-zinc-800 bg-zinc-900/50 rounded-xl focus:ring-emerald-500/50 text-emerald-500" />
                  <InputOTPSlot index={1} className="w-14 h-16 text-2xl border-zinc-800 bg-zinc-900/50 rounded-xl focus:ring-emerald-500/50 text-emerald-500" />
                  <InputOTPSlot index={2} className="w-14 h-16 text-2xl border-zinc-800 bg-zinc-900/50 rounded-xl focus:ring-emerald-500/50 text-emerald-500" />
                  <InputOTPSlot index={3} className="w-14 h-16 text-2xl border-zinc-800 bg-zinc-900/50 rounded-xl focus:ring-emerald-500/50 text-emerald-500" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 transition-all font-semibold rounded-xl"
              disabled={pin.length < 4 || isVerifying}
              onClick={handleUnlock}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Decrypting...
                </>
              ) : (
                "Unlock Data"
              )}
            </Button>

            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
              <ShieldAlert className="w-3 h-3" />
              <span>Encrypted Redirection Layer 2.0</span>
            </div>
          </div>
        </div>

        {/* Home Button */}
        <div className="mt-8 text-center">
           <button 
             onClick={() => router.push("/")}
             className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors underline underline-offset-4"
           >
             Return to QuickQR Home
           </button>
        </div>
      </div>
    </div>
  );
}
