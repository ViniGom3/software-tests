import { json, Express, NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
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
  res.status(status).json(response);
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];

  if (!process.env.JWT_SECRET) return new Error('JWT_SECRET not found');
  if (!token) return res.status(401).json({ error: 'Nenhum token provido' });

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Falha na autenticação' });
    } else if (!decoded) {
    } else {
      req.loggedUserId = parseInt(decoded.id);
    }
  });
  next();
}

export const createJWT = async (id: Number) => {
  if (!process.env.JWT_SECRET) return new Error('');
  if (!id) return;

  const token = await jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};
