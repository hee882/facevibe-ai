/**
 * 얼굴형 분류
 * 랜드마크 기반 5가지 유형: oval, round, heart, square, oblong
 */

import type { FaceLandmarks, FaceRectangle, Point } from "./azure-face";

export type FaceShape = "oval" | "round" | "heart" | "square" | "oblong";

export interface FaceTypeResult {
  shape: FaceShape;
  nameKo: string;
  description: string;
}

const FACE_TYPE_INFO: Record<FaceShape, { nameKo: string; description: string }> = {
  oval: {
    nameKo: "계란형",
    description: "이상적인 균형 잡힌 얼굴형으로, 어떤 헤어스타일도 잘 어울려요.",
  },
  round: {
    nameKo: "둥근형",
    description: "부드럽고 친근한 인상을 주며, 동안의 상징이에요.",
  },
  heart: {
    nameKo: "하트형",
    description: "이마가 넓고 턱이 갸름해서 사랑스러운 인상을 줘요.",
  },
  square: {
    nameKo: "각진형",
    description: "강인하고 세련된 인상을 주며, 카리스마가 넘쳐요.",
  },
  oblong: {
    nameKo: "긴형",
    description: "세로로 긴 얼굴형으로, 성숙하고 지적인 분위기를 줘요.",
  },
};

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function classifyFaceType(
  landmarks: FaceLandmarks,
  rect: FaceRectangle
): FaceTypeResult {
  const faceWidth = rect.width;
  const faceHeight = rect.height;
  const ratio = faceHeight / faceWidth;

  // 광대 너비 (눈 바깥쪽 간격으로 추정)
  const cheekWidth = dist(landmarks.eyeLeftOuter, landmarks.eyeRightOuter);

  // 이마 너비 (눈썹 바깥쪽 간격)
  const foreheadWidth = dist(
    landmarks.eyebrowLeftOuter,
    landmarks.eyebrowRightOuter
  );

  // 턱 너비 (입 양쪽 간격으로 추정)
  const jawWidth = dist(landmarks.mouthLeft, landmarks.mouthRight);

  // 비율 계산
  const foreheadToJaw = foreheadWidth / jawWidth;
  const cheekToJaw = cheekWidth / jawWidth;

  let shape: FaceShape;

  if (ratio > 1.5) {
    // 세로로 많이 긴 경우
    shape = "oblong";
  } else if (ratio < 1.25) {
    // 세로 대비 가로가 넓은 경우
    if (cheekToJaw < 1.3) {
      shape = "round";
    } else {
      shape = "square";
    }
  } else if (foreheadToJaw > 1.4) {
    // 이마가 턱보다 훨씬 넓은 경우
    shape = "heart";
  } else if (cheekToJaw > 1.35 && foreheadToJaw < 1.25) {
    // 광대가 넓고 이마/턱이 비슷한 경우
    shape = "square";
  } else {
    // 균형 잡힌 경우
    shape = "oval";
  }

  const info = FACE_TYPE_INFO[shape];
  return {
    shape,
    nameKo: info.nameKo,
    description: info.description,
  };
}
