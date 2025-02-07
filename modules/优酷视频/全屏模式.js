import { basename } from "https://deno.land/std@0.182.0/path/mod.ts";
ssf.Frame.init();

function set_foucs(hwnd, path) {
    ssf.Windows.set_foreground_window(hwnd);
    ssf.Windows.switch_to_this_window(hwnd);
    ssf.ElementExt.parse(hwnd, path, 2000).try_focus();
    ssf.Sys.sleep(200);
    ssf.Windows.show_window(hwnd, ssf.enums.CmdShow.SW_MAXIMIZE);
    // ssf.Windows.set_window_pos(hwnd,0,0,1920,1080,ssf.enums.WndInsertAfter.HWND_TOP,ssf.enums.SetwindowposFlags.SWP_SHOWWINDOW)

    ssf.Sys.sleep(200);
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
        // console.log("必须以数字结尾,比如设置央视频道1套");

        return 1;
    }

    // 如果找到数字，将它们转换为数字类型并返回第一个匹配项
    // 如果需要所有数字，可以返回整个数组
    return parseInt(matches[0], 10); // 这里只取第一个匹配到的数字
}

export function run(text) {
    const num = extractNumber(text);
    if (!isNumeric(num)) {
        num = 1;
        console.log("播放视频后面的指令只能是数字");
    }

    try {
        let chrome_app = null;
        try {
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000);
        } catch (_) {
            //
        }

        const edge_hwnd = chrome_app.native_window_handle();
        set_foucs(edge_hwnd, "/");
        const tabinfo = ssf.Browser.current_tab(10000);
        if (tabinfo.url.indexOf("v.youku.com/v_show") > 0) {
            const listhtml = ssf.Browser.getHTML(
                tabinfo.id,
                '//*[@id="ykPlayer"]',
                3000,
            );
            //    const pos= ssf.Browser.getPosition(
            //         tabinfo.id,
            //         `//*[@id="ykPlayer"]`,
            //         3000,
            //     );
            // ssf.Input.move(pos.x,)
            const chrome_pos = chrome_app.bounding_rectangle();
            const play_pos = ssf.Browser.getPosition(
                tabinfo.id,
                '//*[@id="ykPlayer"]',
                3000,
            );
            console.log(
                play_pos,
                chrome_pos,
                chrome_pos.x + play_pos.x + play_pos.w / 2,
                chrome_pos.y + play_pos.y + play_pos.h / 2,
            );
            ssf.Input.move(
                chrome_pos.x + play_pos.x + play_pos.w / 2,
                chrome_pos.y + play_pos.y + play_pos.h / 2,
                ssf.enums.Coordinate.Abs,
            );
            ssf.Sys.sleep(500)
            // console.log(ssf.Browser.getHTML(
            //     tabinfo.id,
            //     `//*[@id="fullscreen-icon"]`,
            //     30000,
            // ));
            // ssf.Browser.mousemove(tabinfo.id,'//*[@id="ykPlayer"]',3000)
            if (listhtml) {
                // ssf.Browser.click(
                //     tabinfo.id,
                //     `//*[@id="fullscreen-icon"]`,
                //     30000,
                // );
                // console.log(listhtml);
                ssf.Input.button(ssf.enums.Button.Left,ssf.enums.Direction.Click)
                ssf.Sys.sleep(10)
                ssf.Input.button(ssf.enums.Button.Left,ssf.enums.Direction.Click)

            }
        }
    } catch (error) {
        console.log(error);
    }
}

// ssf.Browser.listen();
// run("1");
