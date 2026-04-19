// Mock backend — stands in for a live Supabase row set until the real wiring
// lands. Matches the LACOP `public_profiles` + `categories` + `media` shape
// (see repo-root LACOP-DATA-SHAPE.md). Keyed by `profile.slug` so the
// portfolio shell can render any customer when `LACOP_USER_SLUG` points at
// them.
//
// Multi-tenant proof: this file seeds TWO profiles — the primary customer
// (hanna-burgstaller) plus a clearly-labelled demo profile (sample-alt).
// Set LACOP_USER_SLUG=sample-alt locally to see the same visual shell
// render an entirely different customer's name, bio, categories, and media.
// One codebase, many deployments — just the env var differs.
//
// Content note: Bio/stats/agency fields on real people are empty until they
// provide wording themselves (per § 15 SITE-SYSTEM.md — no fabricated
// facts). Placeholder media are abstract gradient SVGs.

import type { Category, Media, Profile } from "@/lib/types";

// ─── Primary: Hanna Burgstaller ────────────────────────────────────────────
const HANNA_ID = "4a007e11-0000-4000-8000-000000000001";

const hannaProfile: Profile = {
  id: HANNA_ID,
  slug: "hanna-burgstaller",
  display_name: "Hanna Burgstaller",
  bio: null,
  about: null,
  profile_image_url: "/photos/still-01.svg",
  hero_image_url: "/photos/stride-01.svg",
  role: "model",
  social_links: {
    instagram: "https://www.instagram.com/_hannaburgstaller/",
  },
  stats: {},
  agencies: [],
  custom_links: [],
  website_domain: "hanna-burgstaller.lacop.site",
};

const HANNA_CAT_STILL = "c0000001-0000-4000-8000-000000000001";
const HANNA_CAT_STRIDE = "c0000002-0000-4000-8000-000000000002";
const HANNA_CAT_TURN = "c0000003-0000-4000-8000-000000000003";

