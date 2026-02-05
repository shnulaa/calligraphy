# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制所有源代码
COPY . .

# 构建前端
RUN npm run build

# 暴露端口
EXPOSE 3000 3001

# 设置环境变量
ENV NODE_ENV=production

# 启动应用（同时运行前端和后端）
CMD ["npm", "start"]
