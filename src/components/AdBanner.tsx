"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense 스크립트 미로드 시 무시
    }
  }, []);

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
