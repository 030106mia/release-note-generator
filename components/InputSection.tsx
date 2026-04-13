'use client';

import { useState } from 'react';

interface InputSectionProps {
  onGenerate: (rawText: string) => void;
  isLoading: boolean;
  buttonText?: string;
}

export default function InputSection({ onGenerate, isLoading, buttonText }: InputSectionProps) {
  const [rawText, setRawText] = useState('');

  const exampleText = `iOS 1.3.0       Mac 1.2.7
New
【多端】
- Filo AI 能够完成和删除待办
- 收件箱列表，新增"发给我、抄送我、带附件、日期"筛选功能
- Filo AI能够快速创建Todo
【iOS】
- 设置中新增设置为默认邮件应用入口
Improvements
【多端】
- 在 Customize AI 设置后，写邮件时可以自动填入身份证、地址等信息
- AI发送按钮更换样式，与发送邮件按钮区分开
【iOS】
- AI写信的 UX（用户体验）调整
【Mac】
- AI结果版本切换，支持回退用户自己撰写的内容
Fixes
【iOS】
- 邮件详情页，引用部分格式错误的问题修复
【Mac】
- 链接内容不能填入草稿的问题修复`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawText.trim()) {
      onGenerate(rawText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="rawText" className="block text-sm font-medium text-zinc-300 mb-2">
          Raw Release Notes
        </label>
        <textarea
          id="rawText"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your raw release notes here...&#10;&#10;Example format:&#10;iOS 1.3.0       Mac 1.2.7&#10;New&#10;【多端】&#10;- Feature description...&#10;【iOS】&#10;- iOS specific feature..."
          className="w-full h-64 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !rawText.trim()}
        className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-400 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30"
      >
        {buttonText || (isLoading ? 'Generating...' : 'Generate Release Notes')}
      </button>
    </form>
  );
}

