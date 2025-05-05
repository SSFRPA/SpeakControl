
export function run(text) {
    // ssf.Windows.run("explorer.exe", ["shell:::{3080F90D-D7AD-11D9-BD98-0000947B0257}"]);
    // ssf.Windows.run("nircmd.exe", ["win", "minimizeall"]);

    ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", [
        "sendkeypress",
        "rwin+d",
    ]);
}
