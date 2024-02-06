import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.get('/step-three/:userId', handler);

export default router;
