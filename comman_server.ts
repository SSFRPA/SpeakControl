// touchpad_server.ts
import { parse } from "jsr:@std/yaml/parse";
import { decodeBase64 } from "jsr:@std/encoding/base64";
import { join } from "jsr:@std/path/join";
import { dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";
import { exists } from "jsr:@std/fs/exists";
import * as ui_util from "./modules/界面操作/util.js";

globalThis.det_data = []
globalThis.dpi_ratio = 1.0
globalThis.det_pid = null;

// 1. 读取 config.yaml 文件
let config: {
    password: string;
    port: number;
    host: string;
    enable_asr: boolean;
    enable_kws: boolean;
};

interface CommandModule {
    name: string;
    label: string;
    type: "normal" | "startsWith";
}

export async function loadAndExecuteFiles(dirPath: string): Promise<CommandModule[]> {
    const modules: CommandModule[] = [];

    async function processDirectory(currentPath: string): Promise<void> {
        try {
            for await (const entry of Deno.readDir(currentPath)) {
                const fullPath = join(currentPath, entry.name);

                if (entry.isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
                    const fileUrl = new URL(`file://${fullPath}`);
                    const imported = await import(fileUrl.href);

                    const commandName = entry.name.substring(0, entry.name.indexOf("."));

                    const type: CommandModule["type"] = entry.name.includes("_") ? "startsWith" : "normal";

                    modules.push({
                        name: commandName,
                        label: commandName,
                        type,
                        // module: imported, // 如需保留模块引用可取消注释
                    });



                } else if (entry.isDirectory) {
                    await processDirectory(fullPath);
                }
            }
        } catch (err) {
            console.error("Failed to process directory:", currentPath, err);
        }
    }

    await processDirectory(dirPath);
    return modules;
}

const currentDir = dirname(fromFileUrl(import.meta.url));
const modules = await loadAndExecuteFiles(currentDir + "\\modules");




export async function init_server() {
    try {
        let configPath = "config.yaml";

        if (await exists(configPath)) {
            // 本地目录存在 config.yaml，优先读取
            console.log("🔍 使用当前工作目录下的 config.yaml");
        } else {
            // fallback 到模块目录下
            const moduleUrl = new URL('./config.yaml', import.meta.url);
            configPath = moduleUrl.pathname;
            console.log("🔍 当前工作目录无配置，使用模块目录下的 config.yaml");
        }

        const yamlText = await Deno.readTextFile(configPath);
        config = parse(yamlText) as typeof config;
        console.log("✅ 配置文件读取成功:", config);

    } catch (err) {
        console.error("❌ 读取 config.yaml 失败:", err);
        Deno.exit(1);
    }


    if (config.enable_asr) {
        setInterval(() => {
            const text = ssf.ai.ASR.get_result_with_timeout(10);
            if (text !== "") {
                console.log("接收到的音频数据是:", text);
            }
        }, 30);
    }

    const keyHandler = {
        "Escape": () => ssf.Input.key(ssf.enums.KeyCode.Escape, ssf.enums.Direction.Click),
        "Tab": () => ssf.Input.key(ssf.enums.KeyCode.Tab, ssf.enums.Direction.Click),
        "Backspace": () => ssf.Input.key(ssf.enums.KeyCode.Backspace, ssf.enums.Direction.Click),
        "Delete": () => ssf.Input.key(ssf.enums.KeyCode.Delete, ssf.enums.Direction.Click),
        "Enter": () => ssf.Input.key(ssf.enums.KeyCode.Return, ssf.enums.Direction.Click),
        " ": () => ssf.Input.key(ssf.enums.KeyCode.Space, ssf.enums.Direction.Click),
        "ArrowUp": () => ssf.Input.key(ssf.enums.KeyCode.UpArrow, ssf.enums.Direction.Click),
        "ArrowDown": () => ssf.Input.key(ssf.enums.KeyCode.DownArrow, ssf.enums.Direction.Click),
        "ArrowLeft": () => ssf.Input.key(ssf.enums.KeyCode.LeftArrow, ssf.enums.Direction.Click),
        "ArrowRight": () => ssf.Input.key(ssf.enums.KeyCode.RightArrow, ssf.enums.Direction.Click),
        ...Object.fromEntries(
            Array.from({ length: 12 }, (_, i) => [
                `F${i + 1}`,
                () => ssf.Input.key(ssf.enums.KeyCode[`F${i + 1}`], ssf.enums.Direction.Click),
            ])
        )
    };




    Deno.serve({ port: config.port, hostname: config.host }, (req) => {
        const url = new URL(req.url);



        // 3. 校验密码
        const clientPassword = url.searchParams.get("password");
        console.log("密码:", clientPassword, config.password)
        if (clientPassword !== config.password) {
            console.warn("❌ 密码错误，拒绝连接");
            return new Response("Unauthorized", { status: 401 });
        }

        if (req.headers.get("upgrade") !== "websocket") {
            console.log("非 WebSocket 请求");
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.addEventListener("open", () => {
            console.log("✅ 客户端已连接");
        });
        const screenIntervals = new Map<WebSocket, number>();
        socket.addEventListener("message", (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log("接收到数据:", e.data);
                switch (data.type) {
                    case "get_commands":
                        socket.send(JSON.stringify({
                            type: "command_list",
                            data: modules,
                        }));
                        break;
                    case "get_buttons":
                        {
                            console.log("获取按钮列表");
                            socket.send(JSON.stringify({
                                type: "button_list",
                                data: ui_util.det_element(["Button", "TabItem", "Hyperlink", "ListItem", "TreeItem", "MenuItem", "Image"]),
                            }));

                        }

                        break;

                    case "get_edits":
                        {
                            console.log("获取按钮列表");
                            socket.send(JSON.stringify({
                                type: "button_list",
                                data: ui_util.det_element(["Edit", "ComboBox"]),
                            }));

                        }

                        break;
                    case "get_tasks":
                        {
                            console.log("获取任务栏");
                            socket.send(JSON.stringify({
                                type: "task_button_list",
                                data: ui_util.task_bar(),
                            }));

                        }

                        break;

                    case "switch_window":
                        {

                            // ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Press)
                            // ssf.Input.key(ssf.enums.KeyCode.Tab, ssf.enums.Direction.Press)
                            // ssf.Sys.sleep(100)
                            // ssf.Input.key(ssf.enums.KeyCode.Tab, ssf.enums.Direction.Release)

                            // ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Release)
                            // ssf.Sys.sleep(200)

                            const current_hwnd = ssf.Windows.get_foreground_window();
                            // console.log("当前窗口句柄", current_hwnd)
                            let windows = ssf.Windows.enum_windows();
                            windows = ssf.Windows.enum_windows().filter(w => w.title && w.title.trim() !== "");

                            // 按标题升序排序（忽略大小写）
                            windows.sort((a, b) => a.title.localeCompare(b.title.toString(), 'zh-CN', { sensitivity: 'base' }));
                            // 确保有窗口列表
                            if (windows.length === 0) return;

                            let currentIndex = -1;


                            // 查找当前窗口在列表中的位置
                            for (let i = 0; i < windows.length; i++) {
                                // console.log(i, windows[i].hwnd)
                                if (windows[i].hwnd === current_hwnd) {
                                    // console.log("当前窗口", windows[i].hwnd, windows[i].title)
                                    currentIndex = i;
                                    // break;
                                }
                            }
                            // 计算下一个窗口的索引（环形）
                            const nextIndex = (currentIndex + 1) % windows.length;
                            const nextWindow = windows[nextIndex];

                            // console.log("切换到下一个窗口", nextWindow.hwnd, nextWindow.title)
                            const ele = ssf.ElementExt.parse(nextWindow.hwnd, "/", 5000)
                            ele.try_focus()
                            ssf.Windows.set_foreground_window(nextWindow.hwnd);

                            ssf.Windows.switch_to_this_window(nextWindow.hwnd);


                        }

                        break;

                    case "close_window":
                        {
                            ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Press)
                            ssf.Input.key(ssf.enums.KeyCode.F4, ssf.enums.Direction.Press)
                            ssf.Sys.sleep(100)
                            ssf.Input.key(ssf.enums.KeyCode.F4, ssf.enums.Direction.Release)

                            ssf.Input.key(ssf.enums.KeyCode.Alt, ssf.enums.Direction.Release)


                        }

                        break;

                    case "click_action": {

                        if (globalThis.det_data) {
                            const num = data.id - 1

                            ssf.Input.move(globalThis.det_data[num].x, globalThis.det_data[num].y, ssf.enums.Coordinate.Abs)
                            ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click)
                        }

                    } break
                    case "input_text": {

                        if (globalThis.det_data) {
                            const num = data.id - 1

                            ssf.Input.move(globalThis.det_data[num].x, globalThis.det_data[num].y, ssf.enums.Coordinate.Abs)
                            ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click)

                            ssf.Input.text(data.text)
                        }

                    } break

                    case "task": {
                        self.postMessage(data.action)

                    } break

                    case "audio":
                        {
                            const uint8Array = decodeBase64(data.data);
                            if (data.enable_wakeup) {
                                ssf.ai.ASR.enable_kws(true)
                            } else {
                                ssf.ai.ASR.enable_kws(false)
                            }

                            ssf.ai.ASR.set_asr_audio_data(uint8Array);
                        }
                        break;

                    case "move":
                        ssf.Input.move(data.dx, data.dy, ssf.enums.Coordinate.Rel);
                        break;

                    case "double_click":
                        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click);
                        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click);
                        break;

                    case "mouse_down":
                        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Press);
                        break;

                    case "mouse_up":
                        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Release);
                        break;

                    case "left_click":
                        ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Click);
                        break;

                    case "right_click":
                        ssf.Input.button(ssf.enums.Button.Right, ssf.enums.Direction.Click);
                        break;

                    case "scroll_x":
                        ssf.Input.scroll(data.dx, ssf.enums.Axis.Horizontal);
                        break;

                    case "scroll_y":
                        ssf.Input.scroll(data.dy, ssf.enums.Axis.Vertical);
                        break;

                    case "keyboard":
                        if (data.text) {
                            ssf.Input.text(data.text);
                        } else if (data.key && keyHandler[data.key]) {
                            keyHandler[data.key]();
                        } else {
                            console.log("未知键值：", data.key);
                        }
                        break;
                    case "media":
                        if (typeof data.command === "string") {
                            const cmd = data.command;

                            if (cmd === "prev") {
                                ssf.Input.key(ssf.enums.KeyCode.MediaPrevTrack, ssf.enums.Direction.Click);
                            } else if (cmd === "play") {
                                ssf.Input.key(ssf.enums.KeyCode.MediaPlayPause, ssf.enums.Direction.Click);
                            } else if (cmd === "pause") {
                                ssf.Input.key(ssf.enums.KeyCode.MediaPlayPause, ssf.enums.Direction.Click);
                            } else if (cmd === "next") {
                                ssf.Input.key(ssf.enums.KeyCode.MediaNextTrack, ssf.enums.Direction.Click);
                            } else if (cmd.startsWith("volume:")) {
                                const percent = parseInt(cmd.split(":")[1], 10);
                                console.log(`🎚 设置音量为 ${percent}%`);
                                const volumeValue = Math.floor((percent / 100) * 65535);
                                ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", [
                                    "setsysvolume",
                                    `${volumeValue}`,
                                ]);
                                // TODO: 你可以在这里调用系统音量设置 API
                            } else if (cmd.startsWith("mute:")) {
                                const isMuted = cmd.split(":")[1] === "true";

                                console.log(`🔇 静音状态: ${isMuted}`);
                                if (isMuted) {
                                    const volumeValue = Math.floor((0 / 100) * 65535);
                                    ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", ["setsysvolume", `${volumeValue}`])
                                } else {
                                    const volumeValue = Math.floor((20 / 100) * 65535);
                                    ssf.Windows.cmd("./ext_tools/nircmd-x64/nircmd.exe", ["setsysvolume", `${volumeValue}`])
                                }

                                // TODO: 调用系统静音设置 API
                            } else {
                                console.warn("未知媒体控制命令:", cmd);
                            }
                        }
                        break;
                    default:
                        console.log("未知类型：", data.type);
                }
            } catch (err) {
                console.log("解析失败：", err);
            }
        });

        socket.addEventListener("close", () => {
            console.log("连接已关闭");

        });

        return response;
    });

}

