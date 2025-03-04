

ssf.ai.ASR.listen_input("./models/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20", 2.4, 1.2, 10.0, 0);
console.log("开始监听麦克风");
let min_startTime = 0
let max_startTime = 0
const max_threshold = 5;
const min_threshold = 1.0;

let seg_text = ""

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
        timeout: 5000 // 5秒超时
    };
    await ssf.Request.post([requestModel]);
}

while (true) {
    try {
        // console.log("监听中.....")
        const text = ssf.ai.ASR.get_result_with_timeout(100);

        if (seg_text == "") {
            min_startTime = new Date();
            max_startTime = new Date();
            seg_text += text;
        } else {
            const endTime = new Date();
            const mininterval = (endTime - min_startTime) / 1000; // 计算时间间隔，单位为秒
            if (text == "") {
                if (mininterval >= min_threshold) {
                    if (seg_text == "中断命令") {
                        console.log("触发中断命令")
                        await break_command()
                        break

                    }
                    if (seg_text != "") {
                        self.postMessage(seg_text)
                        seg_text = ""

                    }

                }
            }
            else {
                min_startTime = new Date();
                const maxinterval = (endTime - max_startTime) / 1000; // 计算时间间隔，单位为秒

                if (maxinterval >= max_threshold) {
                    if (seg_text == "中断命令") {
                        console.log("触发中断命令")
                        await break_command()
                        break

                    }
                    self.postMessage(seg_text)

                    seg_text = ""
                    continue
                }
                seg_text += text;

            }
        }
    } catch (error) {
        seg_text = "";
        console.log(error)
    }

}