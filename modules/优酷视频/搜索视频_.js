import { basename } from "https://deno.land/std@0.182.0/path/mod.ts";


function set_foucs(hwnd, path) {
    ssf.Windows.set_foreground_window(hwnd);
    ssf.Windows.switch_to_this_window(hwnd);
    ssf.ElementExt.parse(hwnd, path, 2000).try_focus();
    ssf.Sys.sleep(200);
    ssf.Windows.show_window(hwnd, ssf.enums.CmdShow.SW_MAXIMIZE);
    // ssf.Windows.set_window_pos(hwnd,0,0,1920,1080,ssf.enums.WndInsertAfter.HWND_TOP,ssf.enums.SetwindowposFlags.SWP_SHOWWINDOW)

    ssf.Sys.sleep(200);
}

function get_hwnd_with_task_title(app_path, title) {
    const filename = basename(app_path);
    let ele = null;
    //   let pid = ssf.Windows.find_process(filename)
    try {
        ele = ssf.ElementExt.find_task_bar(title, 1000);
    } catch (error) {
        console.log(error);
    }
    if (!ele) {
        const pid = ssf.Windows.run(app_path, []);
        ssf.Sys.sleep(2000);
        ele = ssf.ElementExt.find_task_bar(title, 3000);
    }
    //   if (pid == 0) {
    //     //没有该进程,尝试启动
    //     pid = ssf.Windows.run(app_path, [])
    //     ssf.Sys.sleep(2000)
    //   }
    //   const ele=ssf.ElementExt.find_task_bar(title,3000)
    if (ele) {
        set_foucs(ele.native_window_handle(), "/");
    }
    return ele;
    //   return find_ele_with_pid(pid)?.native_window_handle()
}
function find_ele_with_pid(target_pid) {
    const childs = ssf.ElementExt.get_root_element().childs();
    for (const child_ele of childs) {
        console.log(child_ele.process_id(), target_pid);
        if (child_ele.process_id() == target_pid) {
            return child_ele;
            // console.log("找到目标程序", child_ele.name())
        }
    }
}
function recursiveTraversal(element, names, control_type) {
    if (element) {
        // console.log(element.name())
        for (const name of names) {
            if (element.name().startsWith(name)) {
                if (control_type != "") {
                    if (element.control_type().startsWith(control_type)) {
                        console.log(element.control_type(), control_type);
                        return element;
                    }
                } else {
                    return element;
                }
            }
        }

        const children = element.childs();
        for (const child of children) {
            const foundElement = recursiveTraversal(child, names, control_type);
            if (foundElement !== null) {
                return foundElement;
            }
        }
    }
    return null;
}

export function run(text) {
    try {
        const browser_path =
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

        let chrome_app = null;
        try {
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000);
        } catch (_) {
            //
        }
        if (!chrome_app) {
            ssf.Windows.run(browser_path, []);
            ssf.Sys.sleep(1000);
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000);
        }
        const edge_hwnd = chrome_app.native_window_handle();
        set_foucs(edge_hwnd,"/");
        const tid = ssf.Browser.create_tab(`https://so.youku.com/search_video/q_${text}`, 10000).id;
        
    } catch (error) {
        console.log(error);
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
        console.log("必须以数字结尾,比如设置央视频道1套");

        return "ERROR";
    }

    // 如果找到数字，将它们转换为数字类型并返回第一个匹配项
    // 如果需要所有数字，可以返回整个数组
    return parseInt(matches[0], 10); // 这里只取第一个匹配到的数字
}
// ssf.Browser.listen()
// run("新白娘子传奇");
