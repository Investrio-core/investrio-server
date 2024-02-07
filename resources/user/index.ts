import Router from '@koa/router';

import dashboardEndpoint from './endpoints/dashboard';
import userEndpoint from './endpoints/user';
import strategy from './endpoints/createStrategy';
import noExtra from './endpoints/noExtraPayGraph';
import extra from './endpoints/extraPayGraph';
import stepThree from './endpoints/stepThree';
import deleteAllEndpoint from './endpoints/deleteAll';

const router = new Router();

router.use(dashboardEndpoint.routes());
router.use(strategy.routes());
router.use(userEndpoint.routes());
router.use(noExtra.routes());
router.use(extra.routes());
router.use(stepThree.routes());
router.use(deleteAllEndpoint.routes());

export default router.routes();
