/**
 * Created by eason on 16-10-21.
 */
const StateTransform = require('./state-transform');
const {token,keywords,wenfa} = require('./state-graph');
const GrammerTree = require('./grammer-tree');

class Parser{
    static parseCi(source,method,callback){
        let tagStateTransform = new StateTransform(token,method);
        let result = '';
        this.data = [];

        for(let i=0,j=0;i<source.length;i++){
            let r = tagStateTransform.transform(source.charAt(i));
            if(r=='W') continue;
            else if(r=='U') return callback('can not match!');
            else{
                let str = source.substr(j,i-j),value='_';
                j = i--;

                if(r=='id'&&-1!=keywords.indexOf(str)) r=str;
                else if(r=='NUM'||r=='OCT'||r=='HEX') value=str;
                result+=str+'-----< '+r+', '+value+' >\n';
                this.data.push([r,value]);
                tagStateTransform.reset();
            }
        }

        callback(result);
    }

    static parseWen(callback){
        let grammerTree = new GrammerTree(wenfa);
        grammerTree.startAnalyse(Parser.data);
    }

    static transGraph(callback){
        let result = '';
        for(let index_s in token.T){
            for(let index_i in token.T[index_s]){
                result += token.S[index_s]+' + [ '+token.I[index_i]+' ] = '+token.S[token.T[index_s][index_i]]+'\n';
            }
        }
        callback(result);
    }
}

module.exports = Parser;


