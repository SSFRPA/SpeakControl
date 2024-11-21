
import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";



ssf.ai.Translate.init_model("./models/translate/tokenizer-marian-base-zh2en.json", "./models/translate/tokenizer-marian-base-zh2en_des.json", "./models/translate/zh-en-model.safetensors");
if (!existsSync('./models/translate')) {
    console.log("找不到模型文件,将从github下载,如果您的网络不能翻墙,建议手动下载")
    const urls = []
    if (await sha_file("./temp/translate.zip") != "a3e3815002e7da57a093760a357c3f0f99c23eaa6ab0850921a8b1a25c8abdeb") {
        urls.push("https://github.com/SSFRPA/ssfrpa/releases/download/translate/translate.zip");

    }
    if (urls.length > 0) {
        await ssf.Request.download(urls, "./temp", 1, 5, "")
    }
    await decompress("./temp/translate.zip", "./models/");


}

export function run(text) {
    const tr_text = ssf.ai.Translate.parse(text);
    console.log("翻译模式", tr_text,text)
    ssf.Input.text(tr_text)

}
