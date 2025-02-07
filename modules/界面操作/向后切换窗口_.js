import * as util from "./util.js";



function isNumeric(str) {
    const num = parseFloat(str);
    return !isNaN(num) && Number.isFinite(num);
}
function extractNumber(text) {
    // 使用正则表达式查找所有数字
    const matches = text.match(/\d+/g);

    // 如果没有找到数字，返回提示信息
    if (!matches) {
        // console.log("必须以数字结尾,比如设置央视频道1套");

        return 1;
    }

    // 如果找到数字，将它们转换为数字类型并返回第一个匹配项
    // 如果需要所有数字，可以返回整个数组
    return parseInt(matches[0], 10); // 这里只取第一个匹配到的数字
}
export function run(text) {
    ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Press)
    ssf.Input.key(ssf.enums.KeyCode.Tab, ssf.enums.Direction.Click)
    const num = extractNumber(text);
    if (!isNumeric(num)) {
        num = 1;
    }
    for (let index = 0; index <= num; index++) {
        ssf.Input.key(ssf.enums.KeyCode.RightArrow, ssf.enums.Direction.Click)
        ssf.Sys.sleep(300)
    }


    ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Release)
    // ssf.Input.key(ssf.enums.KeyCode.Tab, ssf.enums.Direction.Release)

}

