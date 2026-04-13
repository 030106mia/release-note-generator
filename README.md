# Release Notes Generator

一个基于 Next.js + AI 的版本更新内容生成工具，输入原始更新文案，一键生成适配多个渠道的格式化发布内容。

## ✨ 功能特性

- **多渠道输出**：一次输入，自动生成 Official（iOS / Desktop / Android）、Discord（英文 + 繁中）、Slack 等多种格式
- **AI 精选亮点**：Discord 和 Slack 渠道由 AI 自动筛选最重要的功能亮点，生成简洁的公告内容
- **双格式输入支持**：兼容按平台分类和按功能类型分类两种原始文案格式
- **一键复制**：每个输出卡片支持一键复制，直接粘贴到对应渠道

## 🛠 技术栈

- **框架**：Next.js（App Router）+ TypeScript
- **UI**：Tailwind CSS
- **AI**：兼容 OpenAI API 格式的 LLM 服务

## 🚀 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量，创建 `.env.local`：
   ```
   OPENAI_API_KEY=your_api_key
   OPENAI_BASE_URL=https://your-proxy.com/v1
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 打开 `http://localhost:3000`

## 📥 输入格式示例

支持两种格式：

**Format A**（按平台分类）：
```
iOS 1.3.3  Mac 1.3.0  Android 1.2.0.1
iOS
Improvements
- 提升APP的稳定性
Fixes
- 解决登录失败报错的问题
Mac
New
- 支持文件预览放大缩小操作
...
```

**Format B**（按功能类型分类，多端标注）：
```
iOS 1.3.0  Mac 1.2.7
New
【多端】
- Filo AI 能够完成和删除待办
【iOS】
- 设置中新增设置为默认邮件应用入口
Improvements
...
```

## 📁 项目结构

```
├── app/
│   ├── api/
│   │   └── generate/         # 5 阶段 AI 处理（提取→润色→Discord 亮点→Slack 亮点→模板生成）
│   └── page.tsx              # 主页面
├── components/
│   ├── InputSection.tsx      # 输入区域
│   ├── OutputCard.tsx        # 输出卡片（含复制功能）
│   └── LoadingSpinner.tsx    # 加载动画
└── lib/
    ├── openai.ts             # AI 调用封装与提示词
    ├── templates.ts          # 各渠道模板生成逻辑
    └── types.ts              # 类型定义
```
