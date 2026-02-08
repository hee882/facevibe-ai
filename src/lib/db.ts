/**
 * D1 데이터베이스 CRUD
 */

import type { ScoreBreakdown } from "./scoring";
import type { CelebrityMatch } from "./celebrity-match";
import type { FaceTypeResult } from "./face-type";

export interface AnalysisResult {
  id: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  celebrityMatches: CelebrityMatch[];
  faceType: FaceTypeResult;
  comment: string;
  createdAt: string;
}

/** 간단한 고유 ID 생성 (cuid 대체) */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `fv_${timestamp}${random}`;
}

/** 분석 결과를 D1에 저장 */
export async function saveResult(
  db: D1Database,
  data: {
    score: ScoreBreakdown;
    celebrities: CelebrityMatch[];
    faceType: FaceTypeResult;
  }
): Promise<string> {
  const id = generateId();

  await db
    .prepare(
      `INSERT INTO analysis_results (id, score, score_breakdown, celebrity_matches, face_type, face_type_name, face_type_description, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      data.score.total,
      JSON.stringify(data.score),
      JSON.stringify(data.celebrities),
      data.faceType.shape,
      data.faceType.nameKo,
      data.faceType.description,
      data.score.comment
    )
    .run();

  return id;
}

/** ID로 분석 결과 조회 */
export async function getResult(
  db: D1Database,
  id: string
): Promise<AnalysisResult | null> {
  const row = await db
    .prepare("SELECT * FROM analysis_results WHERE id = ?")
    .bind(id)
    .first<{
      id: string;
      score: number;
      score_breakdown: string;
      celebrity_matches: string;
      face_type: string;
      face_type_name: string;
      face_type_description: string;
      comment: string;
      created_at: string;
    }>();

  if (!row) return null;

  return {
    id: row.id,
    score: row.score,
    scoreBreakdown: JSON.parse(row.score_breakdown),
    celebrityMatches: JSON.parse(row.celebrity_matches),
    faceType: {
      shape: row.face_type as FaceTypeResult["shape"],
      nameKo: row.face_type_name,
      description: row.face_type_description,
    },
    comment: row.comment,
    createdAt: row.created_at,
  };
}
