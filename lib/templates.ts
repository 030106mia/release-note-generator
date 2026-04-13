import { ParsedReleaseNotes, GeneratedReleaseNotes, ReleaseNoteItem, DiscordHighlightItem, SlackHighlights, AndroidStoreContent, MultiLangContent } from './types';

type Lang = 'cn' | 'en' | 'tc' | 'ja';

function formatItems(items: ReleaseNoteItem[], lang: Lang, prefix: string = '> '): string {
  if (items.length === 0) return '';
  return items.map((item, i) => `${prefix}${i + 1}. ${item[lang]}`).join('\n');
}

function formatItemsSimple(items: ReleaseNoteItem[], lang: Lang): string {
  if (items.length === 0) return '';
  return items.map((item, i) => `> ${i + 1}. ${item[lang]}`).join('\n');
}

function formatItemsDash(items: ReleaseNoteItem[], lang: Lang): string {
  if (items.length === 0) return '';
  return items.map(item => `- ${item[lang]}`).join('\n');
}

// ============================================
// App Store Templates
// ============================================

export function generateAppStoreIOS(data: ParsedReleaseNotes): MultiLangContent {
  const buildLang = (lang: Lang, headers: { new: string; improvements: string; fixes: string }, feedback: string): string => {
    const parts: string[] = [];
    if (lang === 'en') parts.push(data.iosVersion);
    if (data.iosNew.length > 0) parts.push(`${headers.new}\n${formatItemsDash(data.iosNew, lang)}`);
    if (data.iosImprovements.length > 0) parts.push(`${headers.improvements}\n${formatItemsDash(data.iosImprovements, lang)}`);
    if (data.iosFixes.length > 0) parts.push(`${headers.fixes}\n${formatItemsDash(data.iosFixes, lang)}`);
    parts.push(feedback);
    return parts.join('\n');
  };

  return {
    en: buildLang('en', { new: 'New Features', improvements: 'Improvements', fixes: 'Bug Fixes' }, 'We welcome any feedback! You can join our Discord community or email us at support@filomail.com.'),
    cn: buildLang('cn', { new: '【新功能】', improvements: '【优化】', fixes: '【问题修复】' }, '欢迎提供任何反馈！您可以加入我们的Discord用户群或发送邮件至 support@filomail.com。'),
    tc: buildLang('tc', { new: '【新功能】', improvements: '【優化】', fixes: '【問題修復】' }, '歡迎提供任何回饋！您可以加入我們的 Discord 使用者社群或寄送郵件至 support@filomail.com。'),
    ja: buildLang('ja', { new: '新機能', improvements: '改善', fixes: '不具合修正' }, 'フィードバックをお待ちしています！Discordコミュニティに参加するか、support@filomail.com までメールでご連絡ください。'),
  };
}

export function generateAppStoreDesktop(data: ParsedReleaseNotes): MultiLangContent {
  const buildLang = (lang: Lang, headers: { new: string; improvements: string; fixes: string }, feedback: string): string => {
    const parts: string[] = [];
    if (lang === 'en') parts.push(data.macVersion);
    if (data.macNew.length > 0) parts.push(`${headers.new}\n${formatItemsDash(data.macNew, lang)}`);
    if (data.macImprovements.length > 0) parts.push(`${headers.improvements}\n${formatItemsDash(data.macImprovements, lang)}`);
    if (data.macFixes.length > 0) parts.push(`${headers.fixes}\n${formatItemsDash(data.macFixes, lang)}`);
    parts.push(feedback);
    return parts.join('\n');
  };

  return {
    en: buildLang('en', { new: "What's New", improvements: 'Improvements', fixes: 'Bug Fixes' }, 'We welcome any feedback! Join our Discord community or email us at support@filomail.com.'),
    cn: buildLang('cn', { new: '【新功能】', improvements: '【优化】', fixes: '【问题修复】' }, '欢迎提供任何反馈！您可以加入我们的 Discord 用户群或发送邮件至 support@filomail.com。'),
    tc: buildLang('tc', { new: '【新功能】', improvements: '【優化】', fixes: '【問題修復】' }, '歡迎提供任何回饋！您可以加入我們的 Discord 用戶群，或寄送電子郵件至 support@filomail.com。'),
    ja: buildLang('ja', { new: '新機能', improvements: '改善', fixes: '不具合修正' }, 'フィードバックをぜひお寄せください！Discordコミュニティへの参加、または support@filomail.com までメールでご連絡いただけます。'),
  };
}

export function generateAppStoreAndroid(androidStore: AndroidStoreContent): string {
  const localeOrder = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'it-IT', 'es-ES', 'pt-BR', 'ru-RU', 'th', 'uk', 'hi'];

  return localeOrder.map(locale => {
    const data = androidStore[locale];
    if (!data) return '';
    const items = data.items.map(item => `- ${item}`).join('\n');
    return `<${locale}>\n${items}\n\n${data.feedback}\n\n</${locale}>`;
  }).filter(Boolean).join('\n\n');
}

