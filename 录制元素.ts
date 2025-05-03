import { GlobalKeyboardListener } from 'npm:node-global-key-listener';
import * as ui_until from "./ui_untils.js";

const base_import = `
import { basename } from "https://deno.land/std@0.182.0/path/mod.ts";

function set_foucs(hwnd, path) {
  ssf.Windows.set_foreground_window(hwnd)
  ssf.Windows.switch_to_this_window(hwnd)
  ssf.ElementExt.parse(hwnd, path, 2000).try_focus()
  ssf.Sys.sleep(200)

}

function get_hwnd_with_process_name(app_path) {
  const filename = basename(app_path);

  let pid = ssf.Windows.find_process(filename)
  if (pid == 0) {
    //没有该进程,尝试启动
    pid = ssf.Windows.run(app_path, [])
    ssf.Sys.sleep(2000)
  }
  return find_ele_with_pid(pid)?.native_window_handle()

}
function find_ele_with_pid(target_pid) {
  const childs = ssf.ElementExt.get_root_element().childs()
  for (const child_ele of childs) {
    if (child_ele.process_id() == target_pid) {
      return child_ele;
      // console.log("找到目标程序", child_ele.name())
    }
  }
}




`


// function check_process(infos: ssf.PathInfo[]) {
//   try {
//     if (infos.length > 0) {

//       const first_ele = infos[0]
//       const filename = basename(first_ele.app_path as string);

//       const pid = ssf.Windows.find_process(filename)
//       if (pid != 0) {
//         // const process_info = ssf.Sys.process_info(pid)
//         find_ele_with_pid(pid)

//       }

//     }


//   } catch (_) {
//     //
//   }
// }


// Deno.writeTextFile("")
const winkeypid = ssf.Windows.find_process("WinKeyServer.exe")
ssf.Windows.kill_process(winkeypid)

const timestamp = new Date().toISOString()
  .replace(/[^0-9]/g, '')  // 移除所有非数字字符
  .slice(0, -3); // 只保留到秒，去掉毫秒部分
let fileName = `${timestamp}.js`;
// if (!Deno.statSync("records"))
//   Deno.mkdir("records")
fileName = "./records/" + fileName;
ssf.Frame.init()
ui_until.print("开始录制")
Deno.writeTextFileSync(fileName, `${base_import} \r\n`, { append: true });

Deno.writeTextFileSync(fileName, `let hwnd=-1 \r\n`, { append: true });
Deno.writeTextFileSync(fileName, `//按住ctrl+f9即可退出程序 \r\n`, { append: true });

Deno.writeTextFileSync(fileName, `ssf.Sys.listen_exit() \r\n`, { append: true });

// const file = await Deno.open(fileName, { write: true, create: true, append: true });
let current_pid = -1;
const listener = new GlobalKeyboardListener();
// ssf.ElementExt.listen()
let is_keyboard_input = false
let keyboard_data = ""
let lastTimestamp = Date.now(); // 你可以根据需要初始化
let temp_hwnd = -1;
// 监听 Ctrl+5 组合键
let ctrlPressed = false;

