import Router from '@koa/router';
import handler from './handler';
import validate from '../../../../middleware/validateRequest.middleware';
import schema from './schema';
import canModifyBudgetMiddleware from '../../../../middleware/canModifyBudget.middleware';

const router = new Router();

router.put('/update-income/:id', validate(schema), canModifyBudgetMiddleware,  handler);

export default router;
