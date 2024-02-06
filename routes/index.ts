import Koa from 'koa';

import authMiddleware from '../middleware/auth.middleware';

import publicRoutes from './publicRoutes';
import protectedRoutes from './protectedRoutes';

export default (app: Koa) => {
  publicRoutes(app);
  
  app.use(authMiddleware);
  protectedRoutes(app);
};
