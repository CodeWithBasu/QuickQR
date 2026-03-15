"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import type { DotType, CornerSquareType, GradientType, CornerDotType } from "qr-code-styling";

export interface QRCodeRef {
  download: () => void;
}

const AdvancedQRCode = forwardRef<QRCodeRef, {
  data: string;
  color1: string;
  color2: string;
  dotStyle: string;
  logoFile: string | null;
}>(({ data, color1, color2, dotStyle, logoFile }, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    download: () => {
      if (qrCodeInstance.current) {
        qrCodeInstance.current.download({ name: "quickqr", extension: "png" });
      }
    }
  }));

  useEffect(() => {
    let mounted = true;
    import("qr-code-styling").then((QRCodeStylingModule) => {
      const QRCodeStyling = QRCodeStylingModule.default;
      if (!mounted) return;

      const options = {
        width: 250,
        height: 250,
        data: data || window.location.origin,
        image: logoFile || undefined,
        dotsOptions: {
          type: dotStyle as DotType,
          gradient: {
            type: "linear" as GradientType,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: color1 },
              { offset: 1, color: color2 }
            ]
          }
        },
        backgroundOptions: {
          color: "transparent",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10,
          imageSize: 0.4,
          hideBackgroundDots: true,
        },
        cornersSquareOptions: {
          type: (dotStyle === "square" ? "square" : "extra-rounded") as CornerSquareType,
          color: color1,
        },
        cornersDotOptions: {
          type: (dotStyle === "square" ? "square" : "dot") as CornerDotType,
          color: color2,
        }
      };

      if (!qrCodeInstance.current) {
        qrCodeInstance.current = new QRCodeStyling(options);
        if (wrapperRef.current) {
          qrCodeInstance.current.append(wrapperRef.current);
        }
      } else {
        qrCodeInstance.current.update(options);
      }
    });

    return () => {
      mounted = false;
    };
  }, [data, color1, color2, dotStyle, logoFile]);

  return <div ref={wrapperRef} className="flex items-center justify-center p-2" />;
});

AdvancedQRCode.displayName = "AdvancedQRCode";
export default AdvancedQRCode;
