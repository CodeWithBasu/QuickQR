import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import QRCode from "@/models/QRCode";
import { Download, Instagram, Github, Linkedin, ExternalLink, ShieldCheck, FileText, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function FileViewer({
  params,
  searchParams,
}: {
  params: Promise<{ shortId: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { shortId } = await params;
  const { code } = await searchParams;

  await dbConnect();
  const qrData = await QRCode.findOne({ shortId });

  if (!qrData) {
    redirect("/?error=notfound");
  }

  // If password protected, verify the PIN from searchParams
  if (qrData.password) {
    if (!code || code !== qrData.password) {
      redirect(`/unlock/${shortId}`);
    }
  }

  const destination = qrData.url.startsWith("http") ? qrData.url : `https://${qrData.url}`;
  
  const getIcon = () => {
    switch(qrData.type) {
      case "doc": return <FileText className="w-12 h-12 text-emerald-500" />;
      case "video": return <Video className="w-12 h-12 text-blue-500" />;
      case "audio": return <Music className="w-12 h-12 text-pink-500" />;
      default: return <ExternalLink className="w-12 h-12 text-zinc-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-[32px] p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-inner">
            {getIcon()}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Your file is ready</h1>
            <p className="text-zinc-500 text-sm">Securely hosted and scanned via QuickQR</p>
          </div>

          <div className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">File Name</span>
              <span className="text-sm font-medium truncate max-w-[200px]">{qrData.filename || "Untitled Source"}</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>

          <a href={destination} className="w-full">
            <Button className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-lg flex items-center justify-center group">
              <Download className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
              Download Now
            </Button>
          </a>

          {/* Creator Profile Section */}
          {(qrData.instagram || qrData.github || qrData.linkedin) && (
            <div className="w-full pt-8 mt-4 border-t border-zinc-900 flex flex-col items-center space-y-4">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em]">Created By</span>
              <div className="flex items-center gap-6">
                {qrData.instagram && (
                  <a href={`https://instagram.com/${qrData.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-pink-500 transition-all hover:scale-110">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {qrData.github && (
                  <a href={`https://github.com/${qrData.github}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white transition-all hover:scale-110">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {qrData.linkedin && (
                  <a href={qrData.linkedin.startsWith('http') ? qrData.linkedin : `https://linkedin.com/in/${qrData.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-blue-500 transition-all hover:scale-110">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-zinc-600 text-xs font-medium tracking-wide flex items-center gap-2">
        <span className="w-8 h-[1px] bg-zinc-800" />
        Powering the Next QR Era
        <span className="w-8 h-[1px] bg-zinc-800" />
      </div>
    </div>
  );
}
