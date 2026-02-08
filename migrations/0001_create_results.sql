CREATE TABLE IF NOT EXISTS analysis_results (
  id TEXT PRIMARY KEY,
  score INTEGER NOT NULL,
  score_breakdown TEXT NOT NULL,
  celebrity_matches TEXT NOT NULL,
  face_type TEXT NOT NULL,
  face_type_name TEXT NOT NULL,
  face_type_description TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
