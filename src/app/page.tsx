"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "@/components/UploadZone";
import AnalyzingScreen from "@/components/AnalyzingScreen";

type Stage = "idle" | "uploaded" | "analyzing";

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
          <p className="text-sm text-foreground/40">
            사진은 저장되지 않아요 · 로그인 불필요
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
            { label: "닮은 셀럽", desc: "Top 3" },
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
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-foreground/30">
        <p>FaceVibe AI · 사진은 분석 후 즉시 삭제됩니다</p>
      </footer>
    </div>
  );
}
