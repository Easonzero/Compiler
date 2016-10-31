/**
 * Created by eason on 16-10-22.
 */
const parser = require('../compiler/parser');

exports.token = function(req,callback){
    parser.parseCi(req.msg,'DFA',callback);
};

exports.transGraph = function(req,callback){
    parser.transGraph(callback);
};

exports.first = function(req,callback){
    parser.printFirst(callback);
};

exports.follow = function(req,callback){
    parser.printFollow(callback);
};

exports.predictMap = function(req,callback){
    parser.printPredictMap(callback);
};

exports.grammerResult = function(req,callback){
    parser.printGrammerResult(callback);
};