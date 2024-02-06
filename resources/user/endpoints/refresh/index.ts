import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.post('/refresh',  handler);

export default router;
