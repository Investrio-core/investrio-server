import Router from '@koa/router';
import handler from './handler';
import validate from '../../../../middleware/validateRequest.middleware';
import schema from './schema';

const router = new Router();

router.post('/create', validate(schema),  handler);

export default router;
