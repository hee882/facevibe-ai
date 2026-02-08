/**
 * 셀럽 닮은꼴 매칭
 * 유클리드 거리 기반 유사도 비교 → Top 3 + 서프라이즈 매칭
 */

import type { FaceRatios } from "./scoring";
import { celebrities, type Celebrity } from "@/data/celebrities";

export interface CelebrityMatch {
  name: string;
  nameKo: string;
  description: string;
  region: string;
  gender: string;
  similarity: number; // 0~100
  matchReason: string;
  matchCount?: number;
}

export interface MatchResult {
  topMatches: CelebrityMatch[];
  surpriseMatch: CelebrityMatch | null;
}

/** 비율 벡터를 배열로 변환 */
function ratiosToVector(ratios: FaceRatios): number[] {
  return [
    ratios.eyeSpacingRatio,
    ratios.noseLipRatio,
    ratios.lipChinRatio,
    ratios.mouthWidthRatio,
    ratios.faceHeightWidthRatio,
    ratios.eyebrowEyeRatio,
  ];
}

/**
 * 각 차원의 대표 범위 (정규화용)
 * 순서: eyeSpacing, noseLip, lipChin, mouthWidth, faceHeightWidth, eyebrowEye
 */
const DIMENSION_RANGES = [0.10, 0.04, 0.08, 0.10, 0.30, 0.03];

/** 각 차원별 매칭 코멘트 (랜덤 선택) */
const MATCH_REASONS = [
  ["눈매가 특히 닮았어요!", "눈 간격 비율이 거의 같아요!"],
  ["코에서 입까지 라인이 닮았어요!", "코-입 비율이 거의 같아요!"],
  ["턱선 비율이 매우 비슷해요!", "입-턱 라인이 닮았어요!"],
  ["입매가 특히 비슷해요!", "입 모양 비율이 닮았어요!"],
  ["얼굴 전체 비율이 거의 같아요!", "얼굴형이 닮았어요!"],
  ["눈썹-눈 라인이 비슷해요!", "눈썹 간격이 닮았어요!"],
];

/** 가장 유사한 차원을 찾아 매칭 이유 생성 */
function getMatchReason(userVec: number[], celebVec: number[]): string {
  let minDiff = Infinity;
  let bestDim = 0;
  for (let i = 0; i < userVec.length; i++) {
    const diff = Math.abs(userVec[i] - celebVec[i]) / DIMENSION_RANGES[i];
    if (diff < minDiff) {
      minDiff = diff;
      bestDim = i;
    }
  }
  const reasons = MATCH_REASONS[bestDim];
  // 결정적 선택 (SSR 안전): celebVec 첫 값 기반
  const idx = Math.abs(Math.round(celebVec[0] * 1000)) % reasons.length;
  return reasons[idx];
}

/** 정규화된 유클리드 거리 → 유사도 변환 (0~100) */
function euclideanSimilarity(a: number[], b: number[]): number {
  let sumSq = 0;
  for (let i = 0; i < a.length; i++) {
    const normalized = (a[i] - b[i]) / DIMENSION_RANGES[i];
    sumSq += normalized * normalized;
  }
  const distance = Math.sqrt(sumSq);
  // 제곱근 커브: 가까운 매칭에 관대하게, 먼 매칭은 자연스럽게 하락
  const maxDist = 3.0;
  const raw = Math.max(0, 1 - distance / maxDist);
  return Math.max(0, Math.min(100, Math.round(100 * Math.sqrt(raw))));
}

function toCelebrityMatch(
  celeb: Celebrity & { similarity: number; matchReason: string }
): CelebrityMatch {
  return {
    name: celeb.name,
    nameKo: celeb.nameKo,
    description: celeb.description,
    region: celeb.region,
    gender: celeb.gender,
    similarity: celeb.similarity,
    matchReason: celeb.matchReason,
  };
}

/** 사용자 얼굴 비율과 가장 유사한 셀럽 Top 3 + 서프라이즈 매칭 반환 */
export function matchCelebrities(
  userRatios: FaceRatios,
  topN: number = 3
): MatchResult {
  const userVector = ratiosToVector(userRatios);

  const scored = celebrities.map((celeb) => {
    const celebVector = ratiosToVector(celeb.ratios);
    return {
      ...celeb,
      similarity: euclideanSimilarity(userVector, celebVector),
      matchReason: getMatchReason(userVector, celebVector),
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);

  const topMatches = scored.slice(0, topN).map(toCelebrityMatch);

  // 서프라이즈: Top 3와 다른 지역에서 가장 유사한 셀럽
  const topRegions = new Set(topMatches.map((m) => m.region));
  const topNames = new Set(topMatches.map((m) => m.name));
  const surprise = scored.find(
    (s) => !topRegions.has(s.region) && !topNames.has(s.name)
  );
  const surpriseMatch = surprise ? toCelebrityMatch(surprise) : null;

  return { topMatches, surpriseMatch };
}
