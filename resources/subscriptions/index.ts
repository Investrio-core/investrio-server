import Router from '@koa/router';

import createLinkEndpoint from './endpoints/createLink';
import manageEndpoint from './endpoints/manage';

const router = new Router();

router.use(createLinkEndpoint.routes());
router.use(manageEndpoint.routes());

export default router.routes();
