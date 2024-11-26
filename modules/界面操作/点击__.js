


export function run(text) {
    if (globalThis.det_pid) {
        ssf.Windows.kill_process(globalThis.det_pid)

    }
    ssf.Sys.sleep(500)
    let num = extractNumber(text)
    if (isNumeric(num)) {

        num = num - 1
        ssf.Input.move(globalThis.det_data[num].x, globalThis.det_data[num].y, ssf.enums.Coordinate.Abs)
        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click)
    }
    // console.log(num, text)


}


function back_text(text) {
    const num = chineseToNumber(text)
    for (let index = 0; index < num; index++) {
        ssf.Input.key(ssf.enums.KeyCode.Backspace, ssf.enums.Direction.Click)

    }


}

function isNumeric(str) {
    const num = parseFloat(str);
    return !isNaN(num) && Number.isFinite(num);
}

function extractNumber(text) {
    // 使用正则表达式查找所有数字
    const matches = text.match(/\d+/g);

    // 如果没有找到数字，返回提示信息
    if (!matches) {
        console.log("回退的只能是数字,比如回退5")
        return "ERROR"

    }

    // 如果找到数字，将它们转换为数字类型并返回第一个匹配项
    // 如果需要所有数字，可以返回整个数组
    return parseInt(matches[0], 10); // 这里只取第一个匹配到的数字
}

