/**
 * 황금비율 기반 매력 점수 알고리즘
 * Azure Face API 27개 랜드마크를 활용하여 0~100점 산출
 */

import type { FaceLandmarks, FaceRectangle, Point } from "./azure-face";

/** 각 항목별 가중치 */
const WEIGHTS = {
  eyeSpacing: 0.2,
  noseToLipRatio: 0.15,
  lipToChinRatio: 0.15,
  symmetry: 0.25,
  faceThirds: 0.15,
  mouthWidth: 0.1,
};

export interface ScoreBreakdown {
  total: number;
  eyeSpacing: number;
  noseToLipRatio: number;
  lipToChinRatio: number;
  symmetry: number;
  faceThirds: number;
  mouthWidth: number;
  comment: string;
}

/** 얼굴 비율 벡터 (셀럽 매칭용으로도 사용) */
export interface FaceRatios {
  eyeSpacingRatio: number;
  noseLipRatio: number;
  lipChinRatio: number;
  mouthWidthRatio: number;
  faceHeightWidthRatio: number;
  eyebrowEyeRatio: number;
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** 이상적 비율과의 차이를 0~100 점수로 변환 */
function ratioScore(actual: number, ideal: number): number {
  const diff = Math.abs(actual - ideal) / ideal;
  // diff가 0이면 100점, diff가 0.5 이상이면 0점에 수렴
  return Math.max(0, Math.min(100, 100 * (1 - diff * 2)));
}

/** 좌우 대칭도 계산 (0~100) */
function symmetryScore(landmarks: FaceLandmarks): number {
  // 얼굴 중심선: 코 끝 기준
  const centerX = landmarks.noseTip.x;

  const pairs: [Point, Point][] = [
    [landmarks.eyeLeftOuter, landmarks.eyeRightOuter],
    [landmarks.eyeLeftInner, landmarks.eyeRightInner],
    [landmarks.eyebrowLeftOuter, landmarks.eyebrowRightOuter],
    [landmarks.eyebrowLeftInner, landmarks.eyebrowRightInner],
    [landmarks.mouthLeft, landmarks.mouthRight],
    [landmarks.noseLeftAlarOutTip, landmarks.noseRightAlarOutTip],
  ];

  let totalDiff = 0;
  for (const [left, right] of pairs) {
    const leftDist = Math.abs(left.x - centerX);
    const rightDist = Math.abs(right.x - centerX);
    const avg = (leftDist + rightDist) / 2;
    if (avg > 0) {
      totalDiff += Math.abs(leftDist - rightDist) / avg;
    }
  }

  const avgDiff = totalDiff / pairs.length;
  // avgDiff 0이면 100점, 0.5 이상이면 0점 (헤드포즈 고려하여 관대하게)
  return Math.max(0, Math.min(100, 100 * (1 - avgDiff * 1.5)));
}

/** 얼굴 비율 벡터 추출 */
export function extractFaceRatios(
  landmarks: FaceLandmarks,
  rect: FaceRectangle
): FaceRatios {
  const faceWidth = rect.width;
  const faceHeight = rect.height;

  const eyeDistance = dist(landmarks.pupilLeft, landmarks.pupilRight);
  const noseToLip = dist(landmarks.noseTip, landmarks.upperLipTop);
  const lipToChin = faceHeight - (landmarks.underLipBottom.y - rect.top);
  const mouthWidth = dist(landmarks.mouthLeft, landmarks.mouthRight);

  const eyebrowMidLeft = midpoint(
    landmarks.eyebrowLeftOuter,
    landmarks.eyebrowLeftInner
  );
  const eyeMidLeft = midpoint(landmarks.eyeLeftOuter, landmarks.eyeLeftInner);
  const eyebrowEyeDist = dist(eyebrowMidLeft, eyeMidLeft);

  return {
    eyeSpacingRatio: eyeDistance / faceWidth,
    noseLipRatio: noseToLip / faceHeight,
    lipChinRatio: lipToChin / faceHeight,
    mouthWidthRatio: mouthWidth / faceWidth,
    faceHeightWidthRatio: faceHeight / faceWidth,
    eyebrowEyeRatio: eyebrowEyeDist / faceHeight,
  };
}

/** 점수 기반 코멘트 생성 */
function generateComment(score: number): string {
  if (score >= 90) return "완벽에 가까운 황금비율! 셀럽급 얼굴입니다.";
  if (score >= 80) return "뛰어난 얼굴 균형미를 가지고 있어요!";
  if (score >= 70) return "매력적인 비율이에요. 자신감을 가지세요!";
  if (score >= 60) return "균형 잡힌 인상이에요. 좋은 매력 포인트가 있어요.";
  if (score >= 50) return "개성 있는 매력이 돋보여요!";
  return "독특한 개성이 매력인 얼굴이에요!";
}

/** 메인 점수 산출 함수 */
export function calculateScore(
  landmarks: FaceLandmarks,
  rect: FaceRectangle
): ScoreBreakdown {
  const ratios = extractFaceRatios(landmarks, rect);

  // 1. 눈 간격 / 얼굴 너비 (이상적: ~0.44, 황금비 기반)
  const eyeSpacing = ratioScore(ratios.eyeSpacingRatio, 0.44);

  // 2. 코끝~윗입술 / 얼굴 높이 (이상적: ~0.16)
  const noseToLipRatio = ratioScore(ratios.noseLipRatio, 0.16);

  // 3. 아랫입술~턱 / 얼굴 높이 (이상적: ~0.18)
  const lipToChinRatio = ratioScore(ratios.lipChinRatio, 0.18);

  // 4. 좌우 대칭
  const symmetry = symmetryScore(landmarks);

  // 5. 얼굴 세로/가로 비율 (이상적: ~1.0~1.3, Azure faceRect 기준)
  const faceThirds = ratioScore(ratios.faceHeightWidthRatio, 1.15);

  // 6. 입 너비 / 얼굴 너비 (이상적: ~0.45)
  const mouthWidth = ratioScore(ratios.mouthWidthRatio, 0.45);

  // 가중 평균
  const total = Math.round(
    eyeSpacing * WEIGHTS.eyeSpacing +
    noseToLipRatio * WEIGHTS.noseToLipRatio +
    lipToChinRatio * WEIGHTS.lipToChinRatio +
    symmetry * WEIGHTS.symmetry +
    faceThirds * WEIGHTS.faceThirds +
    mouthWidth * WEIGHTS.mouthWidth
  );

  const clampedTotal = Math.max(0, Math.min(100, total));

  return {
    total: clampedTotal,
    eyeSpacing: Math.round(eyeSpacing),
    noseToLipRatio: Math.round(noseToLipRatio),
    lipToChinRatio: Math.round(lipToChinRatio),
    symmetry: Math.round(symmetry),
    faceThirds: Math.round(faceThirds),
    mouthWidth: Math.round(mouthWidth),
    comment: generateComment(clampedTotal),
  };
}
