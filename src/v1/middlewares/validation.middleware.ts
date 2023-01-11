import {Request, Response, NextFunction} from 'express';
import { AnySchema, ValidationError  } from 'yup';
import {
  errorResponse
} from '../utils/error.util';

const validation = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    const err = error as ValidationError;
    return res.status(400).json(errorResponse({
      error: err.errors.toString(),
      status: 400
    }));
  }
};

export default validation;
