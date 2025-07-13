import { packFrame } from "./shared_utils.ts";

let running = false;
let sessionId = 0;

self.onmessage = (e) => {
  const msg = e.data;
  if (msg.type === "start") {
    if (!running) {
      running = true;
      sessionId++;
      startCapture(sessionId);
    }
  } else if (msg.type === "stop") {
    running = false;
    sessionId++;
  }
};

function startCapture(currentSession: number) {
  const silenceChunk = new Uint8Array(1764);
  ssf.Frame.listen_output();

  let lastSendTime = performance.now();
  let frameId = 0;

  (async () => {
    while (running && sessionId === currentSession) {
      const now = performance.now();
      const interval = now - lastSendTime;
      lastSendTime = now;

      const stepStart = performance.now();

      let chunk: Uint8Array;
      let getStart = performance.now();
      try {
        chunk = ssf.Frame.get_audio_data(1);
        if (!(chunk instanceof Uint8Array)) {
          chunk = silenceChunk;
        }
      } catch {
        // chunk = silenceChunk;
        continue
      }
      let getEnd = performance.now();

      const packed = packFrame(0x02, chunk);
      let sendStart = performance.now();
      self.postMessage(packed);
      let sendEnd = performance.now();

      // 打印详细时间信息
      // console.log(`[音频帧 ${frameId++}]`);
      // console.log(`  距离上次发送间隔：${interval.toFixed(3)} ms`);
      // console.log(`  get_audio_data 耗时：${(getEnd - getStart).toFixed(3)} ms`);
      // console.log(`  postMessage 耗时   ：${(sendEnd - sendStart).toFixed(3)} ms`);
      // console.log(`  本轮总耗时         ：${(performance.now() - stepStart).toFixed(3)} ms`);
      // console.log('');

      await new Promise(r => setTimeout(r, 1));
    }

    console.log("[音频线程] 停止");
  })();
}
