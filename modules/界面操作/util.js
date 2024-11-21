export function det_element(control_type, isshow = true) {
    if (globalThis.det_pid) {
        ssf.Windows.kill_process(globalThis.det_pid)
        ssf.Sys.sleep(300)
    }
    globalThis.det_data.length = 0
    const hwnd = ssf.Windows.get_foreground_window()
    const ele = ssf.ElementExt.parse(hwnd, "/", 3000)
    const result = []
    recursiveTraversal(ele, control_type, result)
    // const data=[]
    let index = 1;
    result.forEach(element => {
        const rect = element.bounding_rectangle()
        // console.log(JSON.stringify(rect), element.name())
        globalThis.det_data.push({
            x: Math.floor((rect.x + rect.w / 2)),
            y: Math.floor((rect.y + rect.h / 2)),
            // x: rect.x,
            // y: rect.y,
            r: 200,
            g: 200,
            b: 30,
            a: 0,
            font_size: 10,
            radius: 15,
            text: index.toString()
            // text:element.name()


        })
        index = index + 1
    });
    // console.log(JSON.stringify(globalThis.det_data))
    if (isshow) {
        // const pid = ssf.Windows.run("./ui_ext/ssf_ui.exe", [JSON.stringify(det_data)])
        const pid = ssf.Windows.run("./ui_ext/ssf_ui.exe", [JSON.stringify(globalThis.det_data)])
        console.log(pid)

        globalThis.det_pid = pid;
    } else {
        globalThis.det_pid = null;
    }



}


function recursiveTraversal(element, control_type, result) {

    if (element) {
        for (const t of control_type) {
            if (element.control_type().startsWith(t) && !element.is_offscreen()) {

                // console.log(element.control_type(),control_type)
                // console.log(element.name(), element.control_type())
                result.push(element)
            }
        }

        // if(element.name()!=""){
        //     result.push(element)

        // }


        const children = element.childs();
        for (const child of children) {
            recursiveTraversal(child, control_type, result);
            // result.push(element)
        }
    }
    return null;
}