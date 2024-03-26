import Koa from 'koa';
import mount from 'koa-mount';

import healthResource from '../resources/health/public';
import userPublicResource from '../resources/user/public';
import subscriptionPublicResource from '../resources/subscriptions/public';

const publicRoutes = (app: Koa) => {
  app.use(mount('/health', healthResource));
  app.use(mount('/user', userPublicResource));
  app.use(mount('/stripe', subscriptionPublicResource));
};

export default publicRoutes;
