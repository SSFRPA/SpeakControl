import { basename } from "https://deno.land/std@0.182.0/path/mod.ts";
import * as util from "./kg_until.ts";

ssf.Frame.init();

function set_foucs(hwnd, path) {
    ssf.Windows.set_foreground_window(hwnd);
    ssf.Windows.switch_to_this_window(hwnd);
    ssf.ElementExt.parse(hwnd, path, 2000).try_focus();
    ssf.Sys.sleep(200);
    ssf.Windows.show_window(hwnd, ssf.enums.CmdShow.SW_MAXIMIZE);
    ssf.Sys.sleep(200);
}
export function run(text) {
    try {
        let app = null;
        // console.log(find_task_bar2)
        try {
            app = util.find_task_bar2("酷狗音乐", "桌面歌词", 1000);
        } catch (err) {
            console.log(err);
            //
        }
        // if (!app) {
        //     ssf.Windows.run(browser_path, []);
        //     ssf.Sys.sleep(1000);
        //     chrome_app = ssf.ElementExt.find_task_bar("Edge"等, 1000);
        // }
        const app_hwnd = app.native_window_handle();
        console.log(app.name());
        set_foucs(app_hwnd, "/");
        try {
            // const hide_music = ssf.ElementExt.parse(
            //     app_hwnd,
            //     "/Custom[1]/Custom/Custom/Custom[2]/Custom/Button[7]",
            //     5000,
            // );
            const hide_music = util.recursiveTraversal(
                app,
                ["收起歌曲详情页"],
                "Button",
            );

            if (
                hide_music.name().indexOf("收起歌曲详情页") > -1 &&
                !hide_music.is_offscreen()
            ) {
                hide_music.click();
            }
        } catch (error) {
        }
     

        ssf.ElementExt.parse(app_hwnd,'/Custom[2]/Custom[13]/Custom[6]/Custom[1]/Custom[2]/Custom[1]',5000).click();
    } catch (error) {
        console.log(error);
    }
}

// run("")
