
export function run(text) {
    //获得当前窗口id
    const hwnd = ssf.Windows.get_foreground_window()
    //最大化窗口
    ssf.Windows.show_window(hwnd, ssf.enums.CmdShow.SW_MAXIMIZE)
}

