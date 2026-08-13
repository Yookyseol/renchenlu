#!/bin/bash
# 壬辰录网站服务器启动脚本
# 用法：双击运行此脚本，或运行 ./start_server.sh

cd "/Users/wangxue/WorkBuddy/2026-08-12-09-09-45/网站开发/renchenlu-site/网站源码"

# 检查是否已有服务器在运行
if lsof -i :8082 > /dev/null 2>&1; then
    echo "✓ 服务器已在运行 (PID: $(lsof -ti:8082))"
    echo ""
    echo "访问地址："
    echo "  本机：http://localhost:8082"
    echo "  手机：http://192.168.10.21:8082"
    exit 0
fi

# 启动服务器
echo "正在启动服务器..."
python3 -m http.server 8082 --bind 0.0.0.0 &

# 等待服务器启动
sleep 2

if lsof -i :8082 > /dev/null 2>&1; then
    echo ""
    echo "✓ 服务器启动成功！"
    echo ""
    echo "访问地址："
    echo "  本机：http://localhost:8082"
    echo "  手机：http://192.168.10.21:8082"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 保持脚本运行
    wait
else
    echo "✗ 服务器启动失败，请检查Python是否安装"
    exit 1
fi
