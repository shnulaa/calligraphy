# 生产环境 Dockerfile
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装所有依赖
RUN npm ci

# 复制源代码和资源文件
COPY . .

# 构建前端
RUN npm run build

# 确保 assets 目录在 dist 中（包括 css 子目录）
RUN mkdir -p dist/assets && cp -r assets/* dist/assets/ || true

# 暴露端口
EXPOSE 3000 3001

# 设置环境变量
ENV NODE_ENV=production

# 启动应用（后端 + 前端预览服务器）
CMD ["node", "start-prod.js"]
