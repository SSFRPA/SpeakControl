
import * as util from "./util.js";

export function run(text) {

    try {
        const main_hwnd = ssf.Windows.find_window("WeChatMainWndForPC", "微信")


        const app = ssf.ElementExt.parse(main_hwnd, "/", 5000);
        //切换为英文输入法
        ssf.ElementExt.set_Ime(0, main_hwnd)

        if (app) {
            const hwnd = app.native_window_handle()
            console.log(hwnd)
            ssf.Windows.switch_to_this_window(hwnd)
            ssf.Sys.sleep(200)
            const search = ssf.ElementExt.parse(hwnd, '/Pane[1]/Pane/Pane[1]/Pane/Pane/Pane[1]/Edit', 5000)

            util.move_abs_click(search.bounding_rectangle(), ssf.enums.Button.Left, ssf.enums.Direction.Click)

            // search.click()
            // search.send_keys(text,20)
            ssf.Input.text(text)
            ssf.Sys.sleep(1000)
            const first_chat = ssf.ElementExt.parse(hwnd, '/Pane[1]/Pane/Pane[1]/Pane[1]/Pane[1]/List/ListItem[1]/Pane/Button', 5000)
            if (first_chat) {
                // first_chat.click()
                util.move_abs_click(first_chat.bounding_rectangle(), ssf.enums.Button.Left, ssf.enums.Direction.Click)

                ssf.Sys.sleep(200)

                // const edit=ssf.ElementExt.parse(hwnd,'/Pane[1]/Pane/Pane[2]/Pane/Pane/Pane/Pane/Pane[1]/Pane[1]/Pane[1]/Pane/Pane[1]/Edit',5000)

            }


        } else {

            console.log("没有启动微信")
        }
    } catch (error) {
        console.error("出错拉", error)
    }


}



// run("帝国时代")