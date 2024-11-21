import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.221.0/path/mod.ts";



function close_task() {
    const childs = ssf.ElementExt.get_root_element().childs()
    childs.forEach(element => {
        const p = ssf.Sys.process_info(element.process_id())
        const p_name = basename(p.exe)
        if (p_name.toLowerCase().indexOf("explorer.exe") == -1) {

            if (element.name().toLowerCase().indexOf("voice_control.exe") == -1) {
                ssf.Windows.kill_process(element.process_id())
            }
        } else {
            if (element.name() != "任务栏") {
                try {
                    element.close()
                } catch (_) {
                    _
                }
            }


        }


    });



}

export function run(text) {
    close_task()
}

