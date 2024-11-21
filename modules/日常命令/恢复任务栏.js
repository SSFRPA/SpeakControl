import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.221.0/path/mod.ts";

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


function findMissingElements(arr1, arr2) {
    // 复制数组，以防止修改原始数组
    let arr1Copy = [...arr1];

    // 遍历第二个数组，从第一个数组中移除找到的元素
    for (let item of arr2) {
        let index = arr1Copy.findIndex(el => el.name === item.name && el.type === item.type);
        if (index !== -1) {
            arr1Copy.splice(index, 1);
        }
    }

    // arr1Copy 中剩下的元素就是缺少的部分
    return arr1Copy;
}

function loadJson(filePath) {
    const jsonData = Deno.readTextFileSync(filePath);
    return JSON.parse(jsonData);
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

        // const process_name = ssf.Windows.find_process_with_hwnd(element.native_window_handle())
        // console.log("进程信息",JSON.stringify(p))
        // console.log(p, basename(p.cmd))
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
function restore_task() {
    const processes = get_open_info()

    const o = loadJson("./save/1.json")
    const missingElements = findMissingElements(o, processes);
    // console.log(JSON.stringify(missingElements))
    missingElements.forEach(element => {
        if (element.type == "dir") {
            // if (element.path.indexOf("::") >= 0) {
            //     ssf.Windows.run("explorer.exe", [element.path])

            // } else {
            //     ssf.Windows.run("explorer.exe", [element.path])

            // }

            ssf.Windows.run("explorer.exe", [element.path])

        } else {
            // console.log(element.path,element.args)
            ssf.Windows.run(element.path, [])

        }

    });

}

export function run(text) {
    restore_task()
}

