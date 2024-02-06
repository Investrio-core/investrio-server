import http from 'http';

import app from './app';
import logger from './logger';

(async () => {
  
  const server = http.createServer(app.callback());

  server.listen(8081, () => {
    logger.info('API server is listening', {
      port: 8081,
      env: 'development',
    });
  });
})();
