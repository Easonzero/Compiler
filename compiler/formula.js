/**
 * Created by eason on 16-10-29.
 */
class Formula {
    constructor(wenfa){
        this.formula = wenfa;
        if (!this.judgement()){
            console.log('exit');
        }
    }

    judgement(){
        //判断文法中是不是含有"->"，若没有则报错
        if (-1 == this.formula.indexOf("->")){
            console.log(`错误：文法"${this.formula}"中不包含\"->"`);
            return false;
        }else{
            //如果"->"前或后存在空，报错
            if (0 == this.formula.split("->")[0].length || 0 == this.formula.split("->")[1].length){
                console.log(`错误：文法"${this.formula}"中不"->"前或后为空`);
                return false;
            }
            //存在多个->时报错
            if (this.formula.split("->").length > 2){
                console.log(`错误：文法"${this.formula}"中存在大于一个的"->"`)
                return false;
            }
        }
        return true;
    }
    //分离候选项
    static splitFormula(formula_str){
        let formulas = [];
        let fma = new Formula(formula_str);
        let strs = fma.getRight().split("|");
        //console.log(strs.length);
        for (let i = 0; i < strs.length; i++){
            let newfam = fma.getLeft() + "->" + strs[i];
            formulas.push(new Formula(newfam));
        }
        return formulas;
    }
    //获取左部
    getLeft(){
        return this.formula.split("->")[0];
    }
    //获取右部
    getRight(){
        return this.formula.split("->")[1];
    }
    //重写toString
    toString(){
        return this.formula;
    }
    //获取右部的候选词数量
    getRigthsize(){
        return this.getRight().split(" ").length;
    }
    //通过索引检索右部
    getRightIndex(index){
        return this.getRight().split(" ")[index];
    }
}

module.exports = Formula;