import Koa from 'koa';
import mount from 'koa-mount';
import dashboardResource from '../resources/dashboard';
import budgetToolResource from '../resources/budgetTool';

const authorizedRoutes = (app: Koa) => {
  app.use(mount('/dashboard', dashboardResource));
  app.use(mount('/budget', budgetToolResource));
};

export default authorizedRoutes;
