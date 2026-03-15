import { useState } from "react"
import { toast } from "sonner"

export function useQRGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrValue, setQrValue] = useState("")

  const generateQRCode = async (url: string, type: string, fileName?: string, expiration?: string, usePassword?: boolean, password?: string) => {
    setIsGenerating(true)
    const toastId = "qr-gen"
    toast.loading("Registering QR link...", { id: toastId })

    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url, 
          type, 
          fileName,
          expirationDuration: expiration || undefined,
          password: usePassword && password ? password : undefined
        })
      })
      const data = await res.json()

      if (data.success) {
        const finalUrl = `${window.location.origin}/q/${data.data.shortId}`
        setQrValue(finalUrl)
        toast.success("QR Matrix Generated!", { id: toastId })
      } else {
        toast.error(`Error: ${data.error || "Generation failed"}`, { id: toastId })
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error. Check your connection.", { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    setIsGenerating,
    qrValue,
    setQrValue,
    generateQRCode
  }
}
