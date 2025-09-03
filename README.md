# Captra

基于 AI 大模型的验证码识别 API 服务，支持 OpenAI 和 Anthropic 模型。

## ✨ 特性

- 🤖 **AI 驱动**: 支持 OpenAI 和 Anthropic 模型
- 🎨 **现代 UI**: 基于 Next.js 15 + shadcn/ui + Tailwind CSS
- 🧪 **在线测试**: 内置测试页面，支持实时验证码识别
- 🔒 **后台管理**: 安全的配置管理和状态监控
- 📚 **API 文档**: 完整的使用文档和代码示例

## 🌐 一键部署

### Vercel 部署
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/YoungLee-coder/Captra)

> **注意**: 部署完成后需要在 Vercel 项目设置中手动添加环境变量。

### Netlify 部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YoungLee-coder/Captra&env=ADMIN_PASSWORD=admin123,MODEL_NAME=gpt-4o-mini,REQUEST_FORMAT=openai,NEXTAUTH_SECRET=your-nextauth-secret,NEXTAUTH_URL=https://your-site.netlify.app)

> **部署后必须配置**: 在 Netlify 环境变量设置中添加您的 `API_URL` 和 `API_KEY`

## 🚀 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/YoungLee-coder/Captra.git
   cd Captra
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp env.example .env.local
   ```
   
   编辑 `.env.local` 文件：
   ```env
   ADMIN_PASSWORD=your-secure-password
   API_URL=https://api.openai.com/v1/chat/completions
   API_KEY=your-api-key
   MODEL_NAME=gpt-4o-mini
   REQUEST_FORMAT=openai
   ```

4. **启动服务**
   ```bash
   pnpm dev
   ```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 📖 API 使用

**POST** `/api/recognize`

```json
{
  "image": "base64编码的图片数据"
}
```

**响应**
```json
{
  "success": true,
  "result": "ABC123",
  "processingTime": 1200
}
```

## 🎯 功能页面

- **首页**: API 文档和使用指南
- **在线测试**: 上传验证码图片即时测试
- **后台管理**: 模型配置、状态监控和测试

## 🤖 支持的模型

**OpenAI**: GPT-4o, GPT-4o-mini, GPT-4 Vision  
**Anthropic**: Claude-3.5 Sonnet, Claude-3 Opus, Claude-3 Haiku

## 📄 许可证

MIT License

---

**Captra** - 让验证码识别变得简单高效 🚀