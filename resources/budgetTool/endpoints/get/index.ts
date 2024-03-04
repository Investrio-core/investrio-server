import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.get('/:year/:month',  handler);

export default router;
