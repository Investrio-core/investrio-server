import Router from '@koa/router';
import handler from './handler';

const router = new Router();

router.delete('/strategy/deleteAll', handler);

export default router;
