/**
 * Created by eason on 16-10-22.
 */
const {ipcMain} = require('electron');
const {close} = require('./controller/base-controller');
const {run} = require('./controller/compiler-controller');
/**
 * Created by eason on 6/2/16.
 */
let routes = {
    'close':close,
    'run':run
};

module.exports = (win) => {
    for(let url in routes){
        ipcMain.on(url, (event, msg) => {
            routes[url]({win:win,msg:msg},(m)=>event.sender.send('reply', {e:url,m:m}));
        });
    }
};