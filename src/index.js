import Koa from 'koa';
import body from 'koa-better-body';
import routers from './routers';
import CONFIG from  './config';
import whiteListOrigin from './middlewares/white-list-origin';
import path from 'path';

const app = new Koa();
app
  .use(whiteListOrigin)
  .use(body({
      enableTypes: ['json', 'form'],
      extendTypes: ['application/json'],
      formLimit: '6mb',
      textLimit: 500,
      encoding: 'utf-8',
      uploadDir: path.join('var', 'uploads'),
      keepExtensions: true
    }
  ))
  .use(routers);

app.listen(CONFIG.APP.port, CONFIG.APP.host);
console.log(`API Server started at http://${CONFIG.APP.host}:${CONFIG.APP.port}`);