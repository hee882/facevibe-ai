/**
 * 글로벌 셀럽 얼굴 비율 벡터 데이터
 * 지역별 100명씩 (남 50 + 여 50) = 총 700명
 *
 * 비율 기준:
 * - eyeSpacingRatio: 눈 간격 / 얼굴 너비
 * - noseLipRatio: 코끝~윗입술 / 얼굴 높이
 * - lipChinRatio: 아랫입술~턱 / 얼굴 높이
 * - mouthWidthRatio: 입 너비 / 얼굴 너비
 * - faceHeightWidthRatio: 얼굴 높이 / 얼굴 너비
 * - eyebrowEyeRatio: 눈썹~눈 간격 / 얼굴 높이
 */

export type { Celebrity, Region } from "./types";

import { koreaCelebrities } from "./korea";
import { japanCelebrities } from "./japan";
import { chinaCelebrities } from "./china";
import { southeastAsiaCelebrities } from "./southeast-asia";
import { northAmericaCelebrities } from "./north-america";
import { europeCelebrities } from "./europe";
import { latinAmericaCelebrities } from "./latin-america";

export const celebrities = [
  ...koreaCelebrities,
  ...japanCelebrities,
  ...chinaCelebrities,
  ...southeastAsiaCelebrities,
  ...northAmericaCelebrities,
  ...europeCelebrities,
  ...latinAmericaCelebrities,
];
