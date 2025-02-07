export function run(text){
  
    ssf.Input.key(ssf.enums.KeyCode.R, ssf.enums.Direction.Click)
    return -1
}

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