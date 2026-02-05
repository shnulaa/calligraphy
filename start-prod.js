import { spawn } from 'child_process';

// 启动后端服务器
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// 启动前端预览服务器
const preview = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', '3000'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// 处理进程退出
const cleanup = () => {
  server.kill();
  preview.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('exit', (code) => {
  console.error('Server exited with code', code);
  cleanup();
});

preview.on('exit', (code) => {
  console.error('Preview exited with code', code);
  cleanup();
});
