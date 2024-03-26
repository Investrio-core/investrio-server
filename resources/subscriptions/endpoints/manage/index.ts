import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.get('/manage', handler);

export default router;
