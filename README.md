# Release Notes Generator

一个基于 Next.js + AI 的版本更新内容生成工具，输入原始更新文案，一键生成适配多个渠道的格式化发布内容。

## ✨ 功能特性

- **多渠道输出**：一次输入，自动生成 Discord（中英文）、Slack、官方渠道（iOS / Desktop / Android）等多种格式
- **邮件 Newsletter**：AI 自动从更新内容中筛选 3-5 个亮点，生成完整的 HTML 邮件模板，可直接下载使用
- **双格式输入支持**：兼容 Format A（按平台分类）和 Format B（按功能类型分类）两种原始文案格式
- **一键复制**：每个输出卡片支持一键复制，直接粘贴到对应渠道

## 🛠 技术栈

- **框架**：Next.js（App Router）+ TypeScript
- **UI**：Tailwind CSS
- **AI**：OpenAI GPT-4o

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
│   │   ├── generate/         # 解析原始文案并生成多渠道内容
│   │   └── generate-email/   # 生成邮件 Newsletter HTML
│   └── page.tsx              # 主页面
├── components/
│   ├── InputSection.tsx      # 输入区域
│   ├── OutputCard.tsx        # 输出卡片（含复制功能）
│   └── EmailHtmlCard.tsx     # 邮件预览卡片
└── lib/
    ├── templates.ts          # 各渠道模板生成逻辑
    ├── types.ts              # 类型定义
    └── openai.ts             # AI 调用封装
```
