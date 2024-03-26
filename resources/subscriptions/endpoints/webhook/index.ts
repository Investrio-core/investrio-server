import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.post('/webhook', handler);

export default router;
