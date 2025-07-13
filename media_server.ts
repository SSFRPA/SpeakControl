// === 依赖导入 ===
import { parse } from "jsr:@std/yaml/parse";
import { exists } from "jsr:@std/fs/exists";

// === 类型定义 ===
let config: {
  password: string;
  port: number;
  media_port: number;
  host: string;
  enable_asr: boolean;
  enable_kws: boolean;
};

// === 客户端集合 ===
const audioClients = new Set<WebSocket>();
const screenClients = new Set<WebSocket>();

// === 启动 Worker ===
const videoWorker = new Worker(
import.meta.resolve("./video_worker.ts"), { type: "module" }
);

const audioWorker = new Worker(
import.meta.resolve("./audio_worker.ts"), { type: "module" }
);
// === 音频回调：广播打包帧 ===
// audioWorker.onmessage = (e) => {
//   const msg = e.data;

//   if (msg instanceof Uint8Array) {
//     for (const client of audioClients) {
//       if (client.readyState === WebSocket.OPEN) {
//         const start = performance.now();

//         try {
//           client.send(msg);
//         } catch (err) {
//           console.error(`[主线程] 发送失败：`, err);
//           continue;
//         }

//         const end = performance.now();
//         const cost = (end - start).toFixed(3);
//         console.log(`[主线程] 发送给客户端耗时：${cost} ms`);
//       }
//     }
//   }
// };


audioWorker.onmessage = (e) => {
  const msg = e.data;

  if (msg instanceof Uint8Array) {
    const now = performance.now();

    for (const client of audioClients) {
      // const ws = client.ws;
      if (client.readyState === WebSocket.OPEN) {
        const lastTime = client.lastSendTime ?? now;
        const interval = now - lastTime;

        const sendStart = performance.now();
        try {
          client.send(msg);
        } catch (err) {
          console.error(`[主线程] 发送失败:`, err);
          continue;
        }
        const sendEnd = performance.now();
        const sendCost = sendEnd - sendStart;

        // 更新发送时间戳
        client.lastSendTime = now;

        // console.log(
        //   `[主线程] 发送给客户端，耗时 ${sendCost.toFixed(3)} ms，距离上次发送间隔 ${interval.toFixed(3)} ms`
        // );
      }
    }
  }
};


// === 视频回调：广播打包帧 ===
let lastSendTime = performance.now();
let frameCount = 0;              // 1秒内的帧数计数
let lastFPSReport = performance.now();

videoWorker.onmessage = (e) => {
  const msg = e.data;
  if (!(msg instanceof Uint8Array)) return;

  const now = performance.now();
  const interval = now - lastSendTime;
  lastSendTime = now;

  const sendStart = performance.now();

  let clientCount = 0;
  for (const client of screenClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
      clientCount++;
    }
  }

  const sendEnd = performance.now();
  const sendCost = sendEnd - sendStart;

  // console.log(`[主线程] 视频帧发送：耗时 ${sendCost.toFixed(3)} ms，距离上次间隔 ${interval.toFixed(3)} ms，客户端数：${clientCount}`);

  // 增加帧计数
  frameCount++;

  // 每 1 秒打印一次 FPS（发送次数）
  if (now - lastFPSReport >= 1000) {
    // console.log(`[主线程] 当前帧率：${frameCount} FPS`);
    frameCount = 0;
    lastFPSReport = now;
  }
};

// === 初始化服务 ===
export async function init_server() {
  try {
    const configPath = (await exists("config.yaml")) ? "config.yaml"
      : new URL("./config.yaml", import.meta.url).pathname;
    config = parse(await Deno.readTextFile(configPath)) as typeof config;
  } catch (err) {
    console.error("❌ 配置读取失败:", err);
    Deno.exit(1);
  }

  // === 启动媒体 WebSocket 服务 ===
  Deno.serve({ port: config.media_port, hostname: config.host }, (req) => {
    const url = new URL(req.url);

    if (url.searchParams.get("password") !== config.password) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (req.headers.get("upgrade") !== "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "start_audio_stream":
            audioClients.add(socket);
            if (audioClients.size === 1) audioWorker.postMessage({ type: "start" });
            break;
          case "stop_audio_stream":
            audioClients.delete(socket);
            if (audioClients.size === 0) audioWorker.postMessage({ type: "stop" });
            break;
          case "start_screen_stream":
            screenClients.add(socket);
            if (screenClients.size === 1) videoWorker.postMessage({ type: "start" });
            break;
          case "stop_screen_stream":
            screenClients.delete(socket);
            if (screenClients.size === 0) videoWorker.postMessage({ type: "stop" });
            break;
        }
      } catch (_) {}
    });

    socket.addEventListener("close", () => {
      audioClients.delete(socket);
      screenClients.delete(socket);
      if (audioClients.size === 0) audioWorker.postMessage({ type: "stop" });
      if (screenClients.size === 0) videoWorker.postMessage({ type: "stop" });
    });

    return response;
  });
}
