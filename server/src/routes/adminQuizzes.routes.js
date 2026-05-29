import { Router } from 'express';
import { createQuizRepository } from '../repositories/quizRepository.js';
import { createQuizSetRepository } from '../repositories/quizSetRepository.js';
import { createQuizService } from '../services/quizService.js';

export function createAdminQuizzesRouter(db) {
  const router = Router();
  const service = createQuizService({
    quizRepository: createQuizRepository(db),
    quizSetRepository: createQuizSetRepository(db)
  });

  router.get('/:id', (req, res, next) => {
    try {
      res.status(200).json(service.get(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', (req, res, next) => {
    try {
      res.status(200).json(service.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', (req, res, next) => {
    try {
      res.status(200).json(service.delete(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

