import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import requestLogger from './requestLogger';
import cors from '@koa/cors';

import cookie from 'koa-cookie';

import logger from './logger';
import routes from './routes';

const app = new Koa();
const router = new Router({ prefix: '/api' });

console.log(process.env.WEB_URL);

app.use(helmet());
app.use(cookie());
app.use(cors({
  credentials: true,
  exposeHeaders: ['Set-Cookie'],
  origin: ctx => {
    const requestOrigin = ctx.get('Origin');

    if ([process.env.WEB_URL].includes(requestOrigin)) {
      return requestOrigin;
    }

    return '';
  },
}));

app.use(
  bodyParser({
    enableTypes: ['json', 'text'],
    jsonLimit: '10mb',
    onerror: (err: Error, ctx) => {
      const errText: string = err.stack || err.toString();
      logger.warn(`Unable to parse request body. ${errText}`);
      ctx.throw(422, 'Unable to parse request JSON.');
    },
  })
);

app.use(requestLogger(logger));

app.use(router.routes()).use(router.allowedMethods());

routes(app);

export default app;
