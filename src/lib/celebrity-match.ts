/**
 * 셀럽 닮은꼴 매칭
 * 유클리드 거리 기반 유사도 비교 → Top 3 반환
 */

import type { FaceRatios } from "./scoring";
import { celebrities, type Celebrity } from "@/data/celebrities";

export interface CelebrityMatch {
  name: string;
  nameKo: string;
  gender: string;
  similarity: number; // 0~100
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

/** 유클리드 거리 → 유사도 변환 (0~100) */
function euclideanSimilarity(a: number[], b: number[]): number {
  let sumSq = 0;
  for (let i = 0; i < a.length; i++) {
    sumSq += (a[i] - b[i]) ** 2;
  }
  const distance = Math.sqrt(sumSq);
  // distance가 0이면 100, distance가 0.5 이상이면 0에 수렴
  return Math.max(0, Math.min(100, Math.round(100 * (1 - distance / 0.5))));
}

/** 사용자 얼굴 비율과 가장 유사한 셀럽 Top 3 반환 */
export function matchCelebrities(
  userRatios: FaceRatios,
  topN: number = 3
): CelebrityMatch[] {
  const userVector = ratiosToVector(userRatios);

  const scored: (Celebrity & { similarity: number })[] = celebrities.map(
    (celeb) => ({
      ...celeb,
      similarity: euclideanSimilarity(userVector, ratiosToVector(celeb.ratios)),
    })
  );

  scored.sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, topN).map(({ name, nameKo, gender, similarity }) => ({
    name,
    nameKo,
    gender,
    similarity,
  }));
}
