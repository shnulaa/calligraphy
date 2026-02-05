import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 在ES模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🎨 启动书法博物馆应用...');
console.log('📂 工作目录:', __dirname);

// 启动后端服务器
console.log('📡 启动后端服务器...');
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// 等待1秒后启动前端
setTimeout(() => {
  console.log('🌐 启动前端预览服务器...');
  const preview = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', '3000'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  preview.on('error', (err) => {
    console.error('前端启动失败:', err);
    process.exit(1);
  });
}, 1000);

server.on('error', (err) => {
  console.error('后端启动失败:', err);
  process.exit(1);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('正在关闭应用...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('正在关闭应用...');
  process.exit(0);
});
