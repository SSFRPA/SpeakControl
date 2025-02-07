globalThis.sleep_mode = false
export function run(text, modules, current_mode) {
    if (text == "命令模式") {
        current_mode.mode = "command"
        current_mode.module = null
        globalThis.sleep_mode = false
    } else {

        modules.forEach(element => {
            if (element.command_name == text) {
                current_mode.mode = "lock"
                current_mode.module = element.module
            }
        });
    }

}
