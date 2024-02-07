import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.post('/strategy/delete', handler);

export default router;
