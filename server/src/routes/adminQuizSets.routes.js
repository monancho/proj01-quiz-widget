import { Router } from 'express';
import { createQuizRepository } from '../repositories/quizRepository.js';
import { createQuizSetRepository } from '../repositories/quizSetRepository.js';
import { createQuizService } from '../services/quizService.js';
import { createQuizSetService } from '../services/quizSetService.js';

export function createAdminQuizSetsRouter(db) {
  const router = Router();
  const quizSetRepository = createQuizSetRepository(db);
  const service = createQuizSetService(quizSetRepository);
  const quizService = createQuizService({
    quizRepository: createQuizRepository(db),
    quizSetRepository
  });

  router.get('/check-slug', (req, res, next) => {
    try {
      res.status(200).json(service.checkSlug(req.query));
    } catch (error) {
      next(error);
    }
  });

  router.get('/', (req, res, next) => {
    try {
      res.status(200).json(service.list(req.query));
    } catch (error) {
      next(error);
    }
  });

  router.post('/', (req, res, next) => {
    try {
      res.status(201).json(service.create(req.body));
    } catch (error) {
      next(error);
    }
  });

  router.get('/:setId/quizzes', (req, res, next) => {
    try {
      res.status(200).json(quizService.listBySetId(req.params.setId));
    } catch (error) {
      next(error);
    }
  });

  router.post('/:setId/quizzes', (req, res, next) => {
    try {
      res.status(201).json(quizService.create(req.params.setId, req.body));
    } catch (error) {
      next(error);
    }
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
