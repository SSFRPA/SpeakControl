// globalThis.sleep_mode = false
export function run(text, modules, current_mode) {
    if (text == "命令模式") {
        globalThis.current_mode.mode = "command"
        globalThis.current_mode.module = null
        // globalThis.sleep_mode = false
    } else {

        modules.forEach(element => {
            if (element.command_name == text) {
                globalThis.current_mode.mode = "lock"
                globalThis.current_mode.module = element.module
            }
        });
    }

}
