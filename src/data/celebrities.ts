/**
 * 셀럽 얼굴 비율 벡터 데이터
 * 각 셀럽의 얼굴 비율을 사전 계산하여 저장
 *
 * 비율 기준:
 * - eyeSpacingRatio: 눈 간격 / 얼굴 너비
 * - noseLipRatio: 코끝~윗입술 / 얼굴 높이
 * - lipChinRatio: 아랫입술~턱 / 얼굴 높이
 * - mouthWidthRatio: 입 너비 / 얼굴 너비
 * - faceHeightWidthRatio: 얼굴 높이 / 얼굴 너비
 * - eyebrowEyeRatio: 눈썹~눈 간격 / 얼굴 높이
 */

import type { FaceRatios } from "@/lib/scoring";

export interface Celebrity {
  name: string;
  nameKo: string;
  gender: "male" | "female";
  ratios: FaceRatios;
  imageUrl?: string;
}

export const celebrities: Celebrity[] = [
  // === 한국 남성 ===
  {
    name: "Kim Soo-hyun",
    nameKo: "김수현",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.44,
      noseLipRatio: 0.075,
      lipChinRatio: 0.19,
      mouthWidthRatio: 0.48,
      faceHeightWidthRatio: 1.38,
      eyebrowEyeRatio: 0.065,
    },
  },
  {
    name: "Park Seo-joon",
    nameKo: "박서준",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.43,
      noseLipRatio: 0.08,
      lipChinRatio: 0.20,
      mouthWidthRatio: 0.50,
      faceHeightWidthRatio: 1.42,
      eyebrowEyeRatio: 0.07,
    },
  },
  {
    name: "Cha Eun-woo",
    nameKo: "차은우",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.46,
      noseLipRatio: 0.07,
      lipChinRatio: 0.17,
      mouthWidthRatio: 0.47,
      faceHeightWidthRatio: 1.35,
      eyebrowEyeRatio: 0.06,
    },
  },
  {
    name: "Hyun Bin",
    nameKo: "현빈",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.42,
      noseLipRatio: 0.085,
      lipChinRatio: 0.21,
      mouthWidthRatio: 0.49,
      faceHeightWidthRatio: 1.45,
      eyebrowEyeRatio: 0.068,
    },
  },
  {
    name: "Lee Jong-suk",
    nameKo: "이종석",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.45,
      noseLipRatio: 0.072,
      lipChinRatio: 0.18,
      mouthWidthRatio: 0.46,
      faceHeightWidthRatio: 1.40,
      eyebrowEyeRatio: 0.063,
    },
  },
  {
    name: "Song Joong-ki",
    nameKo: "송중기",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.44,
      noseLipRatio: 0.078,
      lipChinRatio: 0.185,
      mouthWidthRatio: 0.51,
      faceHeightWidthRatio: 1.36,
      eyebrowEyeRatio: 0.066,
    },
  },
  {
    name: "Gong Yoo",
    nameKo: "공유",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.43,
      noseLipRatio: 0.082,
      lipChinRatio: 0.20,
      mouthWidthRatio: 0.52,
      faceHeightWidthRatio: 1.43,
      eyebrowEyeRatio: 0.072,
    },
  },
  {
    name: "V (BTS)",
    nameKo: "뷔 (BTS)",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.46,
      noseLipRatio: 0.068,
      lipChinRatio: 0.17,
      mouthWidthRatio: 0.48,
      faceHeightWidthRatio: 1.33,
      eyebrowEyeRatio: 0.058,
    },
  },
  {
    name: "Jungkook (BTS)",
    nameKo: "정국 (BTS)",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.45,
      noseLipRatio: 0.074,
      lipChinRatio: 0.18,
      mouthWidthRatio: 0.49,
      faceHeightWidthRatio: 1.37,
      eyebrowEyeRatio: 0.062,
    },
  },
  {
    name: "Lee Min-ho",
    nameKo: "이민호",
    gender: "male",
    ratios: {
      eyeSpacingRatio: 0.42,
      noseLipRatio: 0.083,
      lipChinRatio: 0.21,
      mouthWidthRatio: 0.50,
      faceHeightWidthRatio: 1.46,
      eyebrowEyeRatio: 0.07,
    },
  },

  // === 한국 여성 ===
  {
    name: "Kim Tae-hee",
    nameKo: "김태희",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.45,
      noseLipRatio: 0.07,
      lipChinRatio: 0.17,
      mouthWidthRatio: 0.46,
      faceHeightWidthRatio: 1.32,
      eyebrowEyeRatio: 0.06,
    },
  },
  {
    name: "Han So-hee",
    nameKo: "한소희",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.46,
      noseLipRatio: 0.068,
      lipChinRatio: 0.165,
      mouthWidthRatio: 0.45,
      faceHeightWidthRatio: 1.34,
      eyebrowEyeRatio: 0.058,
    },
  },
  {
    name: "IU",
    nameKo: "아이유",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.47,
      noseLipRatio: 0.065,
      lipChinRatio: 0.16,
      mouthWidthRatio: 0.44,
      faceHeightWidthRatio: 1.30,
      eyebrowEyeRatio: 0.055,
    },
  },
  {
    name: "Suzy",
    nameKo: "수지",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.45,
      noseLipRatio: 0.072,
      lipChinRatio: 0.175,
      mouthWidthRatio: 0.47,
      faceHeightWidthRatio: 1.33,
      eyebrowEyeRatio: 0.062,
    },
  },
  {
    name: "Jisoo (BLACKPINK)",
    nameKo: "지수 (블랙핑크)",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.44,
      noseLipRatio: 0.073,
      lipChinRatio: 0.18,
      mouthWidthRatio: 0.48,
      faceHeightWidthRatio: 1.35,
      eyebrowEyeRatio: 0.063,
    },
  },
  {
    name: "Jennie (BLACKPINK)",
    nameKo: "제니 (블랙핑크)",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.43,
      noseLipRatio: 0.07,
      lipChinRatio: 0.17,
      mouthWidthRatio: 0.46,
      faceHeightWidthRatio: 1.31,
      eyebrowEyeRatio: 0.06,
    },
  },
  {
    name: "Song Hye-kyo",
    nameKo: "송혜교",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.44,
      noseLipRatio: 0.074,
      lipChinRatio: 0.18,
      mouthWidthRatio: 0.47,
      faceHeightWidthRatio: 1.32,
      eyebrowEyeRatio: 0.064,
    },
  },
  {
    name: "Jun Ji-hyun",
    nameKo: "전지현",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.43,
      noseLipRatio: 0.078,
      lipChinRatio: 0.19,
      mouthWidthRatio: 0.49,
      faceHeightWidthRatio: 1.38,
      eyebrowEyeRatio: 0.067,
    },
  },
  {
    name: "Kim Go-eun",
    nameKo: "김고은",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.46,
      noseLipRatio: 0.069,
      lipChinRatio: 0.165,
      mouthWidthRatio: 0.45,
      faceHeightWidthRatio: 1.31,
      eyebrowEyeRatio: 0.057,
    },
  },
  {
    name: "Shin Min-a",
    nameKo: "신민아",
    gender: "female",
    ratios: {
      eyeSpacingRatio: 0.45,
      noseLipRatio: 0.071,
      lipChinRatio: 0.175,
      mouthWidthRatio: 0.48,
      faceHeightWidthRatio: 1.34,
      eyebrowEyeRatio: 0.061,
    },
  },
];
