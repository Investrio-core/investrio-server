import Koa from 'koa';
import mount from 'koa-mount';
import dashboardResource from '../resources/dashboard';
import budgetToolResource from '../resources/budgetTool';
import subscriptionResource from '../resources/subscriptions';
import userResource from '../resources/user';
import checkUserIsActiveMiddleware from '../middleware/userIsActive.middleware';
import checkTrialMiddleware from '../middleware/checkTrial.middleware';

const authorizedRoutes = (app: Koa) => {
  app.use(mount('/user', userResource));
  app.use(mount('/subscription', subscriptionResource));

  app.use(checkTrialMiddleware);
  app.use(checkUserIsActiveMiddleware);

  app.use(mount('/dashboard', dashboardResource));
  app.use(mount('/budget', budgetToolResource));
};

export default authorizedRoutes;
