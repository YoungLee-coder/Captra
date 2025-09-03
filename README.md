# Captra - AI验证码识别API服务

一个基于Next.js 15和shadcn/ui构建的现代化验证码识别API服务，集成第三方大模型（OpenAI、Anthropic等）实现高精度验证码识别。

## ✨ 特性

- 🚀 **现代化技术栈**: Next.js 15 + TypeScript + Tailwind CSS
- 🎨 **精美UI**: 基于shadcn/ui组件库
- 🤖 **AI驱动**: 支持OpenAI和Anthropic模型
- 🔒 **安全管理**: 后台密码保护和会话管理
- 📚 **完整文档**: 内置API使用文档和代码示例
- 🧪 **测试功能**: 内置验证码测试功能
- ⚡ **高性能**: 基于pnpm包管理和现代化架构

## 🏗️ 项目结构

```
Captra/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   ├── recognize/     # 验证码识别API
│   │   │   └── admin/         # 后台管理API
│   │   ├── admin/             # 后台管理页面
│   │   └── page.tsx           # 首页
│   ├── components/            # 组件
│   │   ├── ui/               # shadcn/ui组件
│   │   └── features/         # 功能组件
│   ├── lib/                  # 核心逻辑
│   │   ├── api/              # API服务
│   │   └── config/           # 配置管理
│   └── types/                # TypeScript类型定义
├── public/                   # 静态资源
└── env.example              # 环境变量示例
```

## 🚀 快速开始

### 1. 环境要求

- Node.js 18+
- pnpm

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

复制环境变量配置文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，配置以下变量：

```env
# 后台管理密码
ADMIN_PASSWORD=your-secure-password

# 大模型API配置
API_URL=https://api.openai.com/v1/chat/completions
API_KEY=your-api-key-here
MODEL_NAME=gpt-4o-mini
REQUEST_FORMAT=openai

# NextAuth配置
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📖 API使用文档

### 验证码识别接口

**接口地址**: `POST /api/recognize`

**请求参数**:
```json
{
  "image": "base64编码的图片数据",
  "format": "base64"
}
```

**响应格式**:
```json
{
  "success": true,
  "result": "识别出的验证码文本",
  "processingTime": 1500
}
```

### 使用示例

#### JavaScript/TypeScript
```javascript
const response = await fetch('/api/recognize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQ...'
  })
});

const result = await response.json();
console.log(result.result); // 验证码结果
```

#### Python
```python
import requests
import base64

# 读取图片并转换为base64
with open('captcha.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode()

response = requests.post('http://localhost:3000/api/recognize', 
    json={'image': image_base64})
    
result = response.json()
print(result['result'])  # 验证码结果
```

#### cURL
```bash
curl -X POST http://localhost:3000/api/recognize \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ..."
  }'
```

## 🔧 后台管理

1. 访问 [http://localhost:3000/admin](http://localhost:3000/admin)
2. 输入在环境变量中配置的管理员密码
3. 查看模型配置详情和测试功能

### 后台功能

- **配置查看**: 查看当前API配置和验证状态
- **模型测试**: 使用内置验证码图片测试模型识别能力
- **实时监控**: 查看API调用状态和性能指标

## ⚙️ 支持的模型

### OpenAI格式 (REQUEST_FORMAT=openai)
- GPT-4o, GPT-4o-mini
- GPT-4 Vision
- 其他支持vision的OpenAI模型

### Anthropic格式 (REQUEST_FORMAT=anthropic)  
- Claude-3.5 Sonnet
- Claude-3 Opus
- Claude-3 Haiku

## 🏗️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI库**: shadcn/ui + Tailwind CSS
- **类型系统**: TypeScript
- **包管理**: pnpm
- **图标**: Lucide React
- **部署**: Vercel兼容

## 📦 部署

### Vercel部署

1. Fork此仓库到你的GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### Docker部署

```bash
# 构建镜像
docker build -t captra .

# 运行容器
docker run -p 3000:3000 --env-file .env.local captra
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js文档](https://nextjs.org/docs)
- [shadcn/ui文档](https://ui.shadcn.com)
- [OpenAI API文档](https://platform.openai.com/docs)
- [Anthropic API文档](https://docs.anthropic.com)

---

**Captra** - 让验证码识别变得简单高效 🚀