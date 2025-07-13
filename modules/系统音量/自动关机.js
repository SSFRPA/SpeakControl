export function run(text) {
    ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", [
        "infobox", 
        "系统将在 30 秒后自动关机。\n如果不想关机，请在此期间取消操作。",
        "关机提示"
    ]);

    // 启动倒计时关机（非强制，用户可以取消）
    ssf.Windows.cmd("shutdown", ["/s", "/t", "30"]);
}
