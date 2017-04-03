/**
 * Created by eason on 16-10-30.
 */
angular.module('chart',[]);
angular.module('display',['ngRoute','ngMaterial']);
let app = angular.module('app', ['ngMaterial','display','chart']);

require('./app/display');
require('./factory/chart-tree-factory');
const {ipcRenderer} = require('electron');
const fs = require('fs');

app.controller('appCtrl', ($scope,$mdSidenav)=>{
    $scope.toggleLeft = (e)=>{
        $mdSidenav('left').toggle();
    };

    $scope.back = (e)=>{
        ipcRenderer.send('close');
    };
});

app.directive('ngResize', ['$window', function($window) {
    return {
        restrict : "A",
        link: function(scope, elem, attrs) {
            scope.onResize = function(element,precent) {
                element.css('height',($window.innerHeight*precent-50)+'px');
            };
            scope.onResize(elem,attrs.hprecent);
            angular.element($window).bind('resize', function() {
                scope.onResize(elem,attrs.hprecent);
            });
        }
    }
}]);

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

app.directive("ngTreeChart", function($window,TreeChartFactory) {
    return {
        restrict : "EA",
        scope:{chartData:'=chartData'},
        link: function(scope, element, attrs) {
            scope.$watch('chartData', function(nv){
                if(!nv) return;
                TreeChartFactory.render(element[0],nv,$window.innerHeight-96,$window.innerWidth);
            });
        }
    };
});
