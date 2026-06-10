import { Router } from 'express';
import { createPublicEmbedRepository } from '../repositories/publicEmbedRepository.js';
import { createPublicEmbedService } from '../services/publicEmbedService.js';

export function createPublicEmbedRouter(db) {
  const router = Router();
  const service = createPublicEmbedService(createPublicEmbedRepository(db));

  router.get('/:slug/quizzes', (req, res, next) => {
    try {
      res.status(200).json(service.listQuizzes(req.params.slug));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

