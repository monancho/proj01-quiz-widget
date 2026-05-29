import { Router } from 'express';
import { createQuizSetRepository } from '../repositories/quizSetRepository.js';
import { createQuizSetService } from '../services/quizSetService.js';

export function createAdminQuizSetsRouter(db) {
  const router = Router();
  const service = createQuizSetService(createQuizSetRepository(db));

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

