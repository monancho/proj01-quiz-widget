PRAGMA foreign_keys = OFF;

CREATE TABLE quiz_sets_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  post_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'private', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO quiz_sets_new (
  id,
  post_slug,
  post_title,
  status,
  created_at,
  updated_at
)
SELECT
  qs.id,
  qs.post_slug,
  qs.post_title,
  CASE
    WHEN COUNT(q.id) = 3 THEN qs.status
    ELSE 'draft'
  END AS status,
  qs.created_at,
  qs.updated_at
FROM quiz_sets qs
LEFT JOIN quizzes q ON q.quiz_set_id = qs.id
GROUP BY qs.id;

CREATE TABLE quizzes_new (
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
  FOREIGN KEY (quiz_set_id) REFERENCES quiz_sets(id) ON DELETE CASCADE
);

INSERT INTO quizzes_new (
  id,
  quiz_set_id,
  sort_order,
  question,
  choice_1,
  choice_2,
  choice_3,
  choice_4,
  correct_position,
  explanation,
  created_at,
  updated_at
)
SELECT
  id,
  quiz_set_id,
  sort_order,
  question,
  choice_1,
  choice_2,
  choice_3,
  choice_4,
  correct_position,
  explanation,
  created_at,
  updated_at
FROM quizzes;

DROP TABLE quizzes;
DROP TABLE quiz_sets;

ALTER TABLE quiz_sets_new RENAME TO quiz_sets;
ALTER TABLE quizzes_new RENAME TO quizzes;

CREATE INDEX idx_quizzes_quiz_set_id ON quizzes(quiz_set_id);
CREATE INDEX idx_quiz_sets_status ON quiz_sets(status);

PRAGMA foreign_keys = ON;
