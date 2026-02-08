"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "@/components/UploadZone";
import AnalyzingScreen from "@/components/AnalyzingScreen";
import Footer from "@/components/Footer";

type Stage = "idle" | "uploaded" | "analyzing";

const SAFETY_BADGES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "사진 즉시 폐기",
    desc: "분석 후 서버에서 완전 삭제",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "로그인 불필요",
    desc: "개인정보 수집 없음",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ),
    title: "안면인식 없음",
    desc: "비율 분석만 수행",
  },
];

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setStage("uploaded");
    setErrorMsg(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setStage("analyzing");
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data: {
        error?: string;
        id?: string;
        score?: number;
        [key: string]: unknown;
      } = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "분석 중 오류가 발생했습니다.");
        setStage("uploaded");
        return;
      }

      // sessionStorage에 결과 저장 후 결과 페이지로 이동
      const resultId = data.id as string;
      sessionStorage.setItem(`result_${resultId}`, JSON.stringify(data));

      // searchParams에 메타태그용 데이터 포함
      const matches = data.celebrityMatches as { nameKo: string }[];
      const ft = data.faceType as { nameKo: string };
      const sp = new URLSearchParams({
        score: String(data.score),
        celeb: matches?.[0]?.nameKo || "",
        type: ft?.nameKo || "",
      });
      router.push(`/result/${resultId}?${sp.toString()}`);
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      setStage("uploaded");
    }
  }, [selectedFile, router]);

  // 분석 중일 때 전체 화면 전환
  if (stage === "analyzing") {
    return <AnalyzingScreen />;
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background">
      {/* Hero */}
      <main className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-8 px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FaceVibe
            </span>{" "}
            AI
          </h1>
          <p className="text-lg text-foreground/70 sm:text-xl">
            AI가 분석하는 나의 얼굴 매력 점수
          </p>
          <p className="text-sm text-foreground/50">
            나는 누구랑 닮았을까? 지금 바로 확인해보세요
          </p>
        </motion.div>

        {/* Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <UploadZone onFileSelect={handleFileSelect} />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-red-500"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <AnimatePresence>
          {stage === "uploaded" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              className="w-full max-w-md rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            >
              매력 분석 시작하기
            </motion.button>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 grid w-full max-w-md grid-cols-3 gap-4 text-center"
        >
          {[
            { label: "매력 점수", desc: "0~100점" },
            { label: "닮은 셀럽", desc: "Top 3 + 서프라이즈" },
            { label: "얼굴형 분석", desc: "5가지 유형" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-surface p-4">
              <p className="text-sm font-semibold text-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-foreground/50">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* 안전 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full max-w-md rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              안심하고 분석하세요
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {SAFETY_BADGES.map((badge) => (
              <div key={badge.title} className="flex items-start gap-3">
                <div className="mt-0.5 text-emerald-600">{badge.icon}</div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    {badge.title}
                  </p>
                  <p className="text-xs text-emerald-600/70">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-emerald-600/50">
            업로드된 사진은 AI 분석 즉시 메모리에서 완전히 삭제됩니다.
            서버, 데이터베이스, 어디에도 저장되지 않습니다.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
