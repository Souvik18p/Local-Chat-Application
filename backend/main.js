const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const rooms = require('./rooms');
const messages = require('./messages');

const server = express();
server.use(bodyParser.json());
server.use('/auth', auth);
server.use('/rooms', rooms);
server.use('/messages', messages);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../frontend/preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../frontend/index.html'));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