const hannaCategories: Category[] = [
  {
    id: HANNA_CAT_STILL,
    user_id: HANNA_ID,
    name: "Still",
    slug: "still",
    cover_image_url: "/photos/still-01.svg",
    sort_order: 0,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
  {
    id: HANNA_CAT_STRIDE,
    user_id: HANNA_ID,
    name: "Stride",
    slug: "stride",
    cover_image_url: "/photos/stride-01.svg",
    sort_order: 1,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
  {
    id: HANNA_CAT_TURN,
    user_id: HANNA_ID,
    name: "Turn",
    slug: "turn",
    cover_image_url: "/photos/turn-01.svg",
    sort_order: 2,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
];

// ─── Demo: Sample Alt ──────────────────────────────────────────────────────
// Clearly-labelled demo profile. Different name, different category
// taxonomy, different stats/links — proves the shell swaps end-to-end when
// LACOP_USER_SLUG=sample-alt. Reuses the same abstract gradient SVGs
// because they are non-identifying placeholder media.
const SAMPLE_ID = "4a007e11-0000-4000-8000-0000000000aa";

const sampleProfile: Profile = {
  id: SAMPLE_ID,
  slug: "sample-alt",
  display_name: "Sample Alt",
  bio: "Demo profile — proves the shell is multi-tenant. Swap LACOP_USER_SLUG to render a different customer through the same visual system.",
  about: null,
  profile_image_url: "/photos/stride-02.svg",
  hero_image_url: "/photos/turn-02.svg",
  role: "model",
  social_links: {},
  stats: {},
  agencies: [],
  custom_links: [],
  website_domain: null,
};

const SAMPLE_CAT_A = "c0000001-0000-4000-8000-0000000000aa";
const SAMPLE_CAT_B = "c0000002-0000-4000-8000-0000000000bb";
const SAMPLE_CAT_C = "c0000003-0000-4000-8000-0000000000cc";

const sampleCategories: Category[] = [
  {
    id: SAMPLE_CAT_A,
    user_id: SAMPLE_ID,
    name: "Studio",
    slug: "studio",
    cover_image_url: "/photos/stride-02.svg",
    sort_order: 0,
    is_visible: true,
    created_at: "2026-04-19T00:00:00Z",
  },
  {
    id: SAMPLE_CAT_B,
    user_id: SAMPLE_ID,
    name: "Street",
    slug: "street",
    cover_image_url: "/photos/turn-01.svg",
    sort_order: 1,
    is_visible: true,
    created_at: "2026-04-19T00:00:00Z",
  },
  {
    id: SAMPLE_CAT_C,
    user_id: SAMPLE_ID,
    name: "Editorial",
    slug: "editorial",
    cover_image_url: "/photos/still-02.svg",
    sort_order: 2,
    is_visible: true,
    created_at: "2026-04-19T00:00:00Z",
  },
];

// ─── Media factory ─────────────────────────────────────────────────────────
const m = (
  id: string,
  userId: string,
  categoryId: string,
  url: string,
  sort: number,
  ratio: [number, number],
): Media => ({
  id,
  user_id: userId,
  category_id: categoryId,
  type: "photo",
  storage_path: `${userId}${url}`,
  url,
  thumbnail_url: url,
  title: null,
  description: null,
  photographer_credit: null,
  shooting_date: null,
  sort_order: sort,
  is_visible: true,
  width: ratio[0],
  height: ratio[1],
  file_size: null,
  uploaded_at: "2026-04-18T00:00:00Z",
});

const hannaMedia: Media[] = [
  m("m-hanna-still-01", HANNA_ID, HANNA_CAT_STILL, "/photos/still-01.svg", 0, [720, 900]),
  m("m-hanna-still-02", HANNA_ID, HANNA_CAT_STILL, "/photos/still-02.svg", 1, [720, 900]),
  m("m-hanna-stride-01", HANNA_ID, HANNA_CAT_STRIDE, "/photos/stride-01.svg", 2, [900, 720]),
  m("m-hanna-stride-02", HANNA_ID, HANNA_CAT_STRIDE, "/photos/stride-02.svg", 3, [900, 720]),
  m("m-hanna-turn-01", HANNA_ID, HANNA_CAT_TURN, "/photos/turn-01.svg", 4, [720, 900]),
  m("m-hanna-turn-02", HANNA_ID, HANNA_CAT_TURN, "/photos/turn-02.svg", 5, [720, 900]),
];

const sampleMedia: Media[] = [
  m("m-sample-studio-01", SAMPLE_ID, SAMPLE_CAT_A, "/photos/stride-02.svg", 0, [900, 720]),
  m("m-sample-studio-02", SAMPLE_ID, SAMPLE_CAT_A, "/photos/still-01.svg", 1, [720, 900]),
  m("m-sample-street-01", SAMPLE_ID, SAMPLE_CAT_B, "/photos/turn-01.svg", 2, [720, 900]),
  m("m-sample-street-02", SAMPLE_ID, SAMPLE_CAT_B, "/photos/stride-01.svg", 3, [900, 720]),
  m("m-sample-editorial-01", SAMPLE_ID, SAMPLE_CAT_C, "/photos/still-02.svg", 4, [720, 900]),
  m("m-sample-editorial-02", SAMPLE_ID, SAMPLE_CAT_C, "/photos/turn-02.svg", 5, [720, 900]),
];

// ─── Exports ───────────────────────────────────────────────────────────────
export const mockProfiles: Record<string, Profile> = {
  [hannaProfile.slug]: hannaProfile,
  [sampleProfile.slug]: sampleProfile,
};

export const mockCategories: Record<string, Category[]> = {
  [HANNA_ID]: hannaCategories,
  [SAMPLE_ID]: sampleCategories,
};

export const mockMedia: Record<string, Media[]> = {
  [HANNA_ID]: hannaMedia,
  [SAMPLE_ID]: sampleMedia,
};
