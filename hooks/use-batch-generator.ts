import { useState } from "react"
import { toast } from "sonner"
import JSZip from "jszip"

export function useBatchGenerator(
  expiration: string, 
  usePassword: boolean, 
  password: string, 
  logoFile: string | null, 
  dotStyle: string, 
  qrColor1: string, 
  qrColor2: string
) {
  const [batchItems, setBatchItems] = useState([{ id: "1", url: "", type: "QuickQR" }])
  const [isBatching, setIsBatching] = useState(false)

  const addBatchItem = () => {
    setBatchItems([...batchItems, { id: Math.random().toString(), url: "", type: "QuickQR" }])
  }

  const removeBatchItem = (id: string) => {
    if (batchItems.length > 1) {
      setBatchItems(batchItems.filter(item => item.id !== id))
    } else {
      setBatchItems([{ id: Math.random().toString(), url: "", type: "QuickQR" }])
    }
  }

  const updateBatchItem = (id: string, field: "url" | "type", value: string) => {
    setBatchItems(batchItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleBatchGenerate = async () => {
    const activeItems = batchItems.filter(item => item.url.trim().length > 0)
    if (activeItems.length === 0) {
      toast.error("Please provide at least one URL");
      return;
    }

    setIsBatching(true)
    const zip = new JSZip()
    const toastId = "batch-gen"
    toast.loading(`Processing 0/${activeItems.length} items...`, { id: toastId })

    try {
      const { default: QRCodeStyling } = await import("qr-code-styling")

      for (let i = 0; i < activeItems.length; i++) {
        const item = activeItems[i]
        toast.loading(`Processing ${i + 1}/${activeItems.length}: ${item.url.slice(0, 20)}...`, { id: toastId })

        const res = await fetch("/api/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            url: item.url, 
            type: "url",
            expirationDuration: expiration || undefined,
            password: usePassword && password ? password : undefined
          })
        })
        const data = await res.json()
        
        if (data.success) {
          const finalUrl = `${window.location.origin}/q/${data.data.shortId}`
          
          const qr = new QRCodeStyling({
            width: 800,
            height: 800,
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
            backgroundOptions: { color: "#000000" },
            imageOptions: { 
              crossOrigin: "anonymous", 
              margin: 20, 
              imageSize: 0.4,
              hideBackgroundDots: true
            },
            cornersSquareOptions: { type: (dotStyle === "square" ? "square" : "extra-rounded") as any, color: qrColor1 },
            cornersDotOptions: { type: (dotStyle === "square" ? "square" : "dot") as any, color: qrColor2 }
          })

          const blob = await qr.getRawData("png")
          if (blob) {
            const fileName = `${item.type}_${i+1}_${data.data.shortId}.png`
            zip.file(fileName, blob)
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = `QuickQR_Batch_${Date.now()}.zip`
      link.click()
      
      toast.success(`Batch complete! Generated ${activeItems.length} QR codes.`, { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error("Batch processing failed.", { id: toastId })
    } finally {
      setIsBatching(false)
    }
  }

  return {
    batchItems,
    isBatching,
    addBatchItem,
    removeBatchItem,
    updateBatchItem,
    handleBatchGenerate
  }
}
