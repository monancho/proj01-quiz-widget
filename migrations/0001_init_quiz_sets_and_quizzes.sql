CREATE TABLE quiz_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  post_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'private'
    CHECK (status IN ('private', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_set_id INTEGER NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order BETWEEN 1 AND 3),
  question TEXT NOT NULL,
  choice_1 TEXT NOT NULL,
  choice_2 TEXT NOT NULL,
  choice_3 TEXT NOT NULL,
  choice_4 TEXT NOT NULL,
  correct_position INTEGER NOT NULL CHECK (correct_position BETWEEN 1 AND 4),
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (quiz_set_id) REFERENCES quiz_sets(id) ON DELETE CASCADE,
  UNIQUE (quiz_set_id, sort_order)
);

CREATE INDEX idx_quizzes_quiz_set_id ON quizzes(quiz_set_id);
CREATE INDEX idx_quiz_sets_status ON quiz_sets(status);

