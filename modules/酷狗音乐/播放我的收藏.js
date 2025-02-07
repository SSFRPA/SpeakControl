import { basename } from "https://deno.land/std@0.182.0/path/mod.ts";
import * as util from "./kg_until.ts";

// ssf.Frame.init();

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
        // ssf.Input.move(0,0,ssf.enums.Coordinate.Abs)

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
                hide_music &&
                hide_music.name().indexOf("收起歌曲详情页") > -1 &&
                !hide_music.is_offscreen()
            ) {
                hide_music.click();
            }
        } catch (error) {
        }
        // ssf.Sys.sleep(2000)
        // ssf.ai.OCR.init_model("./models/ppocrv4/");
        // ssf.ai.OCR.init_model("./models/ppocrv4server/");
        //耗时统计
        // const start_time = new Date().getTime();
        const find_my_collect = util.det_text(app, "我的收藏");
        // const end_time = new Date().getTime();
        // console.log("耗时", end_time - start_time, "ms");
        // console.log(find_my_collect);

        if (find_my_collect.length > 0) {
            console.log("找到我的收藏");
            // find_my_collect[0].click();
            let pos1 = find_my_collect[0];
            ssf.Input.move(
                pos1.x + pos1.w / 2,
                pos1.y + pos1.h / 2,
                ssf.enums.Coordinate.Abs,
            );
            ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click);

            ssf.Sys.sleep(1000);
            const play = util.recursiveTraversal(app, ["播放"], "Button");
            if (play.name().indexOf("播放") > -1) {
                play.click();
            }
        } else {
            console.log("未找到我的收藏");
        }
        // const listitem = ssf.ElementExt.parse(
        //     app_hwnd,
        //     "/Custom[1]/Tab[8]/Custom[1]/Custom[1]/Pane[3]/List/ListItem[16]",
        //     5000,
        // );
        // const listitem =util.recursiveTraversal_value(app,["我的收藏"],"ListItem")

        // if (listitem && listitem.control_type() == "ListItem") {
        //     listitem.click();
        // ssf.Sys.sleep(1000);
        // const play = ssf.ElementExt.parse(
        //     app_hwnd,
        //     "/Custom[1]/Tab[8]/Custom[1]/Custom/Custom/Custom[2]/Tab/Custom[5]/Custom/Custom[1]/Custom[2]/Button[5]",
        //     5000,
        // );

        // }
    } catch (error) {
        console.log(error);
    }
}

// run("");
