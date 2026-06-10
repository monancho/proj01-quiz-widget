import { Router } from 'express';
import { createAiServerClientFromEnv } from '../services/aiServerClient.js';

export function createAdminAiServerRouter(env) {
  const router = Router();
  const aiServerClient = createAiServerClientFromEnv(env);

  router.get('/health', async (_req, res, next) => {
    try {
      const result = await aiServerClient.health();
      res.status(200).json({
        ...result.data,
        requestId: result.requestId
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/ready', async (_req, res, next) => {
    try {
      const result = await aiServerClient.ready();
      res.status(200).json({
        ...result.data,
        requestId: result.requestId
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
