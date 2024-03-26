import Router from '@koa/router';

import webhookEndpoint from './endpoints/webhook';

const router = new Router();

router.use(webhookEndpoint.routes());

export default router.routes();
