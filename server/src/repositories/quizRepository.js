function toQuiz(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    quizSetId: row.quiz_set_id,
    sortOrder: row.sort_order,
    question: row.question,
    choices: [
      row.choice_1,
      row.choice_2,
      row.choice_3,
      row.choice_4
    ],
    correctPosition: row.correct_position,
    explanation: row.explanation,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createQuizRepository(db) {
  return {
    listBySetId(quizSetId) {
      const rows = db.prepare(`
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
        FROM quizzes
        WHERE quiz_set_id = ?
        ORDER BY sort_order ASC
      `).all(quizSetId);

      return rows.map(toQuiz);
    },

    findById(id) {
      const row = db.prepare(`
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
        FROM quizzes
        WHERE id = ?
      `).get(id);

      return toQuiz(row);
    },

    countBySetId(quizSetId) {
      const row = db.prepare(`
        SELECT COUNT(*) AS quiz_count
        FROM quizzes
        WHERE quiz_set_id = ?
      `).get(quizSetId);

      return row?.quiz_count || 0;
    },

    sortOrderExists(quizSetId, sortOrder, excludeId = null) {
      if (excludeId) {
        return Boolean(db.prepare(`
          SELECT id
          FROM quizzes
          WHERE quiz_set_id = ? AND sort_order = ? AND id != ?
        `).get(quizSetId, sortOrder, excludeId));
      }

      return Boolean(db.prepare(`
        SELECT id
        FROM quizzes
        WHERE quiz_set_id = ? AND sort_order = ?
      `).get(quizSetId, sortOrder));
    },

    create({
      quizSetId,
      sortOrder,
      question,
      choices,
      correctPosition,
      explanation,
      createdAt,
      updatedAt
    }) {
      const result = db.prepare(`
        INSERT INTO quizzes (
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        quizSetId,
        sortOrder,
        question,
        choices[0],
        choices[1],
        choices[2],
        choices[3],
        correctPosition,
        explanation,
        createdAt,
        updatedAt
      );

      return Number(result.lastInsertRowid);
    },

    update(id, {
      sortOrder,
      question,
      choices,
      correctPosition,
      explanation,
      updatedAt
    }) {
      const result = db.prepare(`
        UPDATE quizzes
        SET
          sort_order = ?,
          question = ?,
          choice_1 = ?,
          choice_2 = ?,
          choice_3 = ?,
          choice_4 = ?,
          correct_position = ?,
          explanation = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        sortOrder,
        question,
        choices[0],
        choices[1],
        choices[2],
        choices[3],
        correctPosition,
        explanation,
        updatedAt,
        id
      );

      return result.changes;
    },

    delete(id) {
      const result = db.prepare('DELETE FROM quizzes WHERE id = ?').run(id);
      return result.changes;
    }
  };
}

