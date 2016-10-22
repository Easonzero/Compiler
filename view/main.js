/**
 * Created by eason on 16-10-22.
 */
const fs = require('fs');
const {ipcRenderer} = require('electron');

let holder = document.getElementById('holder');
let back = document.getElementById('back');
let run = document.getElementById('run');
let tf_token = document.getElementById('tf-token');

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
    console.log(holder.value);
    ipcRenderer.send('run',holder.value);
};

ipcRenderer.on( 'reply', (event, result)=>{
    switch(result.e){
        case 'run':
            tf_token.innerText = result.m;
            break;
    }
});

