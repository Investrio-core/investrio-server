import Router from '@koa/router';

import signUpEndpoint from './endpoints/signUp';
import loginEndpoint from './endpoints/login';
import refresh from './endpoints/refresh';

const router = new Router();

router.use(signUpEndpoint.routes());
router.use(loginEndpoint.routes());
router.use(refresh.routes());

export default router.routes();
