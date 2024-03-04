import Koa from 'koa';
import mount from 'koa-mount';
import servicesResource from '../resources/user';
import budgetToolResource from '../resources/budgetTool';

const authorizedRoutes = (app: Koa) => {
  app.use(mount('/user', servicesResource));
  app.use(mount('/budget', budgetToolResource));
};

export default authorizedRoutes;
