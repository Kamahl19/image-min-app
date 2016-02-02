import fs from 'fs';
import path from 'path';
import readChunk from 'read-chunk';
import fileType from 'file-type';
import rename from 'gulp-rename';
import Imagemin from 'imagemin';
import imageminPngQuant from 'imagemin-pngquant';
import helpers from './helpers';

export default function imageMinifier(filePath, done) {
    const type = fileType(readChunk.sync(filePath, 0, 262));

    if (!helpers.fileIsImage(type.mime)) {
        return;
    }

    const parsedFilePath = path.parse(filePath);
    const fileStats = fs.statSync(filePath);

    const newFileDir = path.join(path.dirname(filePath), 'optimized');
    const newFileBasename = parsedFilePath.name + '_' + helpers.generateShortUID();

    minify(done);

    function getImageInfo(image) {
        const newSize = (image.contents) ? image.contents.byteLength : fileStats.size;

        return {
            name: parsedFilePath.name + parsedFilePath.ext,
            origSize: (fileStats.size / 1024).toFixed(2),
            newSize: (newSize / 1024).toFixed(2),
            compressionRate: ((1 - newSize / fileStats.size)).toFixed(2),
            origPath: filePath,
            newPath: path.join(newFileDir, newFileBasename + parsedFilePath.ext)
        };
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
                .use(rename({
                    basename: newFileBasename
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
