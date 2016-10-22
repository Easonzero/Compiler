/**
 * Created by eason on 16-10-22.
 */
const parser = require('../compiler/parser');

exports.run = function(req,callback){
    parser.parseCi(req.msg,'DFA',callback);
};