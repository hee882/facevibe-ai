"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonsProps {
  score: number;
  celebName: string;
  faceType: string;
  resultId: string;
}

function getShareUrl(resultId: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/result/${resultId}`;
}

function getShareText(score: number, celebName: string): string {
  return `나 ${celebName}이랑 닮았대! 매력 점수 ${score}점 🔥 넌 누구랑 닮았어? 궁금하면 해봐 →`;
}

export default function ShareButtons({
  score,
  celebName,
  faceType,
  resultId,
}: ShareButtonsProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const shareUrl = getShareUrl(resultId);
  const shareText = getShareText(score, celebName);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(`${shareText} ${shareUrl}`);
    showToast("링크가 복사되었어요!");
  };

  const handleKakao = async () => {
    if (typeof window !== "undefined" && window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나 ${celebName}이랑 닮았대! 매력 ${score}점`,
          description: `얼굴형: ${faceType} · 넌 누구랑 닮았어? 궁금하면 해봐!`,
          imageUrl: `${window.location.origin}/api/og?score=${score}&celeb=${encodeURIComponent(celebName)}&type=${encodeURIComponent(faceType)}`,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: "오? 나도 해볼래!",
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
      });
    } else {
      await copyToClipboard(`${shareText} ${shareUrl}`);
      showToast("링크가 복사되었어요! 카카오톡에 붙여넣기 해주세요");
    }
  };

  const handleLine = () => {
    const text = `${shareText} ${shareUrl}`;
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "width=550,height=520"
    );
  };

  const handleWhatsApp = () => {
    const text = `${shareText} ${shareUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleInstagram = async () => {
    await copyToClipboard(`${shareText} ${shareUrl}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      showToast("링크 복사 완료! 인스타그램 DM에 붙여넣기 해주세요");
      setTimeout(() => window.open("instagram://app", "_blank"), 500);
    } else {
      showToast("링크 복사 완료! 인스타그램 DM에 붙여넣기 해주세요");
    }
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          친구한테 자랑하기
        </p>
        <p className="mt-1 text-xs text-foreground/40">
          &ldquo;넌 누구랑 닮았어?&rdquo; 친구도 궁금할걸요
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {/* 카카오톡 */}
        <button
          onClick={handleKakao}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-md transition-transform hover:scale-105"
          aria-label="카카오톡으로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.8 5.108 4.512 6.45-.148.56-.543 2.03-.623 2.345-.098.39.143.384.3.28.124-.083 1.975-1.34 2.771-1.883.66.096 1.34.147 2.04.147 5.523 0 10-3.463 10-7.691S17.523 3 12 3" />
          </svg>
        </button>

        {/* LINE */}
        <button
          onClick={handleLine}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06C755] text-white shadow-md transition-transform hover:scale-105"
          aria-label="LINE으로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-105"
          aria-label="WhatsApp으로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>

        {/* 인스타그램 */}
        <button
          onClick={handleInstagram}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md transition-transform hover:scale-105"
          aria-label="인스타그램으로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </button>

        {/* 페이스북 */}
        <button
          onClick={handleFacebook}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition-transform hover:scale-105"
          aria-label="페이스북으로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* X (트위터) */}
        <button
          onClick={handleTwitter}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-md transition-transform hover:scale-105"
          aria-label="X(트위터)로 공유"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-foreground shadow-md transition-transform hover:scale-105"
          aria-label="링크 복사"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        </button>
      </div>

      {/* 안내 토스트 */}
      <AnimatePresence>
        {toastMsg && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-center text-sm font-medium text-emerald-500"
          >
            {toastMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}
