import * as ui_until from "./ui_untils.js";
import * as cmd_server from "./comman_server.ts";
import * as media_server from "./media_server.ts";

ssf.ai.Device.init_audio()
await media_server.init_server()
await cmd_server.init_server()
const voice1 = ssf.ai.Device.load_audio("./voice_files/1.wav")
const voice2 = ssf.ai.Device.load_audio("./voice_files/2.mp3")

function checkPlay(voice_obj) {
    if (ssf.ai.Device.check_default_output_device()) {

        ssf.ai.Device.audio_play(voice_obj);
    }

}
if (!ssf.ai.Device.check_default_input_device()) {
    console.log("未开启麦克风设备,请打开后重新运行程序")
}
if (!ssf.ai.Device.check_default_output_device()) {
    console.log("未开启扬声器设备,请打开后重新运行程序")
}

ssf.ai.ASR.listen_input("./models/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20", "./models/sherpa-onnx-kws-zipformer-wenetspeech-3.3M-2024-01-01", 2.4, 0.01, 10.0, 0);
ssf.ai.ASR.enable_capslock_listen(false)
ssf.ai.ASR.enable_kws(false)
console.log("开始监听麦克风");
let min_startTime = 0
let max_startTime = 0
const max_threshold = 10;
const min_threshold = 1.2;

let last_text = ""

async function break_command() {

    const data = {
        "is_focus": false,
        "scroll_y": 0,
        "detData": [],
        "restart": true
    }

    const requestModel = {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 2000 // 2秒超时
    };
    await ssf.Request.post([requestModel]);
}

function set_init() {
    min_startTime = new Date();
    max_startTime = new Date();
}
function set_asr_sleep() {

    if (ssf.ai.ASR.get_asr_state() && ssf.ai.ASR.get_kws_state()&&mode=="唤醒模式") {

        // asr_walkup = false
        ssf.ai.ASR.set_asr_sleep()

    }
}
// let asr_walkup = false
// while (true) {


// }

let mode="唤醒模式"
function change_mode(text) {
    mode=text;
    ui_until.print("切换到"+text);

    switch (text) {
        case "命令模式":
            {
                //命令模式下关闭唤醒 并开启capslock监听
                // ssf.ai.ASR.enable_kws(false)
                ssf.ai.ASR.set_asr_walkup()
                ssf.ai.ASR.enable_capslock_listen(true)
            }
            break;
        case "输入模式":
            {
                ssf.ai.ASR.set_asr_walkup()
                // ssf.ai.ASR.enable_kws(false)
                ssf.ai.ASR.enable_capslock_listen(true)
            }
            break;
        case "唤醒模式":
            {
                // ssf.ai.ASR.enable_kws(true)
                ssf.ai.ASR.set_asr_walkup()

                ssf.ai.ASR.enable_capslock_listen(false)
            }
            break;
        case "翻译模式":
            {
                // ssf.ai.ASR.enable_kws(false)
                ssf.ai.ASR.set_asr_walkup()

                ssf.ai.ASR.enable_capslock_listen(true)
            }
            break;
    }
    self.postMessage("增强型自动化模式切换" + text)

}

// self.onmessage = async (e) => {
//     // console.log(e)
//     if (e.data == "唤醒模式") {
//         ssf.ai.ASR.enable_kws(true)
//         ssf.ai.ASR.enable_capslock_listen(false)
//     }
// }
// 基础轮询 - 每隔一段时间检查一次条件
const pollInterval = setInterval(async () => {
    try {
        // console.log("监听中.....",ssf.ai.ASR.get_kws_state(),ssf.ai.ASR.get_asr_state())
        const kws_text = ssf.ai.ASR.get_kws_result_with_timeout(10);
        //模式和中断优先触发
        if (kws_text.indexOf("中断命令") > -1) {
            console.log("触发中断命令")
            await break_command()
            return
        }
        if (kws_text.indexOf("模式") > 0) {
            change_mode(kws_text.substring(2, kws_text.length))
            return
        }
        if (ssf.ai.ASR.get_kws_state() && !ssf.ai.ASR.get_asr_state()) {


            if (kws_text != "") {
                // console.log(kws_text, "唤醒词")
                ui_until.print("海棠被唤醒，请下答指令")
                checkPlay(voice2)
                ssf.ai.ASR.set_asr_walkup()
                // ssf.ai.ASR.set_end_point()
                // asr_walkup = true
            }
        }


        const text = ssf.ai.ASR.get_result_with_timeout(10);
        // console.log(text)
        if (text != last_text && text != "") {
            last_text = text
            min_startTime = new Date();

            // console.log("?????",last_text,min_startTime)
        }
        // console.log("############",text)
        if (text == "" && last_text == "") {
            // console.log("出发空文本",text,last_text)
            set_init()

        } else {
            const endTime = new Date();
            const mininterval = (endTime - min_startTime) / 1000; // 计算时间间隔，单位为秒
            // console.log("-------------",min_startTime,mininterval)
            if (mininterval >= min_threshold) {
                // console.log("min")
                ssf.ai.ASR.set_end_point()
                // if (text == "中断命令") {
                //     console.log("触发中断命令")
                //     await break_command()
                //     return

                // }

                if (last_text != "") {
                    // console.log("触发发送")
                    self.postMessage(last_text)
                    set_asr_sleep()

                    // seg_text = ""

                }
                last_text = ""
                set_init()
                return

            }
            // min_startTime = new Date();
            const maxinterval = (endTime - max_startTime) / 1000; // 计算时间间隔，单位为秒

            if (maxinterval >= max_threshold) {
                // console.log("max")

                ssf.ai.ASR.set_end_point()

                // if (text == "中断命令") {
                //     console.log("触发中断命令")
                //     await break_command()
                //     return

                // }

                self.postMessage(last_text)
                set_asr_sleep()


                last_text = ""
                set_init()

                // seg_text = ""
                return
            }
            // seg_text += text;

            // }
        }
    } catch (error) {
        // seg_text = "";
        console.log(error)
    }
}, 30); // 每秒检查一次