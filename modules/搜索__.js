export function run(text) {
    try {
        const browser_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
       
        let chrome_app = null
        try {
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000)

        } catch (_) {
            //
        }
        // console.log("..............",chrome_app)
        if (!chrome_app) {
            ssf.Windows.run(browser_path, [])
            ssf.Sys.sleep(1000)
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000)

        }

        ssf.Windows.switch_to_this_window(chrome_app.native_window_handle())
        ssf.Sys.sleep(1000)

        const tid = ssf.Browser.create_tab("https://www.baidu.com/", 3000).id
        // ssf.Sys.sleep(1000)
        ssf.Browser.setText(tid, '//*[@id="kw"]', text, 3000)
        ssf.Sys.sleep(500)

        ssf.Browser.click(tid, '//*[@id="su"]', 3000)

    } catch (error) {
        console.log(error)
    }
}
