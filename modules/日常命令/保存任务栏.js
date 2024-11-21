import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.221.0/path/mod.ts";


function saveJson(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2);
    Deno.writeTextFileSync(filePath, jsonData);
}
function getOpenFolders() {
    const psCommand = `
    $id = 0
    $folders = (New-Object -ComObject Shell.Application).Windows() | ForEach-Object { 
      if ($_.Document -and $_.Document.Folder) { 
        $id++
        [PSCustomObject]@{
          Id = $id
          Title = $_.Document.Folder.Title
          Path = $_.Document.Folder.Self.Path
        } 
      }
    }
    $folders | ConvertTo-Json -Compress
    `;


    try {
        const result = ssf.Windows.cmd("powershell", ["-Command", psCommand]);
        // console.log("result.........",JSON.stringify(result))
        return JSON.parse(result.result)
    } catch (error) {
        console.error(`Error executing PowerShell command: ${error}`);
    }
}

function get_open_info() {

    const dirs = getOpenFolders();
    // console.log(JSON.stringify(dirs))
    const processes = []
    let p_index = 0;
    const childs = ssf.ElementExt.get_root_element().childs()
    //判断任务栏打开的进程
    childs.forEach(element => {
        const p = ssf.Sys.process_info(element.process_id())

        const p_name = basename(p.exe)
        let args = []
        if (p.cmd.length >= 1) {
            args = p.cmd.slice(1, p.cmd.length);
        }
        if (p_name.toLowerCase().indexOf("explorer.exe") == -1) {

            processes.push({
                name: p_name,
                path: p.exe,
                args: args,
                type: "exe",
                id: p_index

            })
            p_index = p_index + 1
        }


    });

    //单独判断打开的目录
    if (dirs) {
        if (!Array.isArray(dirs)) {
            processes.push({
                name: dirs.Title,
                path: dirs.Path,
                type: "dir",
                id: p_index

            })
            p_index = p_index + 1
        } else {

            dirs.forEach(d => {

                processes.push({
                    name: d.Title,
                    path: d.Path,
                    type: "dir",
                    id: p_index
                })
                p_index = p_index + 1

            });
        }
    }

    return processes

}
function save_task() {
    // const processes = get_open_info()
    const processes = get_open_info()
    if (!existsSync('./save/')) {
        Deno.mkdirSync("./save", { recursive: true });


    }
    saveJson("./save/1.json", processes)

}
export function run(text) {
    save_task()
}

