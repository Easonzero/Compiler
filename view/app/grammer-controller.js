/**
 * Created by eason on 16-10-31.
 */
const {ipcRenderer} = require('electron');

module.exports = function($scope){
    ipcRenderer.send('grammerResult');
    ipcRenderer.send('first');
    ipcRenderer.send('follow');
    ipcRenderer.send('predictMap');

    ipcRenderer.on( 'reply', (event, result)=>{
        switch(result.e){
            case 'grammerResult':
                $scope.grammerResult = result.m;
                break;
            case 'first':
                $scope.first = result.m;
                break;
            case 'follow':
                $scope.follow = result.m;
                break;
            case 'predictMap':
                $scope.predictMap = result.m;
                break;
        }
        $scope.$apply();
    });
};