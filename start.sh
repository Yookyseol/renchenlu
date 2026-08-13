#!/bin/bash
# 壬辰录网站服务器启动脚本
# 使用方法：双击运行或终端执行 ./start.sh

cd "$(dirname "$0")"

# 检查是否已有服务器在运行
if lsof -i :8082 > /dev/null 2>&1; then
    echo "服务器已在运行中（PID: $(lsof -ti:8082)）"
    echo "访问地址: http://localhost:8082 或 http://192.168.10.21:8082"
    exit 0
fi

# 启动服务器
nohup python3 -m http.server 8082 --bind 0.0.0.0 > /tmp/renchenlu_server.log 2>&1 &
SERVER_PID=$!

sleep 2

# 验证是否启动成功
if lsof -i :8082 > /dev/null 2>&1; then
    echo "✅ 服务器启动成功！"
    echo ""
    echo "访问地址："
    echo "  本机：http://localhost:8082"
    echo "  手机：http://192.168.10.21:8082"
    echo ""
    echo "停止服务器：双击 stop.sh 或运行 kill $SERVER_PID"
else
    echo "❌ 服务器启动失败，请检查日志：/tmp/renchenlu_server.log"
fi
