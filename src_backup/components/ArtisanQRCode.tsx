"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function ArtisanQRCode({ artisanId }: { artisanId: string }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/artisan/${artisanId}`;

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `artisan_qr_${artisanId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="bg-[#6f5c46] p-6 rounded-2xl shadow-lg border border-[#c65d51]/20 text-white group flex flex-col justify-between" ref={qrRef}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Share Shop</h2>
          <span className="bg-[#c65d51] text-xs px-2 py-1 rounded-full text-white">QR Code</span>
        </div>
        <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-inner">
          <QRCodeCanvas
            value={publicUrl}
            size={120}
            bgColor={"#ffffff"}
            fgColor={"#6f5c46"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="text-gray-300 text-xs mb-4">Artisans can print this QR code to display at physical markets.</p>
      </div>
      <button
        onClick={downloadQR}
        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 rounded-lg transition-all font-bold text-sm"
      >
        Download PNG
      </button>
    </div>
  );
}
