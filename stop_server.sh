#!/bin/bash
# 停止服务器脚本
PID=$(lsof -ti:8082)
if [ -n "$PID" ]; then
    kill $PID
    echo "✓ 服务器已停止 (PID: $PID)"
else
    echo "服务器未在运行"
fi
