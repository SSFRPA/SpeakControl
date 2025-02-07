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
            const hide_music = ssf.ElementExt.parse(
                app_hwnd,
                "/Custom[1]/Custom/Custom/Custom[2]/Custom/Button[7]",
                5000,
            );
            if (
                hide_music.name().indexOf("收起歌曲详情页") > -1 &&
                !hide_music.is_offscreen()
            ) {
                hide_music.click();
            }
        } catch (error) {
        }
        let edit =  ssf.ElementExt.parse(app_hwnd,'/Custom[2]/Custom[8]/Edit',5000)
       
        // if (edit.control_type() != "Edit") {
        //     edit =  ssf.ElementExt.parse(app_hwnd,'/Custom[2]/Custom[8]/Edit',5000)
          
        // }
        // ssf.ElementExt.parse(app_hwnd,'/Custom[1]/Tab[8]/Custom[1]/Custom/Custom/Custom[2]/Tab/Custom[5]/Custom/Custom[1]/Custom[2]/Button[5]',5000)

        edit.click();

        for (let index = 0; index < 50; index++) {
            ssf.Input.key(
                ssf.enums.KeyCode.Backspace,
                ssf.enums.Direction.Click,
            );
        }
        edit.send_keys(`${text}{Enter}`, 20);
        ssf.Sys.sleep(1000);
        const play_all = util.recursiveTraversal(app, ["播放全部"], "Button");

        // const play_all = ssf.ElementExt.parse(
        //     app_hwnd,
        //     "/Custom[1]/Tab[8]/Custom[1]/Custom/Custom/Custom/Document/Group/Group/Group/Group/Custom/Document/Group/Group/Custom/Group[1]/Group[1]/Group[1]/Button/Group/Text",
        //     5000,
        // );
        if (play_all.name().indexOf("播放全部") > -1) {
            play_all.click();
        }
    } catch (error) {
        console.log(error);
    }
}

// run("中国人");
