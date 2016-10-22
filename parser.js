/**
 * Created by eason on 16-10-21.
 */
const StateTransform = require('./state-transform');
const Token = require('./state-graph').token;
const Keywords = require('./state-graph').keywords;

class Parser{
    static parseCi(source,method){
        let tagStateTransform = new StateTransform(Token,method);

        for(let i=0,j=0;i<source.length;i++){
            let r = tagStateTransform.transform(source.charAt(i));
            if(r=='W') continue;
            else if(r=='U'){
                if(i!=source.length-1)
                    console.log('can not match!');
                else console.log('exit');
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
                    console.log(str+'  < '+r+' , '+value+' >');
                }else if(r=='NUM'||r=='OCT'||r=='HEX') console.log(str+'  < '+r+' , '+str+' >');
                else console.log(str+'  < '+r+', _ >');
                tagStateTransform.reset();
            }
        }
    }
}

module.exports = Parser;


