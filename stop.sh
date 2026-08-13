#!/bin/bash
# 停止壬辰录网站服务器

PID=$(lsof -ti:8082 2>/dev/null)
if [ -n "$PID" ]; then
    kill $PID
    echo "服务器已停止 (PID: $PID)"
else
    echo "服务器未在运行"
fi
