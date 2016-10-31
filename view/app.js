/**
 * Created by eason on 16-10-30.
 */
const {ipcRenderer} = require('electron');
const fs = require('fs');

angular.module('display',['ngRoute','ngMaterial']);
let app = angular.module('app', ['ngMaterial','display']);

app.controller('appCtrl', ($scope,$mdSidenav)=>{
    $scope.toggleLeft = (e)=>{
        $mdSidenav('left').toggle();
    };

    $scope.back = (e)=>{
        ipcRenderer.send('close');
    };
});

app.directive("ngDrop", function($parse) {
    return {
        restrict : "A",
        link: function(scope, element, attrs) {
            var fn = $parse(attrs['ngDrop'], null,true);
            element.on('dragover dragend dragleave',(e)=>{return false;});
            element.on('drop',(e)=>{
                e.preventDefault();
                scope.$apply(()=>{fn(scope, {$event:event});});
                return false;
            })
        }
    };
});

require('./app/display');
