
import * as util from "./util.js";


export function run(text) {

    try {
        const main_hwnd=ssf.Windows.find_window("WeChatMainWndForPC","微信")
        const app = ssf.ElementExt.parse(main_hwnd,"/", 5000);
        if (app) {
            const hwnd = app.native_window_handle()
            ssf.Windows.switch_to_this_window(hwnd)
            ssf.Sys.sleep(200)
            const edit=ssf.ElementExt.parse(hwnd,'/Pane[1]/Pane/Pane[2]/Pane/Pane/Pane/Pane/Pane[1]/Pane[1]/Pane[1]/Pane/Pane[1]/Edit',5000)
            const send_btn=ssf.ElementExt.parse(hwnd,'/Pane[1]/Pane/Pane[2]/Pane/Pane/Pane/Pane/Pane[1]/Pane[1]/Pane[1]/Pane/Pane[2]/Pane[2]/Button',5000)

            edit.try_focus()
            ssf.Sys.sleep(200)

            const editrect=edit.bounding_rectangle()
            util.move_abs_click(editrect,ssf.enums.Button.Left,ssf.enums.Direction.Click)

            ssf.Sys.sleep(200)
            if(edit)
            {
                // edit.send_keys(text,20)
                ssf.Input.text(text)
                // const send_btn=ssf.ElementExt.parse(hwnd,'/Pane[1]/Pane/Pane[2]/Pane/Pane/Pane/Pane/Pane[1]/Pane[1]/Pane[1]/Pane/Pane[2]/Pane[2]/Button',5000)
                const rect=send_btn.bounding_rectangle()
                util.move_abs_click(rect,ssf.enums.Button.Left,ssf.enums.Direction.Click)
                // send_btn.click()
            }
    
    
        } else {
    
            console.log("没有启动微信")
        }
    } catch (error) {
        console.log("出错拉",error)
    }


}



// run("帝国时代LT")