/**
 * Created by eason on 16-10-22.
 */
const {ipcMain} = require('electron');
const {close} = require('./controller/base-controller');
const {token,transGraph,first,follow,predictMap,grammerResult} = require('./controller/compiler-controller');
/**
 * Created by eason on 6/2/16.
 */
let routes = {
    'close':close,
    'token':token,
    'transGraph':transGraph,
    'first':first,
    'follow':follow,
    'predictMap':predictMap,
    'grammerResult':grammerResult
};

module.exports = (win) => {
    for(let url in routes){
        ipcMain.on(url, (event, msg) => {
            routes[url]({win:win,msg:msg},(m)=>event.sender.send('reply', {e:url,m:m}));
        });
    }
};