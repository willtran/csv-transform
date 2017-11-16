import csv from 'csv';
import fs from 'fs';
import transform from 'stream-transform';
import stringify from 'csv-stringify';

const pivot = (inputPath, resultPath) => {
    return new Promise((resolve, reject) =>
    {

        const parser = csv.parse({
            'columns': true,
            'trim': true
        });

        const transformer = transform(function (record, callback) {
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

        const fileWriter = fs.createWriteStream(resultPath);

        const fileReader = fs.createReadStream(inputPath);

        var transformerFinished = false;

        var transformerChunkCount = 0;
        var stringifierChunkCount = 0;

        transformer.on('data', () => {
            transformerChunkCount++;
        });

        transformer.on('finish', () => {transformerFinished = true; });


        stringifier.on('data', () => {
            stringifierChunkCount++;
            if (transformerFinished) {
                if (stringifierChunkCount == transformerChunkCount) {
                    stringifier.end();
                }
            }
        });

        fileReader.pipe(parser).pipe(transformer).pipe(stringifier).pipe(fileWriter);

        fileWriter.on('finish', () => resolve());
    })
}


export default pivot;