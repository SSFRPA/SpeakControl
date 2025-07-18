import { WebUI } from "https://deno.land/x/webui@2.4.4/mod.ts";
import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.221.0/path/mod.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";
import { crypto } from "https://deno.land/std@0.207.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.207.0/encoding/hex.ts";
import { dirname, join } from "https://deno.land/std@0.167.0/path/mod.ts";

async function sha_file(path: string): Promise<string> {
    try {
        const file = await Deno.open(path, { read: true });
        const readableStream = file.readable;
        const fileHashBuffer = await crypto.subtle.digest("SHA-256", readableStream);
        const fileHash = encodeHex(fileHashBuffer);
        return fileHash;
    }
    catch {

        return ""
    }

}


function vscode_setup() {

    if (vscodePath == "未找到") {
        const default_vscodePath = "Programs\\VSCode\\";

        ssf.Windows.cmd("./temp/VSCodeUserSetup-x64-1.88.1.exe", ["/verysilent", `/dir="${default_vscodePath}"`, "/mergetasks=!runcode"])
        vscodePath = default_vscodePath
        vscodePath = ssf.Windows.get_reg_value("\\HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{771FD6B0-FA20-440A-A002-3B3BAC16DC50}_is1", "InstallLocation")
        console.log("vscode安装在", vscodePath)
        ssf.Sys.sleep(2000)
        //
    }
    const currentDirectory = Deno.cwd();

    const visx_path = currentDirectory + "\\temp\\vscode-deno.vsix";

    const sub_cmd = "& 'code' --install-extension '" + visx_path + "'";
    const cmd_result = ssf.Windows.cmd("powershell", ["-Command", sub_cmd])

    console.log(cmd_result)


}
function vs_open() {
    const currentDirectory = Deno.cwd();
    // const parentDirectory =dirname(currentDirectory);
    const pid = ssf.Windows.run(vscodePath + "\\Code.exe", [currentDirectory])

    // console.log(cmd_result)

}

//初始化环境
async function init_env() {

    //将所需文件都下载下来 分别是vs插件 语音生成模型 以及vscode
    const urls = []
    if (await sha_file("./temp/vscode-deno.vsix") != "7f042f02ac985e0da80145d479ff675bf5b36468a5971d174725ddfdc332ec7a") {
        console.log("插件sha", await sha_file("./temp/vscode-deno.vsix"))

        urls.push("https://github.com/denoland/vscode_deno/releases/download/3.44.2/vscode-deno.vsix");

    }
    // if (await sha_file("./temp/vits-zh-aishell3.zip") != "ffcd234452345af05923853275744bf5d2d3c8ef71d55740e5a9c69e6651e258" && is_tts) {
    //     urls.push("https://hub.nuaa.cf/SSFRPA/ssf/releases/download/models/vits-zh-aishell3.zip")
    // }

    if (await sha_file("./temp/VSCodeUserSetup-x64-1.100.3.exe") != "a7e37b9cf6d47beb4c564d167022ca324bfeb971944f21a9ce87e953e154a52b" && vscodePath == "未找到") {
        console.log("vscode sha", await sha_file("./temp/VSCodeUserSetup-x64-1.100.3.exe"))

        urls.push("https://vscode.download.prss.microsoft.com/dbazure/download/stable/258e40fedc6cb8edf399a463ce3a9d32e7e1f6f3/VSCodeUserSetup-x64-1.100.3.exe")
    }

    // if (await sha_file("./temp/vs_deno_config.zip") != "ede10c55bfdd21c64471e8278b978c98ab697337f0ac51795c6e9180e6b6cd9a") {
    //     urls.push("https://download.nuaa.cf/SSFRPA/ssf/releases/download/example/vs_deno_config.zip")

    // }
    if (urls.length > 0) {
        await ssf.Request.download(urls, "./temp", 1, 5, "")
    }
    // ssf.Sys.sleep(200000)

    // if (!existsSync('./.vscode')) {
    //     await decompress("./temp/vs_deno_config.zip", "./")

    // }
    // await check_init_tts_model()
}



let vscodePath = "未找到";
try {
    vscodePath = ssf.Windows.get_reg_value("\\HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{771FD6B0-FA20-440A-A002-3B3BAC16DC50}_is1", "InstallLocation")
}
catch {
    vscodePath = "未找到";
}

await init_env()
vscode_setup()
vs_open()