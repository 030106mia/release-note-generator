// TypeScript interfaces for Release Notes Generator

export interface ReleaseNoteItem {
  cn: string;  // Chinese version
  en: string;  // English version
}

// Phase 1: Extracted raw data (original Chinese text only)
export interface ExtractedReleaseNotes {
  iosVersion: string;
  macVersion: string;
  androidVersion: string;
  iosNew: string[];
  macNew: string[];
  androidNew: string[];
  iosImprovements: string[];
  macImprovements: string[];
  androidImprovements: string[];
  iosFixes: string[];
  macFixes: string[];
  androidFixes: string[];
}

// Phase 2: Polished data (with both CN and EN)
export interface ParsedReleaseNotes {
  iosVersion: string;
  macVersion: string;
  androidVersion: string;
  iosBuild?: string;  // Optional build number for iOS
  androidBuild?: string;  // Optional build number for Android
  
  // New features
  iosNew: ReleaseNoteItem[];
  macNew: ReleaseNoteItem[];
  androidNew: ReleaseNoteItem[];
  
  // Improvements
  iosImprovements: ReleaseNoteItem[];
  macImprovements: ReleaseNoteItem[];
  androidImprovements: ReleaseNoteItem[];
  
  // Bug fixes
  iosFixes: ReleaseNoteItem[];
  macFixes: ReleaseNoteItem[];
  androidFixes: ReleaseNoteItem[];
}

export interface GeneratedReleaseNotes {
  discordEN: string;
  discordTC: string;
  slack: string;
  officialDesktop: string;
  officialIOS: string;
  officialAndroid: string;
}

// Discord highlight item structure
export interface DiscordHighlightItem {
  emoji: string;
  titleEN: string;
  titleTC: string;
  descEN: string;
  descTC: string;
}

// Slack highlight item structures
export interface SlackCoreHighlight {
  title: string;
  desc: string;
}

export interface SlackPlatformHighlight {
  platform: string;
  version: string;
  items: string[];
}

export interface SlackHighlights {
  coreHighlights: SlackCoreHighlight[];
  platformHighlights: SlackPlatformHighlight[];
}

export type TemplateType =
  | 'discordEN'
  | 'discordTC'
  | 'slack'
  | 'officialDesktop'
  | 'officialIOS'
  | 'officialAndroid';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
}

export type ChannelType = 'discord' | 'slack' | 'official';

export interface ChannelConfig {
  id: ChannelType;
  name: string;
  icon: string;
  templates: TemplateConfig[];
}

export const CHANNEL_CONFIGS: ChannelConfig[] = [
  {
    id: 'official',
    name: 'Official',
    icon: 'official',
    templates: [
      {
        id: 'officialIOS',
        name: 'iOS',
        description: 'App Store, English'
      },
      {
        id: 'officialAndroid',
        name: 'Android',
        description: 'Google Play, English'
      },
      {
        id: 'officialDesktop',
        name: 'Desktop',
        description: 'Mac/Windows, English'
      }
    ]
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'discord',
    templates: [
      {
        id: 'discordEN',
        name: 'English',
        description: 'Weekly highlights'
      },
      {
        id: 'discordTC',
        name: '繁體中文',
        description: 'Weekly highlights'
      }
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'slack',
    templates: [
      {
        id: 'slack',
        name: 'Slack',
        description: 'iOS + Desktop, Chinese'
      }
    ]
  },
];

