/**
 * Utility functions for extracting domains and fetching high-resolution favicons/logos
 */

export function getDomain(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return url.split('/')[0].replace(/^www\./, '');
  }
}

export function getFaviconUrl(url: string): string | null {
  const domain = getDomain(url);
  if (!domain) return null;
  // Google S2 Favicon API provides clean 128px icons
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function getFallbackFaviconUrl(url: string): string | null {
  const domain = getDomain(url);
  if (!domain) return null;
  // DuckDuckGo fallback icon
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
}

export function getInitialLetter(title: string | undefined | null, url: string): string {
  if (title && title.trim()) {
    return title.trim()[0].toUpperCase();
  }
  const domain = getDomain(url);
  return domain ? domain[0].toUpperCase() : '?';
}

export function getRandomGradient(seedStr: string): string {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < (seedStr || '').length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}
