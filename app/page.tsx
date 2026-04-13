'use client';

import { useState, useRef } from 'react';
import OutputCard from '@/components/OutputCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CHANNEL_CONFIGS, ChannelType, MultiLangContent } from '@/lib/types';
import { generateAppStoreIOS, generateAppStoreDesktop, generateAppStoreAndroid, generateOfficialIOS, generateOfficialDesktop, generateOfficialAndroid, generateDiscordEN, generateDiscordTC, generateSlack } from '@/lib/templates';

type LangKey = 'en' | 'cn' | 'tc' | 'ja';
const LANG_TABS: { id: LangKey; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'cn', name: '简体中文' },
  { id: 'tc', name: '繁體中文' },
  { id: 'ja', name: '日本語' },
];

const ChannelIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'discord':
      return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>);
    case 'slack':
      return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>);
    case 'appstore':
      return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>);
    case 'official':
      return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>);
    default: return null;
  }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <button onClick={handleCopy} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20'}`}>
      {copied ? (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied</>) : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>)}
    </button>
  );
}

function MultiLangOutputCard({ title, description, content }: { title: string; description: string; content: MultiLangContent }) {
  const [activeLang, setActiveLang] = useState<LangKey>('en');
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
        <div><h3 className="font-semibold text-zinc-100">{title}</h3><p className="text-xs text-zinc-500">{description}</p></div>
      </div>
      <div className="flex gap-1 px-4 pt-3">
        {LANG_TABS.map(lang => (
          <button key={lang.id} onClick={() => setActiveLang(lang.id)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeLang === lang.id ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>{lang.name}</button>
        ))}
      </div>
      <div className="px-4 pt-2 pb-3">
        <div className="flex justify-end mb-2"><CopyButton text={content[activeLang]} /></div>
        <div className="max-h-80 overflow-y-auto"><pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">{content[activeLang] || 'No content'}</pre></div>
      </div>
    </div>
  );
}

export default function Home() {
  const rawTextRef = useRef<HTMLTextAreaElement>(null);
  const [activeChannel, setActiveChannel] = useState<ChannelType>('appstore');
  const [channelLoading, setChannelLoading] = useState<Record<string, boolean>>({});
  const [channelError, setChannelError] = useState<Record<string, string | null>>({});
  const [channelResults, setChannelResults] = useState<Record<string, any>>({});

  const getRawText = () => rawTextRef.current?.value?.trim() || '';

  // templateId-level generation (each button is independent)
  const handleGenerateTemplate = async (templateId: string) => {
    const rawText = getRawText();
    if (!rawText) return;

    setChannelLoading(prev => ({ ...prev, [templateId]: true }));
    setChannelError(prev => ({ ...prev, [templateId]: null }));

    try {
      // Map templateId to API action
      let action = '';
      if (templateId === 'appstoreIOS') action = 'appstore-ios';
      else if (templateId === 'appstoreDesktop') action = 'appstore-desktop';
      else if (templateId === 'appstoreAndroid') action = 'appstore-android';
      else if (templateId === 'officialIOS' || templateId === 'officialDesktop' || templateId === 'officialAndroid') action = 'official';
      else if (templateId === 'discordEN' || templateId === 'discordTC') action = 'discord';
      else if (templateId === 'slack') action = 'slack';

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rawText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');

      // Map response to results
      if (templateId === 'appstoreIOS') {
        setChannelResults(prev => ({ ...prev, appstoreIOS: generateAppStoreIOS(data.parsedData) }));
      } else if (templateId === 'appstoreDesktop') {
        setChannelResults(prev => ({ ...prev, appstoreDesktop: generateAppStoreDesktop(data.parsedData) }));
      } else if (templateId === 'appstoreAndroid') {
        setChannelResults(prev => ({ ...prev, appstoreAndroid: generateAppStoreAndroid(data.androidStore || {}) }));
      } else if (action === 'official') {
        setChannelResults(prev => ({
          ...prev,
          officialIOS: generateOfficialIOS(data.parsedData),
          officialDesktop: generateOfficialDesktop(data.parsedData),
          officialAndroid: generateOfficialAndroid(data.parsedData),
        }));
      } else if (action === 'discord') {
        setChannelResults(prev => ({
          ...prev,
          discordEN: generateDiscordEN(data.highlights || []),
          discordTC: generateDiscordTC(data.highlights || []),
        }));
      } else if (action === 'slack') {
        const sh = data.slackHighlights || { coreHighlights: [], platformHighlights: [] };
        setChannelResults(prev => ({ ...prev, slack: generateSlack(sh) }));
      }
    } catch (err) {
      setChannelError(prev => ({ ...prev, [templateId]: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setChannelLoading(prev => ({ ...prev, [templateId]: false }));
    }
  };

  const activeConfig = CHANNEL_CONFIGS.find(c => c.id === activeChannel);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI3MjcyYSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Powered
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-200 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">Release Notes Generator</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Generate multi-format release notes for App Store, Discord, Slack, and official channels</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Input Raw Text
              </h2>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Raw Release Notes</label>
              <textarea
                ref={rawTextRef}
                placeholder="Paste your raw release notes here..."
                className="w-full h-72 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right: Output */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Generated Results
            </h2>

            {/* Channel Tabs */}
            <div className="flex gap-2 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
              {CHANNEL_CONFIGS.map(channel => (
                <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeChannel === channel.id ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
                  <ChannelIcon type={channel.icon} className="w-4 h-4" />{channel.name}
                </button>
              ))}
            </div>

            {/* Content: per-template cards with individual generate buttons */}
            <div className="space-y-4">
              {activeConfig?.templates.map(template => {
                const result = channelResults[template.id];
                const loading = channelLoading[template.id];
                const error = channelError[template.id];

                return (
                  <div key={template.id}>
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-2 flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm text-red-400/80">{error}</p>
                      </div>
                    )}

                    {loading ? (
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center justify-center gap-3">
                        <LoadingSpinner />
                        <span className="text-sm text-zinc-400">Generating {template.name}...</span>
                      </div>
                    ) : result ? (
                      <div>
                        {(template.id === 'appstoreIOS' || template.id === 'appstoreDesktop') && typeof result === 'object' && 'en' in result ? (
                          <MultiLangOutputCard title={template.name} description={template.description} content={result as MultiLangContent} />
                        ) : (
                          <OutputCard title={template.name} description={template.description} content={result as string} />
                        )}
                        <div className="flex justify-end mt-1">
                          <button onClick={() => handleGenerateTemplate(template.id)} disabled={!getRawText()} className="px-3 py-1 text-xs text-zinc-500 hover:text-pink-400 transition-all">
                            Regenerate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-zinc-200">{template.name}</h3>
                          <p className="text-xs text-zinc-500">{template.description}</p>
                        </div>
                        <button onClick={() => handleGenerateTemplate(template.id)} disabled={!getRawText()} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-lg hover:from-pink-400 hover:to-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20">
                          Generate
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-zinc-600 text-sm"><p>Powered by AI · Built with Next.js</p></footer>
      </div>
    </main>
  );
}
