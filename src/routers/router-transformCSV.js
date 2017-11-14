import Router from 'koa-router';
import CONFIG from '../config';
import csv from 'csv';
import fs from 'fs';
import transform from 'stream-transform';
import stringify from 'csv-stringify';
import path from 'path';
import send from 'koa-send';

const router = new Router()

router.post('/transformCSV', async (ctx, next)=> {
    const uploadedFilePath = ctx.request.files[0].path.split('/');
    const p = ctx.request.files[0].path;
    const resultPath = path.join('var', 'results', uploadedFilePath[uploadedFilePath.length - 1]);
    const parser = csv.parse({
        'columns': true,
        'trim': true
    });

    const transformer = transform(function(record, callback) {
        var firstKey = Object.keys(record)[0];
        const firstColumn = record[firstKey];
        delete record[firstKey];
        for (var key in record) {
            if (record.hasOwnProperty(key)) {
                callback(null, [firstColumn, key, record[key]]);
            }
        }
    });

    const stringifier = stringify();

    var data =  fs.createReadStream(p);
    var result = fs.createWriteStream(resultPath);

    data.pipe(parser).pipe(transformer).pipe(stringifier).pipe(result);

    await send(ctx, resultPath);

})
export default router;