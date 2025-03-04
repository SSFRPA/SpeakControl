@rem deno.exe   compile --unstable --allow-all --no-check  --private_key  ./private_key.data  pose.ts
@echo off
setlocal enabledelayedexpansion

REM 设置输出变量为空
set "INCLUDES="

REM 遍历module文件夹及其子文件夹中的所有.js文件
for /r modules %%f in (*.js) do (
    REM 将找到的文件路径添加到输出变量中，每个文件路径前加上 --include
    if "!INCLUDES!"=="" (
        set "INCLUDES=--include %%f"
    ) else (
        set "INCLUDES=!INCLUDES! --include %%f"
    )
)

REM 构建最终的Deno编译命令
set "DENOCMD=.\env\deno.exe compile --allow-all --unstable --no-check  --output .\bin\SpeakControl_Main.exe !INCLUDES! --include asr_ext.js  --node-modules-dir ./main.js"

REM 输出构建的命令以便检查
echo %DENOCMD%

REM 执行Deno编译命令
%DENOCMD%

endlocal

robocopy "env" "bin" /S /XF *.exe
@REM robocopy "modules" "bin/modules" /S /XF *.exe

robocopy "models" "bin/models" /S /XF *.exe
@REM robocopy "ui_ext" "bin/ui_ext" /S 
robocopy "ui_ext" "bin/" /S 

robocopy "voice_files" "bin/voice_files" /S 
robocopy "ext_tools" "bin/ext_tools" /S 




pause