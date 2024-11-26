






export function run(text) {

    try {
        const main_hwnd = ssf.Windows.find_window("WeChatMainWndForPC", "微信")
        const app = ssf.ElementExt.parse(main_hwnd, "/", 5000);
        if (app) {
            const hwnd = app.native_window_handle()
            ssf.Windows.switch_to_this_window(hwnd)
            app.click()
       
        } else {

            console.log("没有启动微信")
        }
    } catch (error) {
        console.log("出错拉", error)
    }


}



// run("帝国时代LT")

