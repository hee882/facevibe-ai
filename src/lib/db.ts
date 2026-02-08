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
  surpriseMatch: CelebrityMatch | null;
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
    surpriseMatch: CelebrityMatch | null;
    faceType: FaceTypeResult;
  }
): Promise<string> {
  const id = generateId();

  // top + surprise를 하나의 JSON으로 저장 (하위 호환)
  const matchData = JSON.stringify({
    top: data.celebrities,
    surprise: data.surpriseMatch,
  });

  await db
    .prepare(
      `INSERT INTO analysis_results (id, score, score_breakdown, celebrity_matches, face_type, face_type_name, face_type_description, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      data.score.total,
      JSON.stringify(data.score),
      matchData,
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

  // 하위 호환: 이전 형식(배열)과 새 형식({ top, surprise }) 모두 지원
  const parsed = JSON.parse(row.celebrity_matches);
  let celebrityMatches: CelebrityMatch[];
  let surpriseMatch: CelebrityMatch | null = null;

  if (Array.isArray(parsed)) {
    celebrityMatches = parsed;
  } else {
    celebrityMatches = parsed.top;
    surpriseMatch = parsed.surprise ?? null;
  }

  return {
    id: row.id,
    score: row.score,
    scoreBreakdown: JSON.parse(row.score_breakdown),
    celebrityMatches,
    surpriseMatch,
    faceType: {
      shape: row.face_type as FaceTypeResult["shape"],
      nameKo: row.face_type_name,
      description: row.face_type_description,
    },
    comment: row.comment,
    createdAt: row.created_at,
  };
}

/** 셀럽 매칭 카운터 증가 */
export async function incrementMatchCounts(
  db: D1Database,
  celebNames: string[]
): Promise<void> {
  const stmt = db.prepare(
    `INSERT INTO celeb_match_counts (celeb_name, match_count) VALUES (?, 1)
     ON CONFLICT(celeb_name) DO UPDATE SET match_count = match_count + 1`
  );
  await db.batch(celebNames.map((name) => stmt.bind(name)));
}

/** 셀럽 매칭 카운터 조회 */
export async function getMatchCounts(
  db: D1Database,
  celebNames: string[]
): Promise<Record<string, number>> {
  if (celebNames.length === 0) return {};

  const placeholders = celebNames.map(() => "?").join(",");
  const rows = await db
    .prepare(
      `SELECT celeb_name, match_count FROM celeb_match_counts WHERE celeb_name IN (${placeholders})`
    )
    .bind(...celebNames)
    .all<{ celeb_name: string; match_count: number }>();

  const counts: Record<string, number> = {};
  for (const row of rows.results) {
    counts[row.celeb_name] = row.match_count;
  }
  return counts;
}
