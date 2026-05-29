function toPublicQuiz(row) {
  return {
    id: row.id,
    question: row.question,
    choices: [
      { position: 1, text: row.choice_1 },
      { position: 2, text: row.choice_2 },
      { position: 3, text: row.choice_3 },
      { position: 4, text: row.choice_4 }
    ],
    answerPosition: row.correct_position,
    correctAnswer: row[`choice_${row.correct_position}`],
    explanation: row.explanation
  };
}

export function createPublicEmbedRepository(db) {
  return {
    findPublishedSetBySlug(postSlug) {
      return db.prepare(`
        SELECT
          qs.id,
          qs.post_slug,
          qs.status,
          COUNT(q.id) AS quiz_count
        FROM quiz_sets qs
        LEFT JOIN quizzes q ON q.quiz_set_id = qs.id
        WHERE qs.post_slug = ?
        GROUP BY qs.id
      `).get(postSlug);
    },

    listPublicQuizzes(quizSetId) {
      const rows = db.prepare(`
        SELECT
          id,
          question,
          choice_1,
          choice_2,
          choice_3,
          choice_4,
          correct_position,
          explanation
        FROM quizzes
        WHERE quiz_set_id = ?
        ORDER BY sort_order ASC
      `).all(quizSetId);

      return rows.map(toPublicQuiz);
    }
  };
}