listener.addListener(function (e, down) {

  // 检查 Ctrl 键状态
  if (e.name === "LEFT CTRL" || e.name === "RIGHT CTRL") {
    ctrlPressed = e.state === "DOWN";
    return;
  }

  // 检查是否是 5 键按下且 Ctrl 处于按下状态
  if (e.name === "5" && e.state === "DOWN" && ctrlPressed) {
    // console.log("Ctrl+5 pressed!");
    const winkeypid = ssf.Windows.find_process("WinKeyServer.exe")
    ssf.Windows.kill_process(winkeypid)
    Deno.exit(0);
    // 在这里添加你的处理逻辑
  }

  const currentTimestamp = Date.now();
  const timeDifference = currentTimestamp - lastTimestamp;
  Deno.writeTextFileSync(fileName, `ssf.Sys.sleep(${timeDifference}); \r\n`, { append: true });

  lastTimestamp = currentTimestamp;
  // console.log(e.state,e.name)
  if (e.state == "DOWN" && (down["MOUSE LEFT"])) {
    // console.log("触发按键")

    // let infos: ssf.PathInfo[] = [];
    try {
      is_keyboard_input = false
      const infos = ssf.ElementExt.get_for_path();
      console.log(JSON.stringify(infos))
      // check_process(infos)
      const info = infos[0]
      // const filename = basename(info.app_path as string);
      current_pid = info.pid
      // }
      if (info.main_hwnd != temp_hwnd) {

        Deno.writeTextFileSync(fileName, `hwnd=get_hwnd_with_process_name('${info.app_path.replaceAll("\\", "\\\\")}') \r\n`, { append: true });
        Deno.writeTextFileSync(fileName, `set_foucs(hwnd,'${info.xpath}') \r\n`, { append: true });
        temp_hwnd = info.main_hwnd;
      }

      Deno.writeTextFileSync(fileName, `ssf.ElementExt.parse(hwnd,'${info.xpath}',5000).click() \r\n`, { append: true });
    } catch (_) {
      //
    }
    return false;
  }
  // 键盘按键触发
  // if (e.state === "DOWN" && e.name) {
  if (e.name != "MOUSE LEFT" && e.name != "MOUSE RIGHT" && e.name != "MOUSE MIDDLE") {

    let state = "Press"
    if (e.state === "UP") {
      state = "Release"
    }
    console.log(`按键 ${e.name} 被按下 ${down["MOUSE LEFT"]}`);

    // 构造按键事件脚本
    let keyScript = '';
    if (isNormalCharacter(e.name) && e.name.length == 1) {
      keyScript = `Key(Unicode('${e.name.toLowerCase()}'), ${state})`;
    } else {
      switch (e.name) {
        case "EQUALS":
          keyScript = `Key(Unicode('='), ${state})`; // 等号
          break
        case "MINUS":
          keyScript = `Key(Unicode('-'), ${state})`; // 减号
          break
        case "SQUARE BRACKET OPEN":
          keyScript = `Key(Unicode('['), ${state})`; // 左方括号
          break
        case "SQUARE BRACKET CLOSE":
          keyScript = `Key(Unicode(']'), ${state})`; // 右方括号
          break
        case "SEMICOLON":
          keyScript = `Key(Unicode(';'), ${state})`; // 分号
          break
        case "QUOTE":
          keyScript = `Key(Unicode("'"), ${state})`; // 单引号
          break
        case "BACKSLASH":
          keyScript = `Key(Unicode('\\'), ${state})`; // 反斜杠
          break
        case "COMMA":
          keyScript = `Key(Unicode(','), ${state})`; // 逗号
          break
        case "DOT":
          keyScript = `Key(Unicode('.'), ${state})`; // 点
          break
        case "FORWARD SLASH":
          keyScript = `Key(Unicode('/'), ${state})`; // 正斜杠
          break
        case "NUMPAD RETURN":
          keyScript = `Key(Return, ${state})`;
          break;
        case "RETURN":
          keyScript = `Key(Return, ${state})`;
          break;
        case "TAB":
          keyScript = `Key(Tab, ${state})`;
          break;
        case "ESCAPE":
          keyScript = `Key(Escape, ${state})`;
          break;
        case "SPACE":
          keyScript = `Key(Space, ${state})`; // 空格
          break;
        case "BACKSPACE":
          keyScript = `Key(Backspace, ${state})`;
          break;
        case "DELETE":
          keyScript = `Key(Delete, ${state})`;
          break;
        case "UP ARROW":
          keyScript = `Key(Up, ${state})`; // 上箭头
          break;
        case "DOWN ARROW":
          keyScript = `Key(Down, ${state})`; // 下箭头
          break;
        case "LEFT ARROW":
          keyScript = `Key(Left, ${state})`; // 左箭头
          break;
        case "RIGHT ARROW":
          keyScript = `Key(Right, ${state})`; // 右箭头
          break;
        case "LEFT CTRL":
          keyScript = `Key(Control, ${state})`; // Ctrl 键按下
          break;
        case "RIGHT CTRL":
          keyScript = `Key(Control, ${state})`; // Ctrl 键按下
          break;
        case "LEFT SHIFT":
          keyScript = `Key(Shift, ${state})`; // Shift 键按下
          break;
        case "RIGHT SHIFT":
          keyScript = `Key(Shift, ${state})`; // Shift 键按下
          break;
        case "LEFT ALT":
          keyScript = `Key(Alt, ${state})`; // Alt 键按下
          break;
        case "RIGHT ALT":
          keyScript = `Key(Alt, ${state})`; // Alt 键按下
          break;
        case "CAPS LOCK":
          keyScript = `Key(CapsLock, ${state})`; // CapsLock 键
          break;
        default:
          keyScript = `Key('${e.name.toLowerCase()}', ${state})`; // 默认直接使用按键名称
          break;
      }

    }

    // 写入文件，使用 Text 作为头部，并加入按键动作
    Deno.writeTextFileSync(fileName, `ssf.Input.parse(\`[${keyScript}]\`)\r\n`, { append: true });
  }





});
function isNormalCharacter(name: string): boolean {
  const normalCharPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
  return normalCharPattern.test(name);
}

const handleKeyEvent = (key, actionType) => {
  // 如果是修饰键（Ctrl, Shift, Alt 等），处理 Press 或 Release
  if (['Control', 'Shift', 'Alt', 'CapsLock'].includes(key)) {
    Input.parse(`[Key(${keyActions[key]}, ${actionType === 'keydown' ? 'Press' : 'Release'})]`);
  } else if (key in keyActions) {
    // 处理普通字符键（F1-F10、Enter、Tab 等）
    Input.parse(`[Key(${keyActions[key]}, ${actionType === 'keydown' ? 'Press' : 'Release'})]`);
  } else {
    // 普通字符（Unicode）处理
    Input.parse(`[Key(Unicode('${key}'), ${actionType === 'keydown' ? 'Press' : 'Release'})]`);
  }
};

