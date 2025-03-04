// export function det_element(control_type, isshow = true) {
//     if (globalThis.det_pid) {
//         ssf.Windows.kill_process(globalThis.det_pid)
//         ssf.Sys.sleep(300)
//     }
//     globalThis.det_data.length = 0
//     const hwnd = ssf.Windows.get_foreground_window()
//     const ele = ssf.ElementExt.parse(hwnd, "/", 3000)
//     console.log("当前定位窗口",ele.name())
//     const result = []
//     recursiveTraversal(ele, control_type, result)
//     // const data=[]
//     let index = 1;
//     result.forEach(element => {
//         const rect = element.bounding_rectangle()
//         console.log(JSON.stringify(rect), element.name())
//         globalThis.det_data.push({
//             x: Math.floor((rect.x + rect.w / 2)),
//             y: Math.floor((rect.y + rect.h / 2)),
//             // x: rect.x,
//             // y: rect.y,
//             r: 200,
//             g: 200,
//             b: 30,
//             a: 0,
//             font_size: 10,
//             radius: 15,
//             text: index.toString()
//             // text:element.name()


//         })
//         index = index + 1
//     });
//     // console.log(JSON.stringify(globalThis.det_data))
//     if (isshow) {
//         // const pid = ssf.Windows.run("./ui_ext/ssf_ui.exe", [JSON.stringify(det_data)])
//         const pid = ssf.Windows.run("./ui_ext/ssf_ui.exe", [JSON.stringify(globalThis.det_data)])
//         console.log(pid)

//         globalThis.det_pid = pid;
//     } else {
//         globalThis.det_pid = null;
//     }



// }


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
export function task_bar() {
    const temp = ssf.ElementExt.get_root_element().childs()
    const result=[]
    for (const t of temp) {
        // console.log(t.name())
        if (t.name()=="任务栏") {
            const task_bar_eles=t.childs()
            for (const task_bar_ele of task_bar_eles) {
                if(task_bar_ele.name()=="DesktopWindowXamlSource"){
                    recursiveTraversal(task_bar_ele, ["Button"], result);
                }
            }
            result.push(t)

        }
    }
    // console.log(result)

    let index = 1;
    const det_data = []
    globalThis.det_data.length = 0
    const dpi = globalThis.dpi_ratio;
    result.forEach(element => {
        const rect = element.bounding_rectangle()
        // console.log(JSON.stringify(rect), element.name())
        globalThis.det_data.push({
            x: Math.floor((rect.x + rect.w / 2)),
            y: Math.floor((rect.y + rect.h / 2)),
            // x: parseInt(rect.x / dpi),
            // y: parseInt(rect.y / dpi),
            // width: parseInt(rect.w / dpi),
            // height: parseInt(rect.h / dpi),
            // x: rect.x,
            // y: rect.y,
            r: 200,
            g: 200,
            b: 30,
            a: 0.2,
            font_size: 10,
            text: "",
            // radius: 15,
            id: index,
            delay: 8000
            // text:element.name()


        })
        const color = getRandomColor()
        det_data.push({
            x: parseInt(rect.x / dpi),
            y: parseInt(rect.y / dpi),
            width: parseInt(rect.w / dpi),
            height: parseInt(rect.h / dpi),
            // x: rect.x,
            // y: rect.y,
            r: color.r,
            g: color.g,
            b: color.b,
            a: 0.2,
            font_size: 10,
            text: "",
            // radius: 15,
            id: index,
            delay: 8000
        })
        index = index + 1
    });
    const data = {
        "is_focus": true,
        "scroll_y": 0,
        "detData": det_data,
        "restart":false
    }


    const requestModel = {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 5000 // 5秒超时
    };

    ssf.Request.post([requestModel])
        .then((results) => {
            const result = results[0];
            // console.log(`请求成功: ${result.url}`);
        })
        .catch((error) => {
            // console.error('请求失败:', error);
        });

}


