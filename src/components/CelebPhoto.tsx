"use client";

import { useState, useEffect } from "react";

interface CelebPhotoProps {
  name: string;
  nameKo: string;
  size?: number;
  /** CSS 클래스로 크기 제어 시 사용 (size 무시됨) */
  className?: string;
}

export default function CelebPhoto({ name, nameKo, size = 80, className }: CelebPhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPhoto() {
      try {
        const slug = name.replace(/ /g, "_");
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`
        );
        if (!res.ok) throw new Error("not found");
        const data: { thumbnail?: { source: string } } = await res.json();
        if (!cancelled && data.thumbnail?.source) {
          // 더 큰 썸네일 요청 (기본 ~320px → 280px로 확대)
          const larger = data.thumbnail.source.replace(/\/(\d+)px-/, "/280px-");
          setPhotoUrl(larger);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    fetchPhoto();
    return () => { cancelled = true; };
  }, [name]);

  const sizeStyle = className ? {} : { width: size, height: size };

  if (!photoUrl || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-bold text-primary ${className || ""}`}
        style={sizeStyle}
      >
        {nameKo.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={nameKo}
      className={`rounded-xl object-cover object-top ${className || ""}`}
      style={sizeStyle}
      onError={() => setFailed(true)}
    />
  );
}
