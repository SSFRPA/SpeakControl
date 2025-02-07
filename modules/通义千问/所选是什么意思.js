


export function run(text) {

    get_current_text()

}



function get_current_text() {
    ssf.Input.key(ssf.enums.KeyCode.Control, ssf.enums.Direction.Press)
    ssf.Input.key(ssf.enums.KeyCode.C, ssf.enums.Direction.Press)
    ssf.Input.key(ssf.enums.KeyCode.Control, ssf.enums.Direction.Release)
    ssf.Input.key(ssf.enums.KeyCode.C, ssf.enums.Direction.Release)
    ssf.Sys.sleep(1000)
    const v = ssf.Sys.get_clipboard()
    console.log("选中的内容", v)

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
        const tid = ssf.Browser.create_tab("https://tongyi.aliyun.com/", 3000).id

        ssf.Browser.setText(tid, '//*[@id="tongyiPageLayout"]/div[3]/div/div[2]/div[1]/div[3]/div[2]/div/div[2]/div/textarea', v, 3000)
        ssf.Sys.sleep(2000)

        ssf.Browser.click(tid, '/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[3]/div[2]/div/div[3]', 3000)
      




    } catch (e) {
        console.log("出错了",e)
        //
    }
}