// ============================================
// Discord Templates
// ============================================

export function generateDiscordEN(highlights: DiscordHighlightItem[]): string {
  const items = highlights.map(h =>
    `${h.emoji}   **${h.titleEN}**\n> ${h.descEN}`
  ).join('\n\n');

  return `@everyone 😼 This week, Filo has mainly updated the following:\n\n${items}\n\nFor the full changelog, please check the update notes on our website.\n\nFeel free to share your experience and feedback in the [#feedback] channel!`;
}

export function generateDiscordTC(highlights: DiscordHighlightItem[]): string {
  const items = highlights.map(h =>
    `${h.emoji}  **${h.titleTC}**\n\n> ${h.descTC}`
  ).join('\n\n');

  return `<@&1356906492363673722> <@&1429662407390793790>\n😼 本週 Filo 主要更新了以下內容：\n\n${items}\n\n各客戶端其他的變更內容，都整理在官網更新日誌裡\n\n歡迎在 [#feedback] 頻道回饋使用體驗～`;
}

// ============================================
// Slack Template
// ============================================

export function generateSlack(highlights: SlackHighlights): string {
  const coreSection = highlights.coreHighlights.map(h =>
    `*${h.title}*\n${h.desc}`
  ).join('\n\n');

  const platformSection = highlights.platformHighlights.map(p => {
    const items = p.items.join('\n');
    return `*${p.platform}（${p.version}）*\n${items}`;
  }).join('\n\n');

  let body = coreSection;
  if (platformSection) {
    body += '\n\n' + platformSection;
  }

  return `:filomail-icon-v2: Filo 本次主要更新以下功能：\n\n${body}\n\n各个客户端其他的优化和修复内容，我们都整理在官网更新日志 里啦\n\n欢迎在群里反馈更多使用体验 ~`;
}

// ============================================
// Official Templates (existing, unchanged)
// ============================================

export function generateOfficialDesktop(data: ParsedReleaseNotes): string {
  const newSection = data.macNew.length > 0
    ? `🚀 **\`NEW\`**\n${formatItemsSimple(data.macNew, 'en')}\n\n` : '';
  const improvementsSection = data.macImprovements.length > 0
    ? `✨ **\`IMPROVEMENTS\`**\n${formatItemsSimple(data.macImprovements, 'en')}\n\n` : '';
  const fixesSection = data.macFixes.length > 0
    ? `🧰 **\`FIXES\`**\n${formatItemsSimple(data.macFixes, 'en')}` : '';

  return `**v${data.macVersion}**

${newSection}${improvementsSection}${fixesSection}`.trim();
}

export function generateOfficialIOS(data: ParsedReleaseNotes): string {
  const newSection = data.iosNew.length > 0
    ? `🚀 **\`NEW\`**\n${formatItemsSimple(data.iosNew, 'en')}\n\n` : '';
  const improvementsSection = data.iosImprovements.length > 0
    ? `✨ **\`IMPROVEMENTS\`**\n${formatItemsSimple(data.iosImprovements, 'en')}\n\n` : '';
  const fixesSection = data.iosFixes.length > 0
    ? `🧰 **\`FIXES\`**\n${formatItemsSimple(data.iosFixes, 'en')}` : '';

  return `**v${data.iosVersion}**

${newSection}${improvementsSection}${fixesSection}`.trim();
}

export function generateOfficialAndroid(data: ParsedReleaseNotes): string {
  const newSection = data.androidNew.length > 0
    ? `🚀 **\`NEW\`**\n${formatItemsSimple(data.androidNew, 'en')}\n\n` : '';
  const improvementsSection = data.androidImprovements.length > 0
    ? `✨ **\`IMPROVEMENTS\`**\n${formatItemsSimple(data.androidImprovements, 'en')}\n\n` : '';
  const fixesSection = data.androidFixes.length > 0
    ? `🧰 **\`FIXES\`**\n${formatItemsSimple(data.androidFixes, 'en')}` : '';

  return `**v${data.androidVersion}**

${newSection}${improvementsSection}${fixesSection}`.trim();
}

// ============================================
// Generate All
// ============================================

export function generateAllTemplates(
  data: ParsedReleaseNotes,
  discordHighlights: DiscordHighlightItem[],
  slackHighlights: SlackHighlights,
  androidStore: AndroidStoreContent
): GeneratedReleaseNotes {
  return {
    appstoreIOS: generateAppStoreIOS(data),
    appstoreDesktop: generateAppStoreDesktop(data),
    appstoreAndroid: generateAppStoreAndroid(androidStore),
    officialDesktop: generateOfficialDesktop(data),
    officialIOS: generateOfficialIOS(data),
    officialAndroid: generateOfficialAndroid(data),
    discordEN: generateDiscordEN(discordHighlights),
    discordTC: generateDiscordTC(discordHighlights),
    slack: generateSlack(slackHighlights),
  };
}
