#!/bin/bash

# 书法博物馆 Docker 启动脚本

echo "🎨 启动书法博物馆应用..."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "❌ 错误: .env 文件不存在"
    echo "请创建 .env 文件并配置以下变量："
    echo "  NVIDIA_API_KEY=your_api_key"
    echo "  NVIDIA_API_URL=http://192.168.50.11:13000"
    echo "  NVIDIA_MODEL=gemini-2.5-flash"
    echo "  GEMINI_API_KEY=your_gemini_key"
    exit 1
fi

# 停止并删除旧容器
echo "🧹 清理旧容器..."
docker compose down

# 构建并启动
echo "🔨 构建镜像..."
docker compose build

echo "🚀 启动容器..."
docker compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查容器状态
if docker compose ps | grep -q "Up"; then
    echo "✅ 应用启动成功！"
    echo ""
    echo "📱 访问地址："
    echo "  前端: http://localhost:3000"
    echo "  后端: http://localhost:3001"
    echo ""
    echo "📋 查看日志: docker compose logs -f"
    echo "🛑 停止应用: docker compose down"
else
    echo "❌ 应用启动失败，请查看日志："
    docker compose logs
    exit 1
fi
