import Router from 'koa-router';
import path from 'path';
import send from 'koa-send';

const router = new Router();

router.get('/', async (ctx, next)=> {
    const templatePath = path.join('src', 'view', 'index.html');
    await send(ctx, templatePath);
    next();
});

export default router;