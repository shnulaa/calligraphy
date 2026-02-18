# 安全检查清单 / Security Checklist

## ✅ 已通过的安全检查 / Passed Security Checks

### 1. 环境变量保护 / Environment Variables Protection
- ✅ `.env` 文件已添加到 `.gitignore`
- ✅ `.env` 文件未被 Git 追踪
- ✅ 提供了 `.env.example` 作为配置模板（不包含真实密钥）
- ✅ 所有敏感配置通过环境变量读取，无硬编码

### 2. API Key 安全 / API Key Security
- ✅ API Keys 仅存储在 `.env` 文件中
- ✅ 代码中通过 `process.env.API_KEY` 读取，无硬编码
- ✅ 支持多个 API Key 轮询，降低单点故障风险
- ✅ 失败的 Key 自动标记并跳过

### 3. Git 配置 / Git Configuration
- ✅ `.gitignore` 正确配置，排除敏感文件：
  - `.env`
  - `.env.*` (除了 `.env.example`)
  - `node_modules`
  - `dist`
  - 备份文件

### 4. Docker 安全 / Docker Security
- ✅ Docker 容器通过环境变量传递配置
- ✅ `.dockerignore` 排除不必要的文件
- ✅ 不在镜像中硬编码敏感信息

### 5. 代码安全 / Code Security
- ✅ 无硬编码的密码、密钥或令牌
- ✅ 后端 API 使用环境变量配置
- ✅ 前端不直接暴露 API Keys（通过后端代理）

## ⚠️ 提交前检查 / Pre-commit Checklist

在提交代码到 GitHub 之前，请确认：

1. **检查 .env 文件**
   ```bash
   git status
   # 确保 .env 不在待提交列表中
   ```

2. **验证 .gitignore**
   ```bash
   git check-ignore .env
   # 应该输出: .env
   ```

3. **检查已追踪的文件**
   ```bash
   git ls-files | grep "\.env"
   # 应该只输出: .env.example
   ```

4. **搜索可能的密钥泄露**
   ```bash
   # 在 Windows PowerShell 中
   git grep -i "AIzaSy" -- ':!.env'
   
   # 在 Linux/Mac 中
   git grep -i "AIzaSy" | grep -v ".env:"
   ```

## 🔒 最佳实践 / Best Practices

### 开发环境 / Development
1. 永远不要将 `.env` 文件提交到版本控制
2. 使用 `.env.example` 作为配置模板
3. 在团队中共享配置结构，而非实际密钥
4. 定期轮换 API Keys

### 生产环境 / Production
1. 使用环境变量或密钥管理服务（如 AWS Secrets Manager）
2. 限制 API Key 的权限和配额
3. 启用 API Key 的 IP 白名单（如果支持）
4. 监控 API 使用情况，及时发现异常

### API Key 管理 / API Key Management
1. 为不同环境使用不同的 API Keys
2. 定期检查和撤销不使用的 Keys
3. 配置多个 Keys 实现负载均衡和容错
4. 记录每个 Key 的用途和所有者

## 🚨 如果密钥泄露 / If Keys Are Leaked

如果不小心将 API Keys 提交到了 GitHub：

1. **立即撤销泄露的 Keys**
   - 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
   - 删除泄露的 API Keys

2. **生成新的 Keys**
   - 创建新的 API Keys
   - 更新本地 `.env` 文件

3. **清理 Git 历史**（如果已推送）
   ```bash
   # 使用 BFG Repo-Cleaner 或 git-filter-repo
   # 警告：这会重写 Git 历史
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # 强制推送
   git push origin --force --all
   ```

4. **通知团队成员**
   - 告知团队密钥已更换
   - 要求所有人更新本地配置

## 📞 报告安全问题 / Report Security Issues

如果发现安全漏洞，请通过以下方式报告：
- 创建私有 Issue
- 发送邮件到项目维护者
- 不要公开披露安全漏洞

## 📚 参考资源 / References

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: API Security](https://owasp.org/www-project-api-security/)
- [Google: API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
