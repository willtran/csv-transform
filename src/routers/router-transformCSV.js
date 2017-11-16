import Router from 'koa-router';
import path from 'path';
import send from 'koa-send';
import pivot from '../models/pivot';
const router = new Router();

router.get('/pivotCSV', async (ctx, next) => {

    const uploadedFilePath = ctx.request.files[0].path.split('/');
    const p = ctx.request.files[0].path;
    const resultPath = path.join('var', 'results', uploadedFilePath[uploadedFilePath.length - 1]);

    await pivot(p, resultPath);

    await send(ctx, resultPath);

});

export default router;