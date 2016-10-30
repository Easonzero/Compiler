/**
 * Created by eason on 16-10-22.
 */
window.$ = require('jquery');
const fs = require('fs');
const {ipcRenderer} = require('electron');

let holder = $('#holder');
let back = $('#back');
let run = $('#run');
let tf_token = $('#tf-token');
let tf_transform = $('#tf-transform');
let bt_cifa = $('#cifa');
let bt_wenfa = $('#wenfa');

holder.ondragover = function () {
    return false;
};
holder.ondragleave = holder.ondragend = function () {
    return false;
};
holder.ondrop = function (e) {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    if(file){
        fs.readFile(file.path,'utf8',function(err,data){
            holder.value = data;
        });
    }
    return false;
};

bt_cifa.click((e)=>{
    $('#content--wen').addClass('disappear');
    $('#tab--wen').addClass('disappear');
    $('#content--ci').removeClass('disappear');
    $('#tab--ci').removeClass('disappear');
});

bt_wenfa.click((e)=>{
    $('#content--ci').addClass('disappear');
    $('#tab--ci').addClass('disappear');
    $('#content--wen').removeClass('disappear');
    $('#tab--wen').removeClass('disappear');
});

back.click((e)=>{
    ipcRenderer.send('close');
});

run.click((e)=>{
    let s = holder.value.replace(/[\r\n]/g,'')+'\n';
    ipcRenderer.send('token',s);
    ipcRenderer.send('transGraph');
});

ipcRenderer.on( 'reply', (event, result)=>{
    switch(result.e){
        case 'token':
            tf_token.text(result.m);
            break;
        case 'transGraph':
            tf_transform.text(result.m);
            break;
    }
});

