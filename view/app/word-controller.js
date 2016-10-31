/**
 * Created by eason on 16-10-31.
 */
const fs = require('fs');
const {ipcRenderer} = require('electron');

module.exports = function($scope){
    $scope.run = function(){
        let s = $scope.test.replace(/[\r\n]/g,'')+'\n';
        ipcRenderer.send('token',s);
        ipcRenderer.send('transGraph');
    };

    $scope.readFile = function(event){
        let file = event.dataTransfer.files[0];
        if(file){
            fs.readFile(file.path,'utf8',function(err,data){
                $scope.test = data;
            });
        }
    };

    ipcRenderer.on( 'reply', (event, result)=>{
        switch(result.e){
            case 'token':
                $scope.token = result.m;
                break;
            case 'transGraph':
                $scope.graph = result.m;
                break;
        }
        $scope.$apply();
    });
};