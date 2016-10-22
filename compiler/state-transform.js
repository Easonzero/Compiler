/**
 * Created by eason on 16-10-21.
 */
class StateTransform{
    constructor(stateList,method){
        this.states = stateList.S;//[*,...]
        this.input = stateList.I;//[[*,...],...]
        this.start = stateList.SS;//number
        this.final = stateList.FS;//[number,...]
        this.current = this.start;//number

        if(method == 'DFA')
            this.transition = stateList.T;//{current:{input:result,...},...}
        else if(method == 'NFA'){
            console.log('not support');
        }else console.log('method is not DFA | NFA');
    }

    transform(i){
        for(let I in this.input){
            for(let _i of this.input[I]){
                if(_i === i&&this.transition[this.current]&&this.transition[this.current][I]){
                    this.current = this.transition[this.current][I];
                    return 'W';
                }
            }
        }

        for(let f of this.final){
            if(f == this.current){
                return this.states[this.current];
            }
        }

        return 'U';
    }

    reset(){
        this.current = this.start;
    }

    // closure(T){
    //     let stack = [],cT = [];
    //     for(let t of T){
    //         stack.push(t);
    //         cT.push(t);
    //     }
    //     while(stack.length!==0){
    //         let t = stack.pop();
    //     }
    // }
}

module.exports = StateTransform;