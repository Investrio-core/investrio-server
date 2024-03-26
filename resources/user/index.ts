import Router from '@koa/router';

import userEndpoint from './endpoints/user';

const router = new Router();

router.use(userEndpoint.routes());

export default router.routes();
