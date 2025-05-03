import * as ui_until from "../../ui_untils.js";
import { dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";
export function run(text) {

    display_help()

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

async function loadAndExecuteFiles(dirPath) {
    const modules = [];

    async function processDirectory(path) {
        try {
            const files = Deno.readDir(path);

            for await (const file of files) {
                const fullPath = `${path}/${file.name}`;

                if (file.isFile && (file.name.endsWith(".ts") || file.name.endsWith(".js"))) {
                    const module = await import(`file://${fullPath}`);
                    const commandName = file.name.includes("_")
                        ? file.name.substring(0, file.name.indexOf("_"))
                        : file.name.substring(0, file.name.indexOf("."));

                    const type = file.name.includes("_") ? "startsWith" : "normal";
                    modules.push({ module, type, command_name: commandName });

                    // 如果需要执行每个模块的 `run` 函数，可以取消注释以下代码
                    // if (typeof module.run === "function") {
                    //   module.run();
                    // }
                } else if (file.isDirectory) {
                    await processDirectory(fullPath); // 递归处理子目录
                }
            }
        } catch (error) {
            console.error("Error processing directory:", error);
        }
    }

    await processDirectory(dirPath);
    return modules;
}

export async function display_help() {
    // console.log("????????????,..............")
    let text = ''
    const currentFileUrl = Deno.mainModule;
    const currentFilePath = fromFileUrl(currentFileUrl);
    const currentDirPath = dirname(currentFilePath);
    // console.log()
    const modules = await loadAndExecuteFiles(currentDirPath+ "\\modules");

    const screen_info = ssf.Frame.screen_info();
    // console.log(screen_info);
    const dpi = globalThis.dpi_ratio;
    const color = colors[5];

    const det_data = [];

    const itemWidth = 300; // 每个文本块的宽度
    const itemHeight = 40; // 每个文本块的高度
    const marginX = 10; // 水平间距
    const marginY = 10; // 垂直间距
    const maxPerRow = 4; // 每行最多 3 个
    const startX = 50; // 初始 X 坐标
    const startY = 20; // 初始 Y 坐标

    let currentX = startX; // 当前 X 位置
    let currentY = startY; // 当前 Y 位置
    let itemCount = 0; // 当前行内的元素计数

    modules.forEach((element, index) => {
        // console.log(element.command_name)
        if (element.module) {
            // 如果当前行已满，换到新行
            if (itemCount >= maxPerRow) {
                itemCount = 0; // 重置当前行内元素计数
                currentX = startX; // X 坐标归零
                currentY += itemHeight + marginY; // 移动到下一行
            }

            det_data.push({
                x: currentX,
                y: currentY,
                width: itemWidth,
                height: itemHeight,
                r: color.r,
                g: color.g,
                b: color.b,
                text: element.command_name,
                a: 1.0,
                font_size: 24,
                delay: 5000,
                id: index + 2,
                border_only:false,

            });

            // 更新 X 坐标以放置下一个元素
            currentX += itemWidth + marginX;
            itemCount++;
        }
    });

    const data = {
        "is_focus": false,
        "scroll_y": 0,
        "detData": det_data,
        "restart": false
    };

    const requestModel = {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 5000 // 5秒超时
    };
    await ssf.Request.post([requestModel]);
}


// globalThis.dpi_ratio=1.5
// ssf.Frame.init()
// await display_help()