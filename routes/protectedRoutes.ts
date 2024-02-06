import Koa from 'koa';
import mount from 'koa-mount';
import servicesResource from '../resources/user';

const authorizedRoutes = (app: Koa) => {
  app.use(mount('/user', servicesResource));
};

export default authorizedRoutes;
