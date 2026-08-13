#!/bin/bash
# 持久化启动脚本 - 使用nohup确保进程不被会话关闭影响
cd "$(dirname "$0")"
nohup python3 -m http.server 8082 --bind 0.0.0.0 > /tmp/renchenlu_server.log 2>&1 &
SERVER_PID=$!
echo "服务器已启动！"
echo "PID: $SERVER_PID"
echo ""
echo "本机访问: http://localhost:8082"
echo "局域网访问: http://192.168.10.21:8082"
echo ""
echo "停止服务器: kill $SERVER_PID 或双击 stop.sh"
