@echo off
chcp 65001

REM 判断参数是否传入
IF "%~1"=="" (
  echo 错误：未提供参数，脚本中止执行。
  exit /b 1
)


set "fullpath=%~1"
echo 项目完整路径：%fullpath%

robocopy "env" "%fullpath%/env" /S 
robocopy "models/ppocrv4server" "%fullpath%/models/ppocrv4server" /S 
robocopy  "temp" "%fullpath%/temp"  
robocopy ".vscode" "%fullpath%/.vscode" /S 
copy  "quick_auto_deplpy.ts" "%fullpath%/quick_auto_deplpy.ts" 
copy  "初始化环境.bat" "%fullpath%/点我启动开发环境.bat" 
copy  "template\main.js" "%fullpath%\main.js"  
start "" "%fullpath%"
pause