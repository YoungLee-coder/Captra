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

## ⚙️ 环境变量配置

### 必需配置
| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ADMIN_PASSWORD` | 后台管理密码 | `admin123` |
| `API_KEY` | 大模型 API 密钥 | `sk-xxx...` 或 `sk-ant-xxx...` |

### 模型配置
| 变量名 | 说明 | 默认值 | 可选值 |
|--------|------|--------|--------|
| `API_URL` | API 请求地址 | `https://api.openai.com/v1/chat/completions` | OpenAI 或其他兼容的 API 端点 |
| `MODEL_NAME` | 模型名称 | `gpt-4o-mini` | `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet-20241022` 等 |
| `REQUEST_FORMAT` | 请求格式 | `openai` | `openai`, `anthropic` |

### 高级配置
| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `THINKING_MODE` | 思考模式参数（可选） | 空 | `disabled`, `enabled` |
| `NEXTAUTH_SECRET` | 会话密钥 | `default-secret` | 随机生成的安全字符串 |
| `NEXTAUTH_URL` | 应用地址 | `http://localhost:3000` | 生产环境的完整域名 |

### 配置说明

#### 思考模式 (THINKING_MODE)
- **作用**: 为支持深度思考的模型添加思考模式参数
- **使用**: 设置后会在 API 请求中添加 `thinking` 字段
- **示例**:
  ```env
  # 禁用思考模式
  THINKING_MODE=disabled
  
  # 启用思考模式
  THINKING_MODE=enabled
  
  # 不设置则不添加该参数（默认行为）
  THINKING_MODE=
  ```

#### 模型格式配置
根据您使用的模型提供商选择对应的配置：

**OpenAI 配置**:
```env
API_URL=https://api.openai.com/v1/chat/completions
API_KEY=sk-your-openai-key
MODEL_NAME=gpt-4o-mini
REQUEST_FORMAT=openai
```

**Anthropic 配置**:
```env
API_URL=https://api.anthropic.com/v1/messages
API_KEY=sk-ant-your-anthropic-key
MODEL_NAME=claude-3-5-sonnet-20241022
REQUEST_FORMAT=anthropic
```

### 完整配置示例
```env
# 后台管理
ADMIN_PASSWORD=your-secure-password-123

# 大模型API配置
API_URL=https://api.openai.com/v1/chat/completions
API_KEY=sk-your-api-key-here
MODEL_NAME=gpt-4o-mini
REQUEST_FORMAT=openai

# 思考模式配置（可选）
THINKING_MODE=disabled

# NextAuth配置
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📄 许可证

MIT License

---

**Captra** - 让验证码识别变得简单高效 🚀