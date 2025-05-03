// export function run(text){
  
//     ssf.Input.key(ssf.enums.KeyCode.R, ssf.enums.Direction.Click)
//     return -1
// }
// ssf.Windows.cmd("start",["C:\\Users\\ybbtuubj\\Desktop\\夸克.lnk"]);
// console.log("????")
// ssf.Windows.run("cmd", ["/c","start","C:\\Users\\ybbtuubj\\Desktop\\夸克.lnk"]);
// import { EdgeTTS  } from "npm:node-edge-tts";
// // const tts = new EdgeTTS()
// const tts = new EdgeTTS({
//     voice: 'en-US-AriaNeural',
//     lang: 'en-US',
//     outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
//     saveSubtitles: true,
//     proxy: 'http://localhost:7890',
//     pitch: '-10%',
//     rate: '+10%',
//     volume: '-50%',
//     timeout: 10000
//   })
// await tts.ttsPromise('Hello world', "d:\\1.mp3")



// ssf.Frame.init()
// ssf.ai.OCR.init_model("./models/ppocrv4server/");

// const screen_info = ssf.Frame.screen_info();
// let scale = 1920 / screen_info.width;
// //进行缩放有效避免计算量过大 注意directml后续会优化性能 目前directml在多线程中表现较差
// if (scale >= 1) {
//     scale = 0.5;
// }

// const screen_img = ssf.Frame.to_image(20, 1000);
// const ocr_result = ssf.ai.OCR.parse(screen_img);
// console.log(JSON.stringify(ocr_result) )