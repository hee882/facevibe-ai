"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import CelebPhoto from "@/components/CelebPhoto";
import RadarChart from "@/components/RadarChart";

interface CelebrityMatch {
  name: string;
  nameKo: string;
  description: string;
  region: string;
  gender: string;
  similarity: number;
  matchReason?: string;
  matchCount?: number;
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
  surpriseMatch?: CelebrityMatch | null;
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

const REGION_FLAGS: Record<string, string> = {
  korea: "\u{1F1F0}\u{1F1F7}",
  japan: "\u{1F1EF}\u{1F1F5}",
  china: "\u{1F1E8}\u{1F1F3}",
  southeast_asia: "\u{1F30F}",
  north_america: "\u{1F1FA}\u{1F1F8}",
  europe: "\u{1F1EA}\u{1F1FA}",
  latin_america: "\u{1F30E}",
};

const MEDAL_COLORS = [
  "from-amber-400 to-yellow-500",
  "from-gray-300 to-gray-400",
  "from-amber-600 to-amber-700",
];

const RADAR_LABELS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: "eyeSpacing", label: "눈 간격" },
  { key: "noseToLipRatio", label: "코-입" },
  { key: "lipToChinRatio", label: "입-턱" },
  { key: "symmetry", label: "대칭" },
  { key: "faceThirds", label: "비율" },
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

function formatMatchCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return String(count);
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;

    // 1) sessionStorage 먼저 확인 (원래 유저는 즉시 로드)
    const stored = getStoredResult(id);
    if (stored) {
      setData(stored);
      setLoading(false);
      return;
    }

    // 2) D1 API fallback (공유 링크 수신자)
    fetch(`/api/result/${id}`)
      .then((r) => (r.ok ? (r.json() as Promise<AnalysisData>) : null))
      .then((d) => {
        if (d) setData(d);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-5">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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

  const { score, scoreBreakdown, celebrityMatches, surpriseMatch, faceType } =
    data;

  const radarData = RADAR_LABELS.map(({ key, label }) => ({
    label,
    value: scoreBreakdown[key] as number,
  }));

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

        {/* 얼굴 스탯 레이더 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-black/5"
        >
          <h2 className="mb-2 text-base font-semibold text-foreground">
            나의 얼굴 스탯
          </h2>
          <p className="mb-4 text-xs text-foreground/40">
            황금비율 기준 6가지 지표 분석
          </p>
          <RadarChart data={radarData} />
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
              <motion.div
                key={celeb.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.15 }}
                className="relative flex items-center gap-4 rounded-2xl bg-surface p-4"
              >
                {/* 순위 배지 */}
                <div
                  className={`absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-md ${MEDAL_COLORS[i]}`}
                >
                  {i + 1}
                </div>
                {/* 사진 + 국기 */}
                <div className="relative shrink-0">
                  <CelebPhoto
                    name={celeb.name}
                    nameKo={celeb.nameKo}
                    size={88}
                  />
                  <span className="absolute -bottom-1 -right-1 text-lg drop-shadow">
                    {REGION_FLAGS[celeb.region] || "\u{1F30D}"}
                  </span>
                </div>
                {/* 이름 + 매칭 이유 */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm font-bold leading-tight text-foreground">
                    {celeb.nameKo}
                  </p>
                  <p className="mt-0.5 truncate text-xs leading-tight text-foreground/40">
                    {celeb.name}
                  </p>
                  {celeb.description && (
                    <p className="mt-1 w-fit rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary/70">
                      {celeb.description}
                    </p>
                  )}
                  {/* 매칭 이유 */}
                  {celeb.matchReason && (
                    <p className="mt-1.5 text-xs text-accent">
                      {celeb.matchReason}
                    </p>
                  )}
                  {/* 매칭 카운터 */}
                  {celeb.matchCount && celeb.matchCount > 1 && (
                    <p className="mt-1 text-[11px] text-foreground/35">
                      {formatMatchCount(celeb.matchCount)}명이 이 셀럽과 매칭!
                    </p>
                  )}
                </div>
                {/* 유사도 */}
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-primary">
                    {celeb.similarity}%
                  </p>
                  <p className="text-[10px] text-foreground/40">유사도</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 의외의 닮은꼴! (서프라이즈 매칭) */}
        {surpriseMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 shadow-lg shadow-black/5"
          >
            <div className="px-6 pt-5 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">&#x1F3B2;</span>
                <h2 className="text-base font-semibold text-foreground">
                  의외의 닮은꼴!
                </h2>
              </div>
              <p className="mt-1 text-xs text-foreground/40">
                전혀 다른 지역에서 발견된 숨겨진 매칭
              </p>
            </div>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="relative shrink-0">
                <CelebPhoto
                  name={surpriseMatch.name}
                  nameKo={surpriseMatch.nameKo}
                  size={80}
                />
                <span className="absolute -bottom-1 -right-1 text-lg drop-shadow">
                  {REGION_FLAGS[surpriseMatch.region] || "\u{1F30D}"}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-sm font-bold text-foreground">
                  {surpriseMatch.nameKo}
                </p>
                <p className="mt-0.5 truncate text-xs text-foreground/40">
                  {surpriseMatch.name}
                </p>
                {surpriseMatch.description && (
                  <p className="mt-1 w-fit rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                    {surpriseMatch.description}
                  </p>
                )}
                {surpriseMatch.matchReason && (
                  <p className="mt-1.5 text-xs text-accent">
                    {surpriseMatch.matchReason}
                  </p>
                )}
                {surpriseMatch.matchCount && surpriseMatch.matchCount > 1 && (
                  <p className="mt-1 text-[11px] text-foreground/35">
                    {formatMatchCount(surpriseMatch.matchCount)}명이 이 셀럽과
                    매칭!
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-accent">
                  {surpriseMatch.similarity}%
                </p>
                <p className="text-[10px] text-foreground/40">유사도</p>
              </div>
            </div>
          </motion.div>
        )}

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

        {/* 안전 안내 배너 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <p className="text-xs text-emerald-600">
            사진은 분석 즉시 삭제되며, 서버에 저장되지 않습니다
          </p>
        </motion.div>

        {/* 광고 */}
        <AdBanner slot="result-bottom" className="w-full" />

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

      {/* Footer */}
      <Footer />
    </div>
  );
}
