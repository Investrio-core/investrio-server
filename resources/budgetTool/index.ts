import Router from '@koa/router';

import createEndpoint from './endpoints/create';
import updateCategoryEndpoint from './endpoints/updateCategory';
import updateIncomeEndpoint from './endpoints/updateIncome';
import getBudgetMonthEndpoint from './endpoints/get';
import copyFromPreviousEndpoint from './endpoints/copyFromPrevious';

const router = new Router();

router.use(createEndpoint.routes());
router.use(updateCategoryEndpoint.routes());
router.use(updateIncomeEndpoint.routes());
router.use(getBudgetMonthEndpoint.routes());
router.use(copyFromPreviousEndpoint.routes());

export default router.routes();
