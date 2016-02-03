/* eslint strict: 0, no-console: 0 */
'use strict';

import fs from 'fs';
import path from 'path';
import pathExists from 'path-exists';
import readChunk from 'read-chunk';
import fileType from 'file-type';
import rename from 'gulp-rename';
import Imagemin from 'imagemin';
import imageminPngQuant from 'imagemin-pngquant';
import helpers from './helpers';

export default function imageMinifier(filePath, startCb, doneCb) {
    const type = fileType(readChunk.sync(filePath, 0, 262));

    if (!helpers.fileIsImage(type.mime)) {
        return;
    }

    const fileUID = helpers.generateShortUID();

    const parsedFilePath = path.parse(filePath);
    const fileStats = fs.statSync(filePath);

    const newFileDir = path.join(path.dirname(filePath), 'optimized');
    let newFileBasename = parsedFilePath.name;

    startCb(getImageInfo());

    minify(doneCb);

    function getImageInfo(minifiedImage) {
        const newSize = (minifiedImage && minifiedImage.contents) ? minifiedImage.contents.byteLength : null;

        return {
            uid: fileUID,
            name: parsedFilePath.name + parsedFilePath.ext,
            origPath: filePath,
            origSize: (fileStats.size / 1024).toFixed(2),
            newPath: (minifiedImage) ? path.join(newFileDir, newFileBasename + parsedFilePath.ext) : null,
            newSize: (newSize) ? (newSize / 1024).toFixed(2) : null,
            compressionRate: (newSize) ? ((1 - newSize / fileStats.size)).toFixed(2) : null,
        };
    }

    function generateNewFileBasename(p, i) {
        const tempBasename = (i) ? newFileBasename + '(' + i + ')' : newFileBasename;
        const destPath = path.join(newFileDir, tempBasename + p.extname);

        const exists = pathExists.sync(destPath);

        if (exists) {
            generateNewFileBasename(p, ++i);
        }
        else if (i) {
            newFileBasename = tempBasename;
        }
    }

    function minify(cb) {
        fs.readFile(filePath, (err, buffer) => {
            if (err) {
                return console.error(err);
            }

            new Imagemin()
                .src(buffer)
                .dest(newFileDir)
                .use(imageminPngQuant())
                .use(rename((p) => {
                    generateNewFileBasename(p, 0);

                    p.basename = newFileBasename;
                    return p;
                }))
                .run((err2, optimizedImages) => {
                    if (err2) {
                        return console.error(err2);
                    }

                    cb(getImageInfo(optimizedImages[0]));
                });
        });
    }
}
