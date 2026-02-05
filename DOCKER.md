# Docker 部署指南

## 快速开始

### 使用 Docker Compose（推荐）

1. 确保已安装 Docker 和 Docker Compose

2. 配置环境变量（编辑 `.env` 文件）：
```bash
NVIDIA_API_KEY=your_api_key
NVIDIA_API_URL=http://192.168.50.11:13000
NVIDIA_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_gemini_key
```

3. 启动应用：
```bash
docker-compose up -d
```

4. 访问应用：
- 前端：http://localhost:3000
- 后端API：http://localhost:3001

5. 查看日志：
```bash
docker-compose logs -f
```

6. 停止应用：
```bash
docker-compose down
```

### 使用 Docker（基础版）

1. 构建镜像：
```bash
docker build -t calligraphy-museum .
```

2. 运行容器：
```bash
docker run -d \
  --name calligraphy-museum \
  -p 3000:3000 \
  -p 3001:3001 \
  --env-file .env \
  calligraphy-museum
```

### 使用生产环境 Dockerfile

1. 构建生产镜像：
```bash
docker build -f Dockerfile.prod -t calligraphy-museum:prod .
```

2. 运行生产容器：
```bash
docker run -d \
  --name calligraphy-museum-prod \
  -p 3000:3000 \
  -p 3001:3001 \
  --env-file .env \
  --restart unless-stopped \
  calligraphy-museum:prod
```

## 常用命令

### 查看运行状态
```bash
docker ps
```

### 查看日志
```bash
docker logs -f calligraphy-museum
```

### 进入容器
```bash
docker exec -it calligraphy-museum sh
```

### 重启容器
```bash
docker restart calligraphy-museum
```

### 删除容器和镜像
```bash
docker stop calligraphy-museum
docker rm calligraphy-museum
docker rmi calligraphy-museum
```

## 健康检查

生产环境 Dockerfile 包含健康检查，可以查看容器健康状态：

```bash
docker inspect --format='{{.State.Health.Status}}' calligraphy-museum-prod
```

## 注意事项

1. **环境变量**：确保 `.env` 文件包含所有必需的API密钥
2. **端口冲突**：如果端口3000或3001已被占用，修改 `docker-compose.yml` 中的端口映射
3. **资源文件**：`assets` 目录会被挂载到容器中，确保图片文件存在
4. **网络配置**：如果API URL是内网地址，确保Docker容器可以访问

## 故障排查

### 容器无法启动
```bash
docker logs calligraphy-museum
```

### API连接失败
检查 `.env` 文件中的 `NVIDIA_API_URL` 是否正确，容器是否可以访问该地址

### 前端无法访问
确保端口3000没有被占用，检查防火墙设置
