/**
 * Created by eason on 16-10-22.
 */
const fs = require('fs');
const {ipcRenderer} = require('electron');

let holder = document.getElementById('holder');
let back = document.getElementById('back');
let run = document.getElementById('run');
let tf_token = document.getElementById('tf-token');
let tf_transform = document.getElementById('tf-transform');

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

back.onclick = function(e){
    ipcRenderer.send('close');
};

run.onclick = function(e){
    ipcRenderer.send('token',holder.value);
    ipcRenderer.send('transGraph');
};

ipcRenderer.on( 'reply', (event, result)=>{
    switch(result.e){
        case 'token':
            tf_token.innerText = result.m;
            break;
        case 'transGraph':
            tf_transform.innerText = result.m;
            break;
    }
});

