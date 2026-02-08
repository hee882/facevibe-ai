CREATE TABLE IF NOT EXISTS celeb_match_counts (
  celeb_name TEXT PRIMARY KEY,
  match_count INTEGER NOT NULL DEFAULT 0
);
