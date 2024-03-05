import Router from '@koa/router';

import dashboardEndpoint from '../dashboard/dashboard';
import strategy from '../dashboard/createStrategy';
import noExtra from '../dashboard/noExtraPayGraph';
import extra from '../dashboard/extraPayGraph';
import stepThree from '../dashboard/stepThree';
import deleteAllEndpoint from '../dashboard/deleteAll';
import financialRecordsEndpoint from '../dashboard/records';
import updateStrategyEndpoint from '../dashboard/updateAndRecalculate';
import deleteEndpoint from '../dashboard/delete';
import updateExtraEndpoint from '../dashboard/updateExtaPayment';

const router = new Router();

router.use(dashboardEndpoint.routes());
router.use(strategy.routes());
router.use(noExtra.routes());
router.use(extra.routes());
router.use(stepThree.routes());
router.use(deleteAllEndpoint.routes());
router.use(financialRecordsEndpoint.routes());
router.use(updateStrategyEndpoint.routes());
router.use(deleteEndpoint.routes());
router.use(updateExtraEndpoint.routes());

export default router.routes();
