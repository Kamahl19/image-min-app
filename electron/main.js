/* eslint strict: 0 */
'use strict';

import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, crashReporter } from 'electron';
import electronDebug from 'electron-debug';
import imageMinifier from './imageMinifier';

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
    electronDebug({
        showDevTools: true
    });
}

let mainWindow;

function createMainWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        center: true,
        title: 'ImageMin App',
        autoHideMenuBar: true,
        titleBarStyle: true,
    });

    win.loadURL('file://' + path.join(app.getAppPath(), 'app', 'index' + ((process.env.HOT) ? '-hot' : '') + '.html'));

    win.on('closed', () => {
        mainWindow = null;
    });

    win.webContents.on('will-navigate', (e) => {
        e.preventDefault();
    });

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});

function minifyImage(filePath) {
    imageMinifier(filePath, (image) =>
        mainWindow.webContents.send('images.minified', image)
    );
}

function traverseFilesAndFolders(filePath, cb) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return console.error(err);
        }

        if (stats.isDirectory()) {
            fs.readdir(filePath, (err2, files) => {
                if (err2) {
                    return console.error(err);
                }

                for (const file of files) {
                    traverseFilesAndFolders(path.join(filePath, file), cb);
                }
            });
        }
        else {
            cb(filePath);
        }
    });
}

ipcMain.on('images.dropped', (event, droppedPath) => {
    traverseFilesAndFolders(droppedPath, (filePath) =>
        minifyImage(filePath)
    );
});
