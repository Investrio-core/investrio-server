import Router from '@koa/router';
import heathController from './health.controller';

const router = new Router();

router.get('/', heathController);

export default router.routes();
