import express from 'express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './controller';

export const app = express();
setupMiddlewares(app);
setupRoutes(app);
