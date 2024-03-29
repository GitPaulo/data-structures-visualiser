// Disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Imports
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Constants
const INDEX_FOLDER_PATH = path.join(__dirname, 'views', 'home');
const WINDOW_WIDTH  = 1366;
const WINDOW_HEIGHT = 768;

// Outer scope main window
let mainWindow;

// Wrap around function
function createWindow() {
    // Instantiate BrowserWindow instance
    mainWindow = new BrowserWindow({
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        center: true,
        alwaysOnTop: false,
        useContentSize: true
    });

    // Load the index.html of the app
    mainWindow.loadURL(url.format({
        pathname: path.join(INDEX_FOLDER_PATH, 'home.html'),
        protocol: 'file:',
        slashes: true
    }));

    // mainWindow.webContents.openDevTools("undock")

    // Emitted when the window is closed
    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

// This method will be called when Electron has finished
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Activation event
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
