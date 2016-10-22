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