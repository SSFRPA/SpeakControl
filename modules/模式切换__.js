export function run(text, modules, current_mode) {
    if (text == "命令模式") {
        current_mode.mode = "command"
        current_mode.module = null
    } else {

        modules.forEach(element => {
            if (element.command_name == text) {
                current_mode.mode = "lock"
                current_mode.module = element.module
            }
        });
    }

}
