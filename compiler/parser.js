/**
 * Created by eason on 16-10-21.
 */
const StateTransform = require('./state-transform');
const Token = require('./state-graph').token;
const Keywords = require('./state-graph').keywords;

class Parser{
    static parseCi(source,method,callback){
        let tagStateTransform = new StateTransform(Token,method);
        let result = '';

        for(let i=0,j=0;i<source.length;i++){
            let r = tagStateTransform.transform(source.charAt(i));
            if(r=='W') continue;
            else if(r=='U'){
                if(i!=source.length-1)
                    callback('can not match!');
                else {
                    callback(result);
                }
                break;
            }
            else{
                let str = source.substr(j,i-j);
                j = i--;
                if(r=='IDN'){
                    let value = str;
                    for(let keyword of Keywords){
                        if(keyword == str){
                            value='_';
                            r=keyword.toUpperCase();
                        }
                    }
                    result+=str+'-----< '+r+', '+value+' >\n';
                }else if(r=='NUM'||r=='OCT'||r=='HEX') result += str+'-----< '+r+' , '+str+' >\n';
                else result+=str+'-----< '+r+', _ >\n';
                tagStateTransform.reset();
            }
        }
    }

    static transGraph(callback){
        let result = '';
        for(let index_s in Token.T){
            for(let index_i in Token.T[index_s]){
                result += Token.S[index_i]+' + [ '+Token.I[index_i]+' ] = '+Token.S[Token.T[index_s][index_i]]+'\n';
            }
        }
        callback(result);
    }
}

module.exports = Parser;


