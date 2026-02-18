@echo off
chcp 65001 >nul
REM 墨雪：数字书法博物馆 Docker 启动脚本 (Windows)
REM Ink & Snow: Digital Calligraphy Museum - Docker Start Script

echo ======================================================================
echo 🎨 墨雪：数字书法博物馆 / Ink ^& Snow: Digital Calligraphy Museum
echo ======================================================================
echo.

REM 检查是否是 Git 仓库
if exist .git (
    echo 📥 拉取最新代码...
    git pull origin main
    if errorlevel 1 (
        echo ⚠️  代码拉取失败，继续使用本地代码
    ) else (
        echo ✅ 代码已更新到最新版本
    )
    echo.
)

REM 检查 .env 文件是否存在
if not exist .env (
    echo ❌ 错误: .env 文件不存在
    echo.
    echo 请按以下步骤配置：
    echo 1. 复制示例文件: copy .env.example .env
    echo 2. 编辑 .env 文件，配置以下变量：
    echo.
    echo    # 支持多个 API Key，用逗号分隔
    echo    API_KEY=your_key1,your_key2,your_key3
    echo    API_URL=https://generativelanguage.googleapis.com
    echo    MODEL=gemini-2.0-flash-exp
    echo.
    echo 3. 获取 API Key: https://aistudio.google.com/app/apikey
    echo.
    exit /b 1
)

REM 停止并删除旧容器
echo 🧹 清理旧容器...
docker compose down

REM 构建并启动
echo 🔨 构建 Docker 镜像...
docker compose build

echo 🚀 启动容器...
docker compose up -d

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 5 /nobreak >nul

REM 检查容器状态
docker compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo ✅ 应用启动成功！
    echo ======================================================================
    echo.
    echo 📱 访问地址：
    echo    🌐 Web 应用: http://localhost:48888
    echo.
    echo 📋 常用命令：
    echo    查看日志: docker compose logs -f
    echo    停止应用: docker compose down
    echo    重启应用: docker compose restart
    echo.
    echo 💡 提示：
    echo    - 支持多个 Gemini API Key 轮询
    echo    - 失败的 Key 会在 5 分钟后自动重试
    echo    - 所有 Key 失败时会显示额度用完提示
    echo.
    echo ======================================================================
) else (
    echo.
    echo ❌ 应用启动失败，请查看日志：
    echo.
    docker compose logs
    exit /b 1
)

pause
