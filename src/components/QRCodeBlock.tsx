"use client";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function QRCodeBlock({ id }: { id: string }) {
  const [url, setUrl] = useState("");
  
  useEffect(() => {
    setUrl(`${window.location.origin}/dashboard/inventory/${id}`);
  }, [id]);

  if (!url) return <div className="w-32 h-32 bg-slate-800 animate-pulse rounded-xl" />;

  return (
    <div className="glass p-4 rounded-xl text-center bg-white shrink-0">
      <QRCodeSVG value={url} size={120} />
      <p className="text-xs text-slate-800 mt-2 font-bold uppercase tracking-wider">Scan to Manage</p>
    </div>
  );
}
