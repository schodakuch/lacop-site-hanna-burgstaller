// Sanitize user-input URLs (social_links, custom_links, agencies[].url).
// Blocks javascript:, data:, file: etc. — defense against XSS via malicious URL.
// Source: programs/lacop-ui/packages/data/src/utils.ts
export function safeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) ? url : null;
  } catch {
    return null;
  }
}
