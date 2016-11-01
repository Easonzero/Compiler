/**
 * Created by eason on 16-10-22.
 */
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const routes = require('./routes');

let win;

function createWindow() {

    win = new BrowserWindow({width: 800, height: 620,frame: false,minHeight:580,minWidth:300});//bar:48

    win.loadURL(`file://${__dirname}/view/index.html`);

    win.on('closed', () => {
        win = null;
    });

    routes(win);
}

app.on('resize',()=>{
   console.log(win.getSize())
});

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