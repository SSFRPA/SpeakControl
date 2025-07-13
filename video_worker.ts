import { packFrame } from "./shared_utils.ts";

let running = false;
let sessionId = 0;
const buf = new Uint8Array(1024 * 1024);

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
  ssf.Frame.init();

  (async () => {
    while (running && sessionId === currentSession) {
      try {
        const size = ssf.Frame.encode(buf, 16, 30, 1920, 1080, 4, 80);
        if (size <= 0) continue;
        const packed = packFrame(0x01, buf.slice(0, size));
        self.postMessage(packed);
      } catch (_) { }

      await new Promise(r => setTimeout(r, 1));
    }
  })();
}
