export function run() {
    

    try {


        const browser_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

        let chrome_app = null
        try {
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000)

        } catch (_) {
            //
        }
        if (!chrome_app) {
            ssf.Windows.run(browser_path, [])
            ssf.Sys.sleep(1000)
            chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000)

        }

        ssf.Windows.switch_to_this_window(chrome_app.native_window_handle())
        const current_url = ssf.Browser.current_tab(3000).url;
       
        const ty_tid = ssf.Browser.create_tab("https://tongyi.aliyun.com/", 3000).id

        ssf.Browser.setText(ty_tid, '//*[@id="tongyiPageLayout"]/div[3]/div/div[2]/div[1]/div[3]/div[2]/div[2]/div/textarea', current_url+" 总结一下上述说得内容", 3000)
        ssf.Sys.sleep(2000)

        ssf.Browser.click(ty_tid, '/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[3]/div[2]/div[3]', 3000)



    } catch (e) {
        console.log("出错了",e)
        //
    }
}