function toQuizSet(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    postSlug: row.post_slug,
    postTitle: row.post_title,
    status: row.status,
    quizCount: row.quiz_count,
    requiredQuizCount: 3,
    isComplete: row.quiz_count === 3,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    quizzes: []
  };
}

function buildFilterWhere({ query, status } = {}) {
  const clauses = [];
  const params = [];

  if (query) {
    clauses.push('(qs.post_slug LIKE ? OR qs.post_title LIKE ?)');
    params.push(`%${query}%`, `%${query}%`);
  }

  if (status) {
    clauses.push('qs.status = ?');
    params.push(status);
  }

  return {
    where: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
}

export function createQuizSetRepository(db) {
  return {
    list({ query, status } = {}) {
      const { where, params } = buildFilterWhere({ query, status });
      const rows = db.prepare(`
        SELECT
          qs.id,
          qs.post_slug,
          qs.post_title,
          qs.status,
          qs.created_at,
          qs.updated_at,
          COUNT(q.id) AS quiz_count
        FROM quiz_sets qs
        LEFT JOIN quizzes q ON q.quiz_set_id = qs.id
        ${where}
        GROUP BY qs.id
        ORDER BY qs.updated_at DESC, qs.id DESC
      `).all(...params);

      return rows.map(toQuizSet);
    },

    summary() {
      return db.prepare(`
        SELECT
          COUNT(*) AS total_sets,
          COALESCE(SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END), 0) AS published_sets,
          COALESCE(SUM(CASE WHEN status = 'private' THEN 1 ELSE 0 END), 0) AS private_sets,
          COALESCE(SUM(CASE WHEN quiz_count = 3 THEN 1 ELSE 0 END), 0) AS completed_sets
        FROM (
          SELECT qs.id, qs.status, COUNT(q.id) AS quiz_count
          FROM quiz_sets qs
          LEFT JOIN quizzes q ON q.quiz_set_id = qs.id
          GROUP BY qs.id
        )
      `).get();
    },

    findById(id) {
      const row = db.prepare(`
        SELECT
          qs.id,
          qs.post_slug,
          qs.post_title,
          qs.status,
          qs.created_at,
          qs.updated_at,
          COUNT(q.id) AS quiz_count
        FROM quiz_sets qs
        LEFT JOIN quizzes q ON q.quiz_set_id = qs.id
        WHERE qs.id = ?
        GROUP BY qs.id
      `).get(id);

      return toQuizSet(row);
    },

    findBySlug(postSlug, excludeId = null) {
      if (excludeId) {
        return db.prepare(`
          SELECT id, post_slug, post_title, status, created_at, updated_at
          FROM quiz_sets
          WHERE post_slug = ? AND id != ?
        `).get(postSlug, excludeId);
      }

      return db.prepare(`
        SELECT id, post_slug, post_title, status, created_at, updated_at
        FROM quiz_sets
        WHERE post_slug = ?
      `).get(postSlug);
    },

    create({ postSlug, postTitle, status, createdAt, updatedAt }) {
      const result = db.prepare(`
        INSERT INTO quiz_sets (post_slug, post_title, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(postSlug, postTitle, status, createdAt, updatedAt);

      return Number(result.lastInsertRowid);
    },

    update(id, { postSlug, postTitle, status, updatedAt }) {
      const result = db.prepare(`
        UPDATE quiz_sets
        SET post_slug = ?, post_title = ?, status = ?, updated_at = ?
        WHERE id = ?
      `).run(postSlug, postTitle, status, updatedAt, id);

      return result.changes;
    },

    delete(id) {
      const result = db.prepare('DELETE FROM quiz_sets WHERE id = ?').run(id);
      return result.changes;
    }
  };
}

