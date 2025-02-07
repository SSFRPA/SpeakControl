



export function run(text) {
    const volumeValue = Math.floor((0 / 100) * 65535);
    ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", ["setsysvolume",`${volumeValue}`])
    
}