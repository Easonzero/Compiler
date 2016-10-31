/**
 * Created by eason on 16-10-29.
 */
const Formula = require('./formula');
const {dialog} = require('electron');

class GrammerTree{
    constructor(wenfa){
        //开始符号
        this.startSymbol = "";
        //文法集
        this.formulas = [];
        //终结符集
        this.terSymbols = [];
        //非终结符集
        this.noSymbols = [];
        //所有符号集
        this.allSymbol = [];
        //first集的判断
        this.judgefirst = {};
        //first集
        this.firstSet = {};
        //右部first集
        this.rightFirst = {};
        //follow集判断
        this.judgefollow = {};
        //follow集
        this.followSet = {};
        //预测分析表
        this.M = {};
        //分析结构
        this.result = {};
        //readFormula

        for (let i=0;i < wenfa.length;i++){
            if (0 == i){
                //初始化开始符号
                this.startSymbol = wenfa[0].split("->")[0];
            }
            if (wenfa[i].indexOf("|") != -1){
                //添加复杂产生式
                this.addFormulas(wenfa[i]);
            }else{
                this.formulas.addNewelement(new Formula(wenfa[i]));
            }
        }
        this.init();
    }

    addFormulas(str_fromula){
        let fs = Formula.splitFormula(str_fromula);
        for (let i = 0; i < fs.length; i++){
            this.formulas.addNewelement(fs[i]);
        }
    }
    //初始化集合
    init(){
        //初始化非终结符
        for (let i = 0; i < this.formulas.length; i++){
            this.noSymbols.addNewnosymbol(this.formulas[i].getLeft());
        }
        //初始化终结符
        for (let i = 0; i < this.formulas.length; i++){
            for (let j = 0; j < this.formulas[i].getRigthsize(); j++){
                if (-1 == this.noSymbols.indexOf(this.formulas[i].getRightIndex(j))){
                    this.terSymbols.addNewtersymbol(this.formulas[i].getRightIndex(j));
                }
            }
        }
        //将结束标记放入终结符
        this.terSymbols.addNewtersymbol("#");
        //初始化所有符号集
        for (let i = 0; i < this.terSymbols.length; i++){
            this.allSymbol.push(this.terSymbols[i]);
        }
        for (let i = 0; i < this.noSymbols.length; i++){
            this.allSymbol.push(this.noSymbols[i]);
        }
        //初始化FIRST集和FOLLOW集(仅初始化集合的key:符号)
        for (let i = 0; i < this.allSymbol.length; i++){
            let key = this.allSymbol[i];
            this.firstSet[key] = undefined;
            this.judgefirst[key] = false;
            if (this.noSymbols.indexOf(key) != -1){
                this.followSet[key] = undefined;
                this.judgefollow[key] = false;
            }
        }
        //初始化每个符号的FIRST集
        for (let i = 0; i < this.allSymbol.length; i++){
            let key = this.allSymbol[i];
            if (!this.judgefirst[key]){
                //加入FIRST集
                this.firstSet[key]=this.getFirst(key);
            }
        }
        //初始化每个非终结符号的follow集
        for (let i = 0; i < this.noSymbols.length; i++){
            let sym = this.noSymbols[i];
            if(!this.judgefollow[sym]){
                this.followSet[sym] = this.getFollow(sym);
                this.judgefollow[sym] = true;
            }
        }
        //初始化每个formula的follow集
        for (let i = 0; i < this.formulas.length; i++){
            let f = this.formulas[i];
            this.rightFirst[f] = this.getFormulaFirst(f);
        }
        //初始化预测分析表
        this.initM();
    }
    //获取first集
    getFirst(key){
        let first = [];
        let temphash = [];
        if (this.terSymbols.indexOf(key) != -1){
            first.addNewtersymbol(key);
            return first;
        }
        for (let i = 0; i < this.formulas.length; i++){
            let key_formula = this.formulas[i];
            if (key_formula.getLeft()==key){
                if (-1 != this.terSymbols.indexOf(key_formula.getRightIndex(0))){
                    first.addNewtersymbol(key_formula.getRightIndex(0));
                    continue;
                }
                if (0 == key_formula.getRight().localeCompare("@")){
                    first.addNewtersymbol("@");
                    continue;
                }
                let index = 1; //用来判断是不是所有公式都包含@空的情况
                for (let j = 0; j < key_formula.getRigthsize(); j++){
                    let temps = key_formula.getRightIndex(j);
                    if (!this.judgefirst[temps]){
                        this.firstSet[temps] = this.getFirst(temps);
                        this.judgefirst[temps] = true;
                    }
                    for (let m = 0; m < this.firstSet[temps].length; m++){
                        temphash.push(this.firstSet[temps][m]);
                    }
                    let indexofkong = temphash.indexOf("@");
                    while(indexofkong != -1){
                        temphash.splice(indexofkong,1);
                        indexofkong = temphash.indexOf("@");
                    }
                    for (let m = 0; m < temphash.length; m++){
                        first.push(temphash[m]);
                    }
                    if (-1 != this.firstSet[temps].indexOf("@")){
                        index++;
                    }else{
                        break;
                    }
                }
                if (index === this.formulas[i].getRigthsize()){
                    first.push("@");
                }

            }
        }
        return first;
    }
    getFollow(key){
        //定义用来返回的follow集
        let follow = [];
        let temphash = [];
        //把空字符#放入开始符号的FOLLOW集中
        if (this.startSymbol==key){
            follow.addNewtersymbol("#");
        }
        let right,temps;
        //遍历所有文法
        for (let i = 0; i < this.formulas.length; i++){
            let f_formula = this.formulas[i];
            //获得右部
            right = f_formula.getRight();
            //判断右部是否包含key
            if (-1 != right.indexOf(key)){
                for (let j = 0; j < f_formula.getRigthsize(); j++){
                    temps = f_formula.getRightIndex(j);
                    if (temps==key){
                        if (j == f_formula.getRigthsize() - 1){
                            if (0 == f_formula.getLeft().localeCompare(key)){
                                break;
                            }
                            if (!this.judgefollow[f_formula.getLeft()]){
                                this.followSet[f_formula.getLeft()] = this.getFollow(f_formula.getLeft());
                                this.judgefollow[f_formula.getLeft()] = true;
                            }
                            //addall
                            for (let m = 0; m < this.followSet[f_formula.getLeft()].length; m++){
                                follow.addNewtersymbol(this.followSet[f_formula.getLeft()][m]);
                            }
                        }
                        else{
                            let tmp_firstset = this.firstSet[f_formula.getRightIndex(f_formula.getRigthsize() - 1)];
                            if ((j == f_formula.getRigthsize() - 2) && (-1 != tmp_firstset.indexOf("@"))){
                                if (f_formula.getLeft()==key) break;
                                if (!this.judgefollow[f_formula.getLeft()]){
                                    this.followSet[f_formula.getLeft()] = this.getFollow(f_formula.getLeft());
                                    this.judgefollow[f_formula.getLeft()] = true;
                                }
                                //addall
                                for (let m = 0; m < this.followSet[f_formula.getLeft()].length; m++){
                                    follow.addNewtersymbol(this.followSet[f_formula.getLeft()][m]);
                                }
                            }
                            if (-1 != this.terSymbols.indexOf(f_formula.getRightIndex(j + 1))){
                                follow.addNewtersymbol(f_formula.getRightIndex(j + 1));
                            }
                            else{
                                let first_temp = this.firstSet[f_formula.getRightIndex(j + 1)];
                                //addall
                                for (let m = 0; m < first_temp.length; m++){
                                    temphash.addNewtersymbol(first_temp[m]);
                                }
                                let indexoftemp = temphash.indexOf("@");
                                while (-1 != indexoftemp){
                                    temphash.splice(indexoftemp,1);
                                    indexoftemp = temphash.indexOf("@");
                                }
                                //addall
                                for (let m = 0; m < temphash.length; m++){
                                    follow.addNewtersymbol(temphash[m]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return follow;
    }
    //获取一个firmula的first集
    getFormulaFirst(formula){
        //定义用来返回的FIRST集
        let firsts = [];
        let temp = [];
        let bool = false;
        let flag = 0;
        if (formula.getRight()=='@'){
            firsts.addNewtersymbol("@");
            return firsts;
        }
        for (let i = 0; i < formula.getRigthsize(); i++){
            let firstSet_temp = this.firstSet[formula.getRightIndex(i)];
            for (let m = 0; m < firstSet_temp.length; m++){
                temp.addNewtersymbol(firstSet_temp[m]);
            }
            let indexOftemp = temp.indexOf("@");
            while (-1 != indexOftemp){
                bool = true;
                temp.splice(indexOftemp,1);
                indexOftemp = temp.indexOf("@");
            }
            for (let m = 0; m < temp.length; m++){
                firsts.addNewtersymbol(temp[m]);
            }
            flag++;
            if (!bool){
                break;
            }
        }
        if (flag == formula.getRigthsize() && flag > 1){
            firsts.addNewtersymbol("@");
        }
        return firsts;
    }
    //生成预测分析表
    initM(){
        let key;
        for (let i = 0; i < this.formulas.length; i++){
            let f_formula = this.formulas[i];
            for (let j = 0; j < this.terSymbols.length; j++){
                let terSym = this.terSymbols[j];
                if (terSym=='@') continue;
                key = f_formula.getLeft() + terSym;
                if (-1 != this.rightFirst[f_formula].indexOf(terSym)){
                    this.M[key] = f_formula;
                }
            }
            if (-1 != this.rightFirst[f_formula].indexOf("@")){
                for (let k = 0; k < this.terSymbols.length; k++){
                    let ter = this.terSymbols[k];
                    if (0 == ter.localeCompare("@")) continue;
                    key = f_formula.getLeft() + ter;
                    if (-1 != this.followSet[f_formula.getLeft()].indexOf(ter)){
                        this.M[key] = f_formula;
                    }
                }
            }
        }
    }
    //开始分析
    startAnalyse(source){
        if(source.length===0) return;
        let stack = [];
        let keys = [];
        for (let key in this.M){
            keys.push(key);
        }
        let X, index = 0,row = 1,col = 1;
        stack.push("#");
        stack.push(this.startSymbol);
        this.result={value:this.startSymbol,children:[],open:true};
        let p = this.result;
        let flag = true;
        let exit = false;
        let f;
        while (flag){
            if(source[index][0]=='SPACE') {
                index++;
                if(index<source.length) continue;
                else break;
            }else if(source[index][0]=='ENTER') {
                index++;row++;col = 1;
                if(index<source.length) continue;
                else break;
            }
            X = stack.pop();
            if (-1 != this.terSymbols.indexOf(X)){
                if (X==source[index][0]){
                    p.value=`<${source[index][0]},${source[index][1]}>`;
                    p.open=false;
                    while(!p.open){
                        if(p.parent){
                            let rindex = p.parent.children.indexOf(p);
                            if(rindex != p.parent.children.length-1) p = p.parent.children[rindex+1];
                            else {
                                p = p.parent;
                                p.open=false;
                            }
                        }
                        else break;
                    }
                    index++;col++;
                    if (index == source.length) break;
                }
                else{
                    dialog.showMessageBox({
                        type:'error',
                        title:'文法解析器报错',
                        message:`Error at Line [${col==1?row-1:row}]:[Require '${X}' But '${source[index][1]}(${source[index][0]})']`,
                        buttons:[]
                    });
                    return false;
                }
            }
            else if (X=='#'){
                if (X==source[index][0]){
                    flag = false;
                }
                else{
                    dialog.showMessageBox({
                        type:'error',
                        title:'文法解析器报错',
                        message:`Error at Line [${col==1?row-1:row}]:[Not Expected Stopping]`,
                        buttons:[]
                    });
                    return false;
                }
            }
            else{
                exit = false;
                if(this.M[X+source[index][0]]){
                    f = this.M[X+source[index][0]];
                    exit = true;
                }
                if (exit){
                    if(f.getRight()=='@'){
                        p.open=false;
                        while(!p.open){
                            if(p.parent){
                                let rindex = p.parent.children.indexOf(p);
                                if(rindex != p.parent.children.length-1) p = p.parent.children[rindex+1];
                                else {
                                    p = p.parent;
                                    p.open=false;
                                }
                            }
                            else break;
                        }
                        continue;
                    }
                    for (let j = f.getRigthsize() - 1; j >= 0; j--){
                        stack.push(f.getRightIndex(j));
                        p.children.push({value:f.getRightIndex(f.getRigthsize()-1-j),parent:p,children:[],open:true});
                    }
                    if(p.children.length!=0)
                        p=p.children[0];
                }else{
                    dialog.showMessageBox({
                        type:'error',
                        title:'文法解析器报错',
                        message:`Error at Line [${col==1?row-1:row}]:[Not Expected '${source[index][1]}']`,
                        buttons:[]
                    });
                    return false;
                }
            }
        }
        console.log("success!");
        return true;
    }
}

Array.prototype.addNewelement = function(element){
    for (var i = 0; i < this.length; i++){
        if (this[i].formula == element.formula){
            return false;
        }
    }
    this.push(element);
    return true;
};
Array.prototype.addNewtersymbol = function(element){
    for (var i = 0; i < this.length; i++){
        if (this[i] == element){
            return false;
        }
    }
    this.push(element);
    return true;
};
Array.prototype.addNewnosymbol = function(element){
    for (var i = 0; i < this.length; i++){
        if (this[i] == element){
            return false;
        }
    }
    this.push(element);
    return true;
};

module.exports = GrammerTree;