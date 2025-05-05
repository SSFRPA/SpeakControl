// globalThis.sleep_mode = false
ssf.ai.Device.init_audio()

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
export function run(text, modules, current_mode) {
    // console.log("@@@@@@@@@模式切换", text)
    // console.log("!!!!!!!!!!!!!!!.....",ssf.ai.ASR.get_kws_state(),ssf.ai.ASR.get_asr_state())

    if (text == "唤醒模式") {
        checkPlay(voice2)
        // ssf.ai.ASR.enable_kws(true)
        console.log(globalThis.asr_ext_worke)
        globalThis.asr_ext_worker.postMessage("唤醒模式")
        globalThis.current_mode.mode = "command"
        globalThis.current_mode.module = null
        return
    }
    if (text == "命令模式") {
        // ssf.ai.ASR.enable_kws(false)
        checkPlay(voice2)

        globalThis.current_mode.mode = "command"
        globalThis.current_mode.module = null
        return
        // globalThis.sleep_mode = false
    }
    modules.forEach(element => {
        if (element.command_name == text) {
            // console.log("关闭唤醒模式")

            globalThis.current_mode.mode = "lock"
            globalThis.current_mode.module = element.module
        }
    });


}
