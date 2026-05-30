import express from 'express';
import { getEnv } from './config/env.js';
import { openDatabase } from './db/connection.js';
import { createAdminQuizzesRouter } from './routes/adminQuizzes.routes.js';
import { createAdminQuizSetsRouter } from './routes/adminQuizSets.routes.js';
import { createAdminAuthMiddleware } from './middleware/adminAuth.js';
import { createPublicEmbedRouter } from './routes/publicEmbed.routes.js';
import { createCorsMiddleware } from './utils/cors.js';

export function createApp({ db = openDatabase(), env = getEnv() } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(createCorsMiddleware(env.corsAllowedOrigins));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'proj01-quiz-widget-api',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/embed', createPublicEmbedRouter(db));
  app.use('/api/admin', createAdminAuthMiddleware(env));
  app.use('/api/admin/quiz-sets', createAdminQuizSetsRouter(db));
  app.use('/api/admin/quizzes', createAdminQuizzesRouter(db));

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${req.method} ${req.path}`
      }
    });
  });

  app.use((err, _req, res, _next) => {
    if (err.statusCode && err.code) {
      res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message
        }
      });
      return;
    }

    console.error(err);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error'
      }
    });
  });

  return app;
}

