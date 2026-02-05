@echo off
REM 书法博物馆 Docker 启动脚本 (Windows)

echo 🎨 启动书法博物馆应用...

REM 检查 .env 文件是否存在
if not exist .env (
    echo ❌ 错误: .env 文件不存在
    echo 请创建 .env 文件并配置以下变量：
    echo   NVIDIA_API_KEY=your_api_key
    echo   NVIDIA_API_URL=http://192.168.50.11:13000
    echo   NVIDIA_MODEL=gemini-2.5-flash
    echo   GEMINI_API_KEY=your_gemini_key
    exit /b 1
)

REM 停止并删除旧容器
echo 🧹 清理旧容器...
docker compose down

REM 构建并启动
echo 🔨 构建镜像...
docker compose build

echo 🚀 启动容器...
docker compose up -d

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 5 /nobreak >nul

REM 检查容器状态
docker compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ 应用启动成功！
    echo.
    echo 📱 访问地址：
    echo   前端: http://localhost:3000
    echo   后端: http://localhost:3001
    echo.
    echo 📋 查看日志: docker compose logs -f
    echo 🛑 停止应用: docker compose down
) else (
    echo ❌ 应用启动失败，请查看日志：
    docker compose logs
    exit /b 1
)
