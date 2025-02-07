// console.log(pid)
export function run(text) {
    let num = extractNumber(text);
    if (isNumeric(num)) {
        if (num > 65) {
            num = 65;
        }
        // for (let index = 0; index < num; index++) {
        // ssf.Input.scroll(-index,ssf.enums.Axis.Vertical)
        const volumeValue = Math.floor((num / 100) * 65535);
        ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", [
            "setsysvolume",
            `${volumeValue}`,
        ]);

        // }
    } else {
        console.log("必须以数字结尾,比如设置音量3");
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
        console.log("必须以数字结尾,比如设置音量3");
        return "ERROR";
    }

    // 如果找到数字，将它们转换为数字类型并返回第一个匹配项
    // 如果需要所有数字，可以返回整个数组
    return parseInt(matches[0], 10); // 这里只取第一个匹配到的数字
}
