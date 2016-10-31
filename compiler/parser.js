/**
 * Created by eason on 16-10-21.
 */
const StateTransform = require('./state-transform');
const {token,keywords,wenfa} = require('./state-graph');
const GrammerTree = require('./grammer-tree');
const {dialog} = require('electron');

class Parser{
    static parseCi(source,method,callback){
        let tagStateTransform = new StateTransform(token,method);
        this.wordResult = [];

        for(let i=0,j=0;i<source.length;i++){
            let r = tagStateTransform.transform(source.charAt(i));
            if(r=='W') continue;
            else if(r=='U') {
                let value = source.substr(j, i - j);
                return dialog.showMessageBox({
                    type: 'error',
                    title: '词法解析器报错',
                    message: `Error at '${value}'`,
                    buttons: []
                });
            }
            else{
                let value = source.substr(j,i-j);
                j = i--;

                if(r=='id'&&-1!=keywords.indexOf(value)) r=value;
                this.wordResult.push([r,value]);
                tagStateTransform.reset();
            }
        }

        this.parseWen();
        callback(this.wordResult);
    }

    static parseWen(){
        let grammerTree = new GrammerTree(wenfa);

        grammerTree.startAnalyse(Parser.wordResult);

        this.first = grammerTree.firstSet;
        this.follow = grammerTree.followSet;
        this.predictMap = grammerTree.M;
        this.grammerResult = grammerTree.result;
    }

    static printFirst(callback){
        let result = [];
        for(let i in this.first){
            let e = [];
            e[0] = i;
            e[1] = '(';
            for(let j of this.first[i]){
                e[1] += j+',';
            }
            e[1] += ')';
            result.push(e);
        }
        callback(result);
    }

    static printFollow(callback){
        let result = [];
        for(let i in this.follow){
            let e = [];
            e[0] = i;
            e[1] = '(';
            for(let j of this.follow[i]){
                e[1] += j+',';
            }
            e[1] += ')';
            result.push(e);
        }
        callback(result);
    }

    static printPredictMap(callback){
        let result = [];
        for(let i in this.predictMap){
            let e = [];
            e[0] = i;
            e[1] = this.predictMap[i].formula;
            result.push(e);
        }
        callback(result);
    }

    static printGrammerResult(callback){
        callback(this.grammerResult);
    }

    static transGraph(callback){
        let result = [];
        for(let index_s in token.T){
            for(let index_i in token.T[index_s]){
                result.push(token.S[index_s]+' + [ '+token.I[index_i]+' ] = '+token.S[token.T[index_s][index_i]]);
            }
        }
        callback(result);
    }
}

module.exports = Parser;


