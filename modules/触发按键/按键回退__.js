export function run(text) {
    if (isNumeric(text)) {
        for (let index = 0; index < parseInt(text); index++) {
            ssf.Input.key(ssf.enums.KeyCode.Backspace, ssf.enums.Direction.Click)
        }
    } else {
        console.log("回退的只能是数字,比如回退5")
    }
}

function isNumeric(str) {
    const num = parseFloat(str);
    return !isNaN(num) && Number.isFinite(num);
}