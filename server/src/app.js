import express from 'express';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'proj01-quiz-widget-api',
      timestamp: new Date().toISOString()
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${req.method} ${req.path}`
      }
    });
  });

  app.use((err, _req, res, _next) => {
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

