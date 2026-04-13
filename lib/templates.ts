import { ParsedReleaseNotes, GeneratedReleaseNotes, ReleaseNoteItem, DiscordHighlightItem, SlackHighlights } from './types';

function formatItems(items: ReleaseNoteItem[], lang: 'cn' | 'en', prefix: string = '> '): string {
  if (items.length === 0) return '';
  return items.map((item, i) => `${prefix}${i + 1}. ${item[lang]}`).join('\n');
}

function formatItemsSimple(items: ReleaseNoteItem[], lang: 'cn' | 'en'): string {
  if (items.length === 0) return '';
  return items.map((item, i) => `> ${i + 1}. ${item[lang]}`).join('\n');
}

function formatItemsPlain(items: ReleaseNoteItem[], lang: 'cn' | 'en'): string {
  if (items.length === 0) return '';
  return items.map((item, i) => `${i + 1}. ${item[lang]}`).join('\n');
}

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

export function generateSlack(highlights: SlackHighlights): string {
  // Core highlights section
  const coreSection = highlights.coreHighlights.map(h =>
    `*${h.title}*\n${h.desc}`
  ).join('\n\n');

  // Platform highlights section
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

export function generateAllTemplates(data: ParsedReleaseNotes, discordHighlights: DiscordHighlightItem[], slackHighlights: SlackHighlights): GeneratedReleaseNotes {
  return {
    discordEN: generateDiscordEN(discordHighlights),
    discordTC: generateDiscordTC(discordHighlights),
    slack: generateSlack(slackHighlights),
    officialDesktop: generateOfficialDesktop(data),
    officialIOS: generateOfficialIOS(data),
    officialAndroid: generateOfficialAndroid(data),
  };
}
