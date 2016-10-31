/**
 * Created by eason on 16-10-31.
 */
const fs = require('fs');
const {ipcRenderer} = require('electron');

module.exports = function($scope,$mdToast){
    $scope.run = function(){
        let s = $scope.test;
        if(s.charAt(s.length-1)!='\n') s = s+'\n';
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
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('编译器分析完成！')
                        .position('right start')
                        .hideDelay(500)
                );
                break;
            case 'transGraph':
                $scope.graph = result.m;
                break;
        }
        $scope.$apply();
    });
};