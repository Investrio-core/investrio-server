import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.get('/dashboard/:userId', handler);

export default router;
