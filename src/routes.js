import express from 'express';
import HttpError from './httperror';

const URL = 'http://localhost:3000';

const ENDPOINTS = [
  'people',
  'starships',
  'species',
  'vehicles',
  'planets', 
];

const router = express.Router();

/**
 * Root
 */
router.get('/', (req, res, next) => {
  try {
    const { db } = res.locals;

    const api = Object.keys(db).reduce((api, route) => {
      api[route] = `${ URL }${ route }`;
    }, {});

    res.json(api);
  } catch (error) {
    next(error);
  }
});


ENDPOINTS.forEach( endpoint => {
  /**
   * Списки
   */
  router.get(`/${ endpoint }`, (req, res, next) => {
    try {
      let entities = res.locals.db[endpoint];
      const limit = 10;
      const page = req.query.page || 1;
      const start = ( page - 1 ) * limit;
      const end = start + limit;

      if (req.query.search) {
        const search = new RegExp(req.query.search, 'i');
        entities = entities.filter(item => search.test(item.fields.name));
      }

      const count = entities.length;

      const results = entities.slice(start, end).map(record => {
        const entity = { ...record.fields, id: record.pk };
        const films = res.locals.db.films
          .filter(film => {
            const arr = film.fields[endpoint];
            if (!arr) return false;
            if (!Array.isArray(arr)) return false;
            if (!arr.length) return false;
            if (!arr.includes(record.pk)) return false;
            return true;
          })
          .map(film => film.pk);
        entity.films = films;

        return entity;
      });

      res.json({ count, results });

    } catch (error) {
      next(error);
    }
  });

  /**
   * Отдельные сущности
   */
  router.get(`/${ endpoint }/:id`, (req, res, next) => {
    try {
      const id = req.params.id;
      const entities = res.locals.db[endpoint];
      const entity = entities.find(item => item.pk == id);

      if (!entity) {
        throw new HttpError(404, 'Not found');
      }

      entity.fields.id = entity.pk;

      const films = res.locals.db.films
        .filter(film => {
          const arr = film.fields[endpoint];
          if (!arr) return false;
          if (!Array.isArray(arr)) return false;
          if (!arr.length) return false;
          if (!arr.includes(entity.pk)) return false;
          return true;
        })
        .map(film => film.pk);


      entity.fields.films = films;

      res.json(entity.fields);
    } catch (error) {
      next(error);
    }
  });
});



/**
 * Обработка ошибок
 */
router.use((error, req, res, next) => {
  if (error.code) {
    if (error.code > 399 && error.code < 500) {
      res.status(error.code).json(erorr.message);
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

export default router;