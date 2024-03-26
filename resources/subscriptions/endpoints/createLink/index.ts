import Router from '@koa/router';
import handler from './handler';
import createStripeCustomerMiddleware from '../../../../middleware/createStripeCustomer.middleware';

const router = new Router();

router.get('/link', createStripeCustomerMiddleware, handler);

export default router;
