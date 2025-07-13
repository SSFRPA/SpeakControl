// === 工具函数 ===

// function isIntersecting(rect1, rect2) {
//     return !(
//         rect2.x >= rect1.x + rect1.w ||
//         rect2.x + rect2.w <= rect1.x ||
//         rect2.y >= rect1.y + rect1.h ||
//         rect2.y + rect2.h <= rect1.y
//     );
// }
function isIntersecting(rect1, rect2) {
    const x_overlap = Math.max(0, Math.min(rect1.x + rect1.w, rect2.x + rect2.w) - Math.max(rect1.x, rect2.x));
    const y_overlap = Math.max(0, Math.min(rect1.y + rect1.h, rect2.y + rect2.h) - Math.max(rect1.y, rect2.y));
    const intersectionArea = x_overlap * y_overlap;

    const area1 = rect1.w * rect1.h;
    const area2 = rect2.w * rect2.h;

    // 如果交集面积超过任一矩形的 20%，就算重叠
    return (
        intersectionArea / area1 > 0.2 ||
        intersectionArea / area2 > 0.2
    );
}


function isOverlappingAny(rect, existingRects) {
    for (const r of existingRects) {
        if (isIntersecting(rect, r)) {
            return true;
        }
    }
    return false;
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// === 遍历函数，带重叠过滤 ===

function recursiveTraversal(element, control_type, result, rectList) {
    if (!element) return;
    for (const t of control_type) {
        if (element.control_type().startsWith(t) && !element.is_offscreen()) {
            const rect = element.bounding_rectangle();
            if (!isOverlappingAny(rect, rectList)) {
                result.push(element);
                rectList.push(rect);
            }
        }
    }
    const children = element.childs();
    for (const child of children) {
        recursiveTraversal(child, control_type, result, rectList);
    }
}

// === 任务栏按钮扫描函数 ===

export function task_bar() {
    const temp = ssf.ElementExt.get_root_element().childs();
    const result = [];
    const rectList = [];
    const client_data = [];

    for (const t of temp) {
        if (t.name() === "任务栏") {
            const task_bar_eles = t.childs();
            for (const task_bar_ele of task_bar_eles) {
                if (task_bar_ele.name() === "DesktopWindowXamlSource") {
                    recursiveTraversal(task_bar_ele, ["Button"], result, rectList);
                }
            }
        }
    }

    const det_data = [];
    globalThis.det_data.length = 0;
    const dpi = globalThis.dpi_ratio;
    let index = 1;

    for (const element of result) {
        const rect = element.bounding_rectangle();

        globalThis.det_data.push({
            x: Math.floor(rect.x + rect.w / 2),
            y: Math.floor(rect.y + rect.h / 2),
            r: 200,
            g: 200,
            b: 30,
            a: 0.2,
            font_size: 10,
            text: "",
            id: index,
            delay: 8000,
            border_only: true,
        });

        const color = getRandomColor();
        det_data.push({
            x: parseInt(rect.x / dpi),
            y: parseInt(rect.y / dpi),
            width: parseInt(rect.w / dpi),
            height: parseInt(rect.h / dpi),
            r: color.r,
            g: color.g,
            b: color.b,
            a: 0.2,
            font_size: 10,
            text: "",
            id: index,
            delay: 8000,
            border_only: true,
        });
        client_data.push({
            id: index,
            name: element.name(),
        });

        index++;
    }

    const data = {
        is_focus: true,
        scroll_y: 0,
        detData: det_data,
        restart: false,
    };

    const requestModel = {
        url: "http://127.0.0.1:51515/det_data",
        header: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
        timeout: 5000,
    };

    ssf.Request.post([requestModel]).catch(() => { });
    return client_data;

}

// === 通用元素检测函数 ===

export function det_element(control_type) {
    const hwnd = ssf.Windows.get_foreground_window();
    ssf.ElementExt.enabled_automation(hwnd)
    const ele = ssf.ElementExt.parse(hwnd, "/", 3000);

    console.log("当前定位窗口", ele.name());

    const result = [];
    const rectList = [];
    recursiveTraversal(ele, control_type, result, rectList);

    const det_data = [];
    const client_data = [];
    globalThis.det_data.length = 0;
    const dpi = globalThis.dpi_ratio;
    let index = 1;

    for (const element of result) {
        const rect = element.bounding_rectangle();

        globalThis.det_data.push({
            x: Math.floor(rect.x + rect.w / 2),
            y: Math.floor(rect.y + rect.h / 2),
            g: 200,
            b: 30,
            a: 0.2,
            font_size: 10,
            text: "",
            id: index,
            delay: 8000,
            border_only: true,
        });

        const color = getRandomColor();
        det_data.push({
            x: parseInt(rect.x / dpi),
            y: parseInt(rect.y / dpi),
            width: parseInt(rect.w / dpi),
            height: parseInt(rect.h / dpi),
            r: color.r,
            g: color.g,
            b: color.b,
            a: 0.2,
            font_size: 10,
            text: "",
            id: index,
            delay: 8000,
            border_only: true,
        });

        client_data.push({
            id: index,
            name: element.name(),
        });

        index++;
    }

    const data = {
        is_focus: false,
        scroll_y: 0,
        detData: det_data,
        restart: false,
    };

    const requestModel = {
        url: "http://127.0.0.1:51515/det_data",
        header: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
        timeout: 5000,
    };

    ssf.Request.post([requestModel]).catch(() => { });
    return client_data;
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

// function getRandomColor() {
//     return colors[Math.floor(Math.random() * colors.length)];
// }


