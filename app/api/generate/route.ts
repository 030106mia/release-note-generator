import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIClient, EXTRACTION_PROMPT, POLISH_PROMPT, DISCORD_HIGHLIGHT_PROMPT, SLACK_HIGHLIGHT_PROMPT, ANDROID_STORE_PROMPT } from '@/lib/openai';
import { ExtractedReleaseNotes, ParsedReleaseNotes, AndroidStoreContent } from '@/lib/types';

async function extractRawText(openai: any, rawText: string): Promise<ExtractedReleaseNotes> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      { role: 'system', content: EXTRACTION_PROMPT },
      { role: 'user', content: `Extract and categorize the following release notes. Keep the original Chinese text as-is. Return as json:\n\n${rawText}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Extraction: AI returned empty response');
  return JSON.parse(content) as ExtractedReleaseNotes;
}

async function polishContent(openai: any, extractedData: ExtractedReleaseNotes, fourLang: boolean): Promise<ParsedReleaseNotes> {
  const langInstruction = fourLang
    ? 'Provide cn, en, tc, and ja versions for each item.'
    : 'Provide cn and en versions for each item.';

  const response = await openai.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      { role: 'system', content: POLISH_PROMPT },
      { role: 'user', content: `Rewrite the following release notes to be professional and user-focused. ${langInstruction} Return as json:\n\n${JSON.stringify(extractedData, null, 2)}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Polish: AI returned empty response');

  const parsedData = JSON.parse(content) as ParsedReleaseNotes;
  parsedData.iosVersion = extractedData.iosVersion;
  parsedData.macVersion = extractedData.macVersion;
  parsedData.androidVersion = extractedData.androidVersion;

  const categories = ['iosNew', 'macNew', 'androidNew', 'iosImprovements', 'macImprovements', 'androidImprovements', 'iosFixes', 'macFixes', 'androidFixes'] as const;
  for (const category of categories) {
    const arr = parsedData[category];
    if (!Array.isArray(arr)) {
      parsedData[category] = (extractedData[category] || []).map((text: string) => ({ cn: text, en: text, tc: text, ja: text }));
    } else {
      parsedData[category] = arr.map(item => ({
        cn: item.cn || '',
        en: item.en || '',
        tc: item.tc || item.cn || '',
        ja: item.ja || item.en || '',
      }));
    }
  }

  return parsedData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, rawText } = body;

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json({ error: 'Please enter raw text' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY_OVERRIDE || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const openai = createOpenAIClient(apiKey);

    // ============================================
    // App Store iOS: extract → polish (4 lang)
    // ============================================
    if (action === 'appstore-ios') {
      console.log('[App Store iOS] Extracting...');
      const extractedData = await extractRawText(openai, rawText);
      console.log('[App Store iOS] Polishing (4 lang)...');
      const parsedData = await polishContent(openai, extractedData, true);
      console.log('[App Store iOS] Done.');
      return NextResponse.json({ success: true, parsedData });
    }

    // ============================================
    // App Store Desktop: extract → polish (4 lang)
    // ============================================
    if (action === 'appstore-desktop') {
      console.log('[App Store Desktop] Extracting...');
      const extractedData = await extractRawText(openai, rawText);
      console.log('[App Store Desktop] Polishing (4 lang)...');
      const parsedData = await polishContent(openai, extractedData, true);
      console.log('[App Store Desktop] Done.');
      return NextResponse.json({ success: true, parsedData });
    }

    // ============================================
    // App Store Android: extract → android store (13 lang)
    // ============================================
    if (action === 'appstore-android') {
      console.log('[App Store Android] Extracting...');
      const extractedData = await extractRawText(openai, rawText);
      console.log('[App Store Android] Generating multi-language...');
      const androidResponse = await openai.chat.completions.create({
        model: 'gpt-5.4',
        messages: [
          { role: 'system', content: ANDROID_STORE_PROMPT },
          { role: 'user', content: `Create concise multi-language Play Store release notes from these Android changes. Return as json:\n\n${JSON.stringify({
            androidVersion: extractedData.androidVersion,
            androidNew: extractedData.androidNew,
            androidImprovements: extractedData.androidImprovements,
            androidFixes: extractedData.androidFixes,
          }, null, 2)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });
      let androidStore: AndroidStoreContent = {};
      const content = androidResponse.choices[0]?.message?.content;
      if (content) { try { androidStore = JSON.parse(content); } catch {} }
      console.log('[App Store Android] Done.');
      return NextResponse.json({ success: true, androidStore });
    }

    // ============================================
    // Official: extract → polish (cn + en)
    // ============================================
    if (action === 'official') {
      console.log('[Official] Extracting...');
      const extractedData = await extractRawText(openai, rawText);

      console.log('[Official] Polishing (cn + en)...');
      const parsedData = await polishContent(openai, extractedData, false);

      console.log('[Official] Done.');
      return NextResponse.json({ success: true, parsedData });
    }

    // ============================================
    // Discord: extract → highlights
    // ============================================
    if (action === 'discord') {
      console.log('[Discord] Extracting...');
      const extractedData = await extractRawText(openai, rawText);

      console.log('[Discord] Generating highlights...');
      const response = await openai.chat.completions.create({
        model: 'gpt-5.4',
        messages: [
          { role: 'system', content: DISCORD_HIGHLIGHT_PROMPT },
          { role: 'user', content: `Select the most notable features from these release notes and create Discord announcement highlights. Return as json:\n\n${JSON.stringify(extractedData, null, 2)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });
      let highlights: any[] = [];
      const content = response.choices[0]?.message?.content;
      if (content) {
        try { highlights = JSON.parse(content).highlights || []; } catch {}
      }

      console.log('[Discord] Done.');
      return NextResponse.json({ success: true, highlights });
    }

    // ============================================
    // Slack: extract → highlights
    // ============================================
    if (action === 'slack') {
      console.log('[Slack] Extracting...');
      const extractedData = await extractRawText(openai, rawText);

      console.log('[Slack] Generating highlights...');
      const response = await openai.chat.completions.create({
        model: 'gpt-5.4',
        messages: [
          { role: 'system', content: SLACK_HIGHLIGHT_PROMPT },
          { role: 'user', content: `Create a Slack announcement from these release notes. Return as json:\n\n${JSON.stringify(extractedData, null, 2)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });
      let slackHighlights = { coreHighlights: [] as any[], platformHighlights: [] as any[] };
      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          slackHighlights = { coreHighlights: parsed.coreHighlights || [], platformHighlights: parsed.platformHighlights || [] };
        } catch {}
      }

      console.log('[Slack] Done.');
      return NextResponse.json({ success: true, slackHighlights });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