export function det_element(control_type) {


    const hwnd = ssf.Windows.get_foreground_window()
    const ele = ssf.ElementExt.parse(hwnd, "/", 3000)
    console.log("当前定位窗口", ele.name())
    const result = []
    recursiveTraversal(ele, control_type, result)
    // const data=[]
    let index = 1;
    const det_data = []
    globalThis.det_data.length = 0
    const dpi = globalThis.dpi_ratio;
    result.forEach(element => {
        const rect = element.bounding_rectangle()
        // console.log(JSON.stringify(rect), element.name())
        globalThis.det_data.push({
            x: Math.floor((rect.x + rect.w / 2)),
            y: Math.floor((rect.y + rect.h / 2)),
            // x: parseInt(rect.x / dpi),
            // y: parseInt(rect.y / dpi),
            // width: parseInt(rect.w / dpi),
            // height: parseInt(rect.h / dpi),
            // x: rect.x,
            // y: rect.y,
            r: 200,
            g: 200,
            b: 30,
            a: 0.2,
            font_size: 10,
            text: "",
            // radius: 15,
            id: index,
            delay: 8000
            // text:element.name()


        })
        const color = getRandomColor()
        det_data.push({
            x: parseInt(rect.x / dpi),
            y: parseInt(rect.y / dpi),
            width: parseInt(rect.w / dpi),
            height: parseInt(rect.h / dpi),
            // x: rect.x,
            // y: rect.y,
            r: color.r,
            g: color.g,
            b: color.b,
            a: 0.2,
            font_size: 10,
            text: "",
            // radius: 15,
            id: index,
            delay: 8000
        })
        index = index + 1
    });
    const data = {
        "is_focus": false,
        "scroll_y": 0,
        "detData": det_data,
        "restart":false

    }


    const requestModel = {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 5000 // 5秒超时
    };

    ssf.Request.post([requestModel])
        .then((results) => {
            const result = results[0];
            // console.log(`请求成功: ${result.url}`);
        })
        .catch((error) => {
            // console.error('请求失败:', error);
        });

}


const colors = [
    { r: 255, g: 99, b: 71 }, { r: 255, g: 165, b: 0 }, { r: 255, g: 105, b: 180 },
    { r: 70, g: 130, b: 180 }, { r: 255, g: 222, b: 173 }, { r: 60, g: 179, b: 113 },
    { r: 255, g: 69, b: 0 }, { r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 0 },
    { r: 135, g: 206, b: 235 }, { r: 0, g: 191, b: 255 }, { r: 147, g: 112, b: 219 },
    { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 }, { r: 255, g: 20, b: 147 },
    { r: 75, g: 0, b: 130 }, { r: 240, g: 230, b: 140 }, { r: 255, g: 99, b: 71 },
    { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 }, { r: 255, g: 182, b: 193 },
    { r: 72, g: 61, b: 139 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 },
    { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 },
    { r: 255, g: 99, b: 71 }, { r: 255, g: 215, b: 0 }, { r: 102, g: 205, b: 170 },
    { r: 255, g: 182, b: 193 }, { r: 255, g: 223, b: 186 }, { r: 233, g: 150, b: 122 },
    { r: 255, g: 218, b: 185 }, { r: 123, g: 104, b: 238 }, { r: 240, g: 230, b: 140 },
    { r: 255, g: 160, b: 122 }, { r: 100, g: 149, b: 237 }, { r: 50, g: 205, b: 50 },
    { r: 255, g: 99, b: 71 }, { r: 255, g: 255, b: 0 }, { r: 102, g: 205, b: 170 },
    { r: 255, g: 105, b: 180 }, { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 },
    { r: 240, g: 230, b: 140 }, { r: 173, g: 216, b: 230 }, { r: 144, g: 238, b: 144 },
    { r: 255, g: 182, b: 193 }, { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 },
    { r: 255, g: 20, b: 147 }, { r: 75, g: 0, b: 130 }, { r: 240, g: 128, b: 128 },
    { r: 255, g: 228, b: 225 }, { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 },
    { r: 255, g: 239, b: 148 }, { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 },
    { r: 139, g: 0, b: 0 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 },
    { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 },
    { r: 255, g: 69, b: 0 }, { r: 255, g: 182, b: 193 }, { r: 72, g: 61, b: 139 },
    { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 }, { r: 32, g: 178, b: 170 },
    { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 }, { r: 210, g: 105, b: 30 },
    { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 }, { r: 255, g: 99, b: 71 },
    { r: 255, g: 215, b: 0 }, { r: 102, g: 205, b: 170 }, { r: 255, g: 182, b: 193 },
    { r: 255, g: 223, b: 186 }, { r: 233, g: 150, b: 122 }, { r: 255, g: 218, b: 185 },
    { r: 123, g: 104, b: 238 }, { r: 240, g: 230, b: 140 }, { r: 255, g: 160, b: 122 },
    { r: 100, g: 149, b: 237 }, { r: 50, g: 205, b: 50 }, { r: 255, g: 99, b: 71 },
    { r: 255, g: 255, b: 0 }, { r: 102, g: 205, b: 170 }, { r: 255, g: 105, b: 180 },
    { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 }, { r: 240, g: 230, b: 140 },
    { r: 173, g: 216, b: 230 }, { r: 144, g: 238, b: 144 }, { r: 255, g: 182, b: 193 },
    { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 }, { r: 255, g: 20, b: 147 },
    { r: 75, g: 0, b: 130 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}


// globalThis.det_data=[]
// globalThis.dpi_ratio=1.5
// task_bar()