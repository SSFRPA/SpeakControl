
export function run(text) {
    const hwnd = ssf.Windows.get_foreground_window()
    const pid = ssf.Windows.find_process_with_hwnd(hwnd)
    console.log("结束进程", ssf.Windows.kill_process(pid))
}

