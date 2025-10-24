import * as cheerio from 'cheerio';

interface ArticleData {
  url: string;
  title: string;
  description?: string;
  content: string;
  publishedAt?: string;
  author?: string;
  ogImage?: string;
  favicon?: string;
}

export async function fetchArticle(url: string): Promise<ArticleData> {
  try {
    // URLのバリデーション
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.');
    }

    // 記事を取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Summary-Generator/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // メタデータの抽出
    const title = extractTitle($);
    const description = extractDescription($);
    const content = extractContent($);
    const publishedAt = extractPublishedDate($);
    const author = extractAuthor($);
    const ogImage = extractOGImage($);
    const favicon = extractFavicon($, url);

    // コンテンツのバリデーション
    if (!title || !content || content.length < 100) {
      throw new Error('Article content is too short or missing');
    }

    return {
      url,
      title,
      description,
      content,
      publishedAt,
      author,
      ogImage,
      favicon,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// タイトルの抽出
function extractTitle($: cheerio.CheerioAPI): string {
  return (
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text() ||
    $('h1').first().text() ||
    ''
  ).trim();
}

// 説明文の抽出
function extractDescription($: cheerio.CheerioAPI): string | undefined {
  const desc = (
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    ''
  ).trim();

  return desc || undefined;
}

// 本文の抽出
function extractContent($: cheerio.CheerioAPI): string {
  // 不要な要素を削除
  $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();

  // 本文候補の要素を探す
  const articleSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    'main',
    '#content',
  ];

  for (const selector of articleSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      const text = element.text().trim();
      if (text.length > 100) {
        return cleanText(text);
      }
    }
  }

  // フォールバック: bodyから抽出
  const bodyText = $('body').text().trim();
  return cleanText(bodyText);
}

// 公開日の抽出
function extractPublishedDate($: cheerio.CheerioAPI): string | undefined {
  const dateStr = (
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="publishdate"]').attr('content') ||
    $('time[datetime]').attr('datetime') ||
    ''
  ).trim();

  return dateStr || undefined;
}

// 著者の抽出
function extractAuthor($: cheerio.CheerioAPI): string | undefined {
  const author = (
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('.author').first().text() ||
    ''
  ).trim();

  return author || undefined;
}

// OG画像の抽出
function extractOGImage($: cheerio.CheerioAPI): string | undefined {
  const image = (
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    ''
  ).trim();

  return image || undefined;
}

// ファビコンの抽出
function extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  const favicon = $('link[rel="icon"]').attr('href') ||
                  $('link[rel="shortcut icon"]').attr('href');

  if (!favicon) return undefined;

  // 相対URLの場合、絶対URLに変換
  try {
    return new URL(favicon, baseUrl).href;
  } catch {
    return undefined;
  }
}

// テキストのクリーニング
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')  // 連続する空白を1つに
    .replace(/\n+/g, '\n') // 連続する改行を1つに
    .trim();
}
