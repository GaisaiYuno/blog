---
title: vscode配置
abbrlink: 849a3ae4
date: 2019-07-12 15:24:36
tags:
- 实用
---
从学校电脑上拷回来的，应该电脑上装了g++或dev c++都可以使用，对于OIer非常方便
lauch.json
```
{
​    // 使用 IntelliSense 了解相关属性。 
​    // 悬停以查看现有属性的描述。
​    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
​    "version": "0.2.0",
​    "configurations": [
​        {
​            "name": "(Windows) Launch",
​            "type": "cppvsdbg",
​            "request": "launch",
​            "program": "cmd",
​            "args": [
​                "/c",
​                "${fileBasenameNoExtension}.exe",
​                "&echo.",
​                "&pause"
​            ],
​            "stopAtEntry": false,
​            "cwd": "${fileDirname}",
​            "environment": [],
​            "externalConsole": true
​        },
​        {
​            "name": "(Windows)(g++) Build&Launch",
​            "type": "cppvsdbg",
​            "request": "launch",
​            "program": "cmd",
​            "args": [
​                "/c",
​                "${fileBasenameNoExtension}.exe",
​                "&echo.",
​                "&pause"
​            ],
​            "stopAtEntry": false,
​            "cwd": "${fileDirname}",
​            "environment": [],
​            "externalConsole": true,
​            "preLaunchTask": "g++.exe build active file"
​        },
​        {
​            "name": "(gdb)(g++) Launch",
​            "type": "cppdbg",
​            "request": "launch",
​            "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
​            "args": [],
​            "stopAtEntry": false,
​            "cwd": "${fileDirname}",
​            "environment": [],
​            "externalConsole": true,
​            "MIMode": "gdb",
​            "miDebuggerPath": "gdb.exe",
​            "preLaunchTask": "g++.exe build active file",
​            "setupCommands": [
​                {
​                    "description": "Enable pretty-printing for gdb",
​                    "text": "-enable-pretty-printing",
​                    "ignoreFailures": true
​                }
​            ]
​        },
​        {
​            "name": "(Windows)(g++) Build&Launch (O2)",
​            "type": "cppvsdbg",
​            "request": "launch",
​            "program": "cmd",
​            "args": [
​                "/c",
​                "${fileBasenameNoExtension}.exe",
​                "&echo.",
​                "&pause"
​            ],
​            "stopAtEntry": false,
​            "cwd": "${fileDirname}",
​            "environment": [],
​            "externalConsole": true,
​            "preLaunchTask": "g++.exe build active file with O2"
​        },
​    ],

}
```
tasks.json
```
{
    "tasks": [
        {
            "type": "shell",
            "label": "g++.exe build active file",
            "command": "g++",
            "args": [
                "-Wall",
                "-g",
                "${fileDirname}\\${fileBasenameNoExtension}.cpp",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            // "options": {
            //     "cwd": "C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin"
            // }
            //如果电脑上没有g++，但是装了dev c++，去掉这行注释
        }
    ],
    "version": "2.0.0"
}
```