'use strict';

// goodbye this app needs no security lol
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, BrowserWindow } = require('electron');
const path                   = require('path');
const url                    = require('url');

const APP_FOLDER_NAME = 'app';

let mainWindow;

function createWindow() {
    // screen can only be used on ready event
    const { screen } = require('electron');
    let mainScreen   = screen.getPrimaryDisplay();
    let dimensions   = mainScreen.size;

    mainWindow = new BrowserWindow({
        width: dimensions.width/1.25,
        height: dimensions.height/1.25,
        center: true,
        alwaysOnTop: false,
        useContentSize: true // when false, width/height will set the size of the whole app, including frames. If true, innerWindow will be set instead, resulting in a bigger app window
    });

    // Load the index.html of the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, APP_FOLDER_NAME, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools on start
    //mainWindow.webContents.openDevTools("undock")

    // Emitted when the window is closed
    mainWindow.on('closed', function() {
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});