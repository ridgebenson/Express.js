import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const validateEvent: RequestHandler[] = [
  body('company').notEmpty().withMessage('Company is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date YYYY-MM-DD'),
  body('imageUrl').isURL().withMessage('Image URL must be valid'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('title').notEmpty().withMessage('Title is required'),
  
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

export { validateEvent };