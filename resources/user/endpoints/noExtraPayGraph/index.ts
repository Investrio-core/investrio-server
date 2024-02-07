import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.get('/no-extra-pay-graph/:userId', handler);

export default router;
