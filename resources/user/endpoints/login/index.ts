import Router from '@koa/router';
import handler from './handler';
import validate from '../../../../middleware/validateRequest.middleware';
import signUpSchema from './schema';

const router = new Router();

router.post('/login', validate(signUpSchema),  handler);

export default router;
