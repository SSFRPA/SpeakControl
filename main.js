// import { ContentFilterFinishReasonError } from "npm:openai";
import * as mod from "https://deno.land/std@0.224.0/fs/mod.ts";
import { dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";
import pinyin from "https://deno.land/x/pinyin@0.0.5/mod.ts"


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

function parse_text(text, modules) {
  // let resultIndex = -1;
  let maxScore = 0;

  const pinyinText = convertToPinyin(text);
  let result_command = null;
  modules.forEach(element => {
    const pinyinCommand = convertToPinyin(element.command_name);
    const score = similarity(pinyinText, pinyinCommand);

    // 设定一个百分比阈值，根据实际需求调整
    const threshold = 0.6; // 60% 相似度作为阈值
    const commandLength = Math.max(pinyinText.length, pinyinCommand.length);
    const normalizedScore = 1 - (score / commandLength);

    if (normalizedScore > threshold && normalizedScore > maxScore) {
      maxScore = normalizedScore;
      result_command = element;
    }
  });

  return { command: result_command, score: maxScore };
}

function similarity(s, t) {
  let n = s.length, m = t.length;
  if (n === 0) return m;
  if (m === 0) return n;

  let d = Array.from(Array(n + 1), () => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // 删除操作
        d[i][j - 1] + 1,      // 插入操作
        d[i - 1][j - 1] + cost  // 替换操作
      );

      // 考虑字符交换操作（Damerau-Levenshtein 距离特有）
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  return d[n][m];
}

function convertToPinyin(text) {
  // 使用 pinyin 库将中文转换为拼音数组，然后取首字母
  const pinyinArray = pinyin(text, { style: pinyin.STYLE_NORMAL });
  return pinyinArray.map(item => item[0]).join('');
}

function extractTextAndMode(input, modules) {
  const patterns = []
  modules.forEach(element => {
    if (element.type == "startsWith") {
      patterns.push({ mode: element.command_name, pattern: `/${element.command_name}\s*(.*)/` })
    }

  });

  for (const { mode, pattern } of patterns) {
    const match = input.match(pattern);
    if (match) {
      return { mode, text: match[1] };
    }

    // 对于拼音模糊匹配
    const pinyinInput = convertToPinyin(input);
    const pinyinPattern = convertToPinyin(mode);
    if (pinyinInput.includes(pinyinPattern)) {
      // 找到模式文本在输入文本中的起始位置
      const modeIndex = input.indexOf(mode);
      if (modeIndex !== -1) {
        // 截取模式文本之后的位置作为 text
        const matchedText = input.substring(modeIndex + mode.length).trim();
        return { mode, text: matchedText };
      }
    }
  }

  return null; // 如果不符合任何模式，返回 null
}

function checkPlay(voice_obj) {
  if (ssf.ai.Device.check_default_output_device()&&globalThis.sleep_mode==false) {

    ssf.ai.Device.audio_play(voice_obj);
  }

}
// let det_pid=null
globalThis.det_data = []
globalThis.det_pid = null;

async function main() {
  const currentFileUrl = Deno.mainModule;
  const currentFilePath = fromFileUrl(currentFileUrl);
  const currentDirPath = dirname(currentFilePath);
  const modules = await loadAndExecuteFiles(currentDirPath + "\\modules");


  //全局环境加载
  ssf.Browser.listen()
  ssf.ai.Device.init_audio()
  ssf.Frame.init()
  ssf.ai.OCR.init_model("./models/ppocrv4server/");
  // ssf.ai.OCR.init_model("./models/ppocrv4server/");
  // ssf.ai.OCR.init_model("./models/ppocrv4/");

  const voice1 = ssf.ai.Device.load_audio("./voice_files/1.wav")
  const voice2 = ssf.ai.Device.load_audio("./voice_files/2.mp3")
  if (!ssf.ai.Device.check_default_input_device()) {
    console.log("未开启麦克风设备,请打开后重新运行程序")
  }
  if (!ssf.ai.Device.check_default_output_device()) {
    console.log("未开启扬声器设备,请打开后重新运行程序")
  }


  const asr_ext_worker = new Worker(import.meta.resolve("./asr_ext.js"), { type: "module" });
  //默认是命令模式
  const current_mode = { mode: "command", module: null };

  asr_ext_worker.onmessage = async (e) => {
    try {
      const text = e.data
      console.log("-------", text);

      const quick_text = extractTextAndMode(text, modules);


      if (quick_text) {
        checkPlay(voice2);
        console.log("=====>", quick_text.mode);
      }

      // if ((!quick_text || quick_text.text.length === 0) && current_mode.mode != "lock") {
      // console.log("111111111????")

      //   return;
      // }
      for (const element of modules) {

        if (quick_text && element.command_name == quick_text.mode && quick_text.mode == "模式切换") {
          element.module.run(quick_text.text, modules, current_mode)
          if (quick_text.text != current_mode.mode) {
            // ssf.ai.Device.audio_play(voice2)

            console.log("模式切换", current_mode.mode)
            return

          }

        }
        if (quick_text && element.command_name == quick_text.mode && quick_text.mode != "模式切换" && current_mode.mode != "lock") {
          // console.log(quick_text)
          // console.log(element.module, element)
          element.module.run(quick_text.text)
          return

        }

      };



      if (current_mode.mode == "lock") {
        console.log("-----------------")
        current_mode.module?.run(text)
        return
      }

      const result_command = parse_text(text, modules);

      if (result_command.command&&result_command.command.type=="normal") {
        console.log("匹配到命令----->", result_command.command.command_name, "概率:", result_command.score);
        checkPlay(voice2)
        result_command.command.module.run(text)
        // if (result_command.command.module.run(quick_text.text) == 0) {

        // }

        return

      }
      checkPlay(voice1)

    } catch (error) {
      console.error("出错", error)
    }


  }
}


await main()