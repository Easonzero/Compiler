/**
 * Created by eason on 16-10-30.
 */
const wordController = require('./word-controller');
const grammerController = require('./grammer-controller')
angular.module('display').config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: './app/word-parse.html',
        controller: wordController
    }).
    when('/word', {
        templateUrl: './app/word-parse.html',
        controller: wordController
    }).
    when('/grammer', {
        templateUrl: './app/grammer-parse.html',
        controller: grammerController
    }).otherwise({redirectTo:'/'});
});

