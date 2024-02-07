import Router from '@koa/router';

import dashboardEndpoint from './endpoints/dashboard';
import userEndpoint from './endpoints/user';
import strategy from './endpoints/createStrategy';
import noExtra from './endpoints/noExtraPayGraph';
import extra from './endpoints/extraPayGraph';
import stepThree from './endpoints/stepThree';
import deleteAllEndpoint from './endpoints/deleteAll';
import financialRecordsEndpoint from './endpoints/records';
import updateStrategyEndpoint from './endpoints/updateAndRecalculate';
import deleteEndpoint from './endpoints/delete';

const router = new Router();

router.use(dashboardEndpoint.routes());
router.use(strategy.routes());
router.use(userEndpoint.routes());
router.use(noExtra.routes());
router.use(extra.routes());
router.use(stepThree.routes());
router.use(deleteAllEndpoint.routes());
router.use(financialRecordsEndpoint.routes());
router.use(updateStrategyEndpoint.routes());
router.use(deleteEndpoint.routes());


export default router.routes();
