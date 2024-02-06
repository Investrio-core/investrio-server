import Koa from 'koa';
import mount from 'koa-mount';

import healthResource from '../resources/health/public';
import userPublicResource from '../resources/user/public';

const publicRoutes = (app: Koa) => {
  app.use(mount('/health', healthResource));
  app.use(mount('/user', userPublicResource));
};

export default publicRoutes;
