

import * as util from "./util.js";





export function run(text) {

    try {
        const main_hwnd = ssf.Windows.find_window("WeChatMainWndForPC", "微信")
        const app = ssf.ElementExt.parse(main_hwnd, "/", 5000);
        if (app) {
            const hwnd = app.native_window_handle()
            ssf.Windows.switch_to_this_window(hwnd)
            ssf.Sys.sleep(200)
            const chat_list_item = ssf.ElementExt.parse(hwnd, '/Pane[1]/Pane/Pane[2]/Pane/Pane/Pane/Pane/Pane[1]/Pane/Pane/List', 5000).childs()
            const owner_list = []
            for (const iterator of chat_list_item) {
                try {
                    const owner = ssf.ElementExt.parse_with_element(iterator, "/Pane/Button[2]", 20)
                    //判断是不是自己的消息
                    if (owner.name() != "") {
                        // console.log(iterator.name())
                        owner_list.push(owner)

                    }
                } catch (_) {
                    _
                }

            }
            const chat_temp= ssf.ElementExt.parse_with_element(owner_list.at(-1).parent(),"/Pane[1]",20)
            const rect=chat_temp.bounding_rectangle()
            util.move_abs_click(rect,ssf.enums.Button.Right,ssf.enums.Direction.Click)

            //循环判断是否出现撤销按钮
            const menus=ssf.ElementExt.parse(hwnd,'/Menu/Pane[1]/List',5000).childs()
            for (const iterator of menus) {
                if(iterator.name()=="撤回")
                {
                    // iterator.click()

                    const iterator_rect=iterator.bounding_rectangle()
                    ssf.Input.move(iterator_rect.x+iterator_rect.w/2,iterator_rect.y+iterator_rect.h/2,ssf.enums.Coordinate.Abs)
                    util.move_abs_click(iterator_rect,ssf.enums.Button.Left,ssf.enums.Direction.Click)
                    // ssf.Sys.sleep(200)
                    return
                }
            }
            console.log("未找到撤销按钮,可能该消息已经不可撤销")
       
        } else {

            console.log("没有启动微信")
        }
    } catch (error) {
        console.log("出错拉", error)
    }


}



// run("帝国时代LT")

