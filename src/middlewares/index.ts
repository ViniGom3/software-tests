import { json, Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { FAILURE_CODE_ERROR, FAILURE_MESSAGE } from '../error';
import { Exception } from '../error';

const bodyParser = json();
const contentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json');
  next();
};

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors());
  app.use(contentType);
};

export function ErrorMiddleware(
  error: Exception,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('error: ', error);
  const status =
    error.code && Number.isInteger(error.code)
      ? error.code
      : FAILURE_CODE_ERROR.SERVERERROR;
  const response = error.message || FAILURE_MESSAGE.SERVERERROR;
  res.status(status).json({response});
}