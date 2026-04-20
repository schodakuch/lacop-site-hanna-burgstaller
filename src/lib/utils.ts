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

// Social-link label lookup. The LACOP data shape allows ANY string key
// in social_links (see LACOP-DATA-SHAPE.md § 2.2 — josefine's row has
// a legacy `email` key). Fall back to the raw key for unknown platforms.
const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  snapchat: "Snapchat",
  vimeo: "Vimeo",
  pinterest: "Pinterest",
  facebook: "Facebook",
  x: "X",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  email: "E-Mail",
  website: "Website",
};

export function getSocialLabel(platform: string): string {
  const key = platform.toLowerCase();
  return SOCIAL_LABELS[key] ?? platform.charAt(0).toUpperCase() + platform.slice(1);
}
