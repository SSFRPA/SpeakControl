import * as util from "./util.js";

//用于判断是否触发W持续按键
globalThis.WBreak = false
export function run(text) {
    globalThis.WBreak = true;
    //每200毫秒触发一次 需要更短的按键可以设置更小
    const intervalId=setInterval(() => {
        ssf.Input.key(ssf.enums.KeyCode.W, ssf.enums.Direction.Click)
        if(globalThis.WBreak==false){
            clearInterval(intervalId)
        }

    }, 200)



}

