"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import ShareButtons from "@/components/ShareButtons";

interface CelebrityMatch {
  name: string;
  nameKo: string;
  gender: string;
  similarity: number;
}

interface FaceType {
  shape: string;
  nameKo: string;
  description: string;
}

interface ScoreBreakdown {
  total: number;
  eyeSpacing: number;
  noseToLipRatio: number;
  lipToChinRatio: number;
  symmetry: number;
  faceThirds: number;
  mouthWidth: number;
  comment: string;
}

interface AnalysisData {
  id: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  celebrityMatches: CelebrityMatch[];
  faceType: FaceType;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-amber-500";
  return "text-rose-400";
}

function getScoreGradient(score: number): string {
  if (score >= 80) return "from-emerald-400 to-teal-500";
  if (score >= 60) return "from-primary to-accent";
  if (score >= 40) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-pink-500";
}

const SCORE_LABELS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: "eyeSpacing", label: "눈 간격" },
  { key: "noseToLipRatio", label: "코-입 비율" },
  { key: "lipToChinRatio", label: "입-턱 비율" },
  { key: "symmetry", label: "좌우 대칭" },
  { key: "faceThirds", label: "얼굴 비율" },
  { key: "mouthWidth", label: "입 너비" },
];

function getStoredResult(id: string): AnalysisData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(`result_${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const data = useMemo(
    () => getStoredResult(params.id as string),
    [params.id]
  );

  if (!data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-5">
        <p className="text-lg text-foreground/60">결과를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-xl bg-primary px-6 py-3 text-white"
        >
          다시 분석하기
        </button>
      </div>
    );
  }

  const { score, scoreBreakdown, celebrityMatches, faceType } = data;

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background">
      <main className="flex w-full max-w-lg flex-col items-center gap-6 px-5 py-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FaceVibe
            </span>{" "}
            분석 결과
          </h1>
        </motion.div>

        {/* 점수 카드 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full rounded-2xl bg-white p-8 text-center shadow-lg shadow-black/5"
        >
          <p className="text-sm font-medium text-foreground/50">매력 점수</p>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <CountUp
              end={score}
              className={`text-7xl font-bold ${getScoreColor(score)}`}
            />
            <span className="text-2xl font-medium text-foreground/30">
              / 100
            </span>
          </div>
          <div className="mx-auto mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${score}%` }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)}`}
            />
          </div>
          <p className="mt-4 text-base text-foreground/70">
            {scoreBreakdown.comment}
          </p>
        </motion.div>

        {/* 세부 점수 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-black/5"
        >
          <h2 className="mb-4 text-base font-semibold text-foreground">
            세부 분석
          </h2>
          <div className="flex flex-col gap-3">
            {SCORE_LABELS.map(({ key, label }) => {
              const value = scoreBreakdown[key] as number;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-foreground/60">
                    {label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${value}%` }}
                      transition={{
                        delay: 0.6,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium text-foreground/70">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 닮은 셀럽 Top 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-black/5"
        >
          <h2 className="mb-4 text-base font-semibold text-foreground">
            닮은 셀럽 Top 3
          </h2>
          <div className="flex flex-col gap-3">
            {celebrityMatches.map((celeb, i) => (
              <div
                key={celeb.name}
                className="flex items-center gap-4 rounded-xl bg-surface p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-400 to-amber-500"
                      : i === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-400"
                        : "bg-gradient-to-br from-amber-600 to-amber-700"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {celeb.nameKo}
                  </p>
                  <p className="text-xs text-foreground/50">{celeb.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {celeb.similarity}%
                  </p>
                  <p className="text-xs text-foreground/40">유사도</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 얼굴형 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-black/5"
        >
          <h2 className="mb-3 text-base font-semibold text-foreground">
            얼굴형 분석
          </h2>
          <div className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-5">
            <p className="text-2xl font-bold text-primary">
              {faceType.nameKo}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground/40">
              {faceType.shape}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              {faceType.description}
            </p>
          </div>
        </motion.div>

        {/* 공유 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-black/5"
        >
          <ShareButtons
            score={score}
            celebName={celebrityMatches[0]?.nameKo || ""}
            faceType={faceType.nameKo}
            resultId={data.id}
          />
        </motion.div>

        {/* 다시 하기 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full pt-2 pb-8"
        >
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
          >
            다시 분석하기
          </button>
        </motion.div>
      </main>
    </div>
  );
}
