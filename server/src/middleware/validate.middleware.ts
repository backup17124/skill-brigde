import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (
  schema: AnyZodObject,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};
