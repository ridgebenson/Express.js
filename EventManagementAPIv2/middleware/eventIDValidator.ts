import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

const validateEventId: Array<RequestHandler> = [
  param('eventId').isInt().withMessage('Event ID must be an integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

export { validateEventId };