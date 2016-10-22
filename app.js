/**
 * Created by eason on 16-10-22.
 */
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const routes = require('./routes');

let win;

function createWindow() {

    win = new BrowserWindow({width: 800, height: 600,frame: false});

    win.loadURL(`file://${__dirname}/view/index.html`);

    win.on('closed', () => {
        win = null;
    });

    routes(win);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null){
        createWindow();
    }
});