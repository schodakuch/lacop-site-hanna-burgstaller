// Mock backend — stands in for a live Supabase row set until the real wiring
// lands. Matches the LACOP `public_profiles` + `categories` + `media` shape
// (see repo-root LACOP-DATA-SHAPE.md). Keyed by `profile.slug` so the portfolio
// shell can render any customer when `LACOP_USER_SLUG` points at them.
//
// Content note: Bio/stats/agency fields are empty until Hanna herself provides
// wording. Placeholder media are abstract gradient SVGs — no fabricated IG
// pulls or invented shoot attributions (per § 15 SITE-SYSTEM.md).

import type { Category, Media, Profile } from "@/lib/types";

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

const CAT_STILL = "c0000001-0000-4000-8000-000000000001";
const CAT_STRIDE = "c0000002-0000-4000-8000-000000000002";
const CAT_TURN = "c0000003-0000-4000-8000-000000000003";

const hannaCategories: Category[] = [
  {
    id: CAT_STILL,
    user_id: HANNA_ID,
    name: "Still",
    slug: "still",
    cover_image_url: "/photos/still-01.svg",
    sort_order: 0,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
  {
    id: CAT_STRIDE,
    user_id: HANNA_ID,
    name: "Stride",
    slug: "stride",
    cover_image_url: "/photos/stride-01.svg",
    sort_order: 1,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
  {
    id: CAT_TURN,
    user_id: HANNA_ID,
    name: "Turn",
    slug: "turn",
    cover_image_url: "/photos/turn-01.svg",
    sort_order: 2,
    is_visible: true,
    created_at: "2026-04-18T00:00:00Z",
  },
];

const m = (
  id: string,
  categoryId: string,
  url: string,
  sort: number,
  ratio: [number, number],
): Media => ({
  id,
  user_id: HANNA_ID,
  category_id: categoryId,
  type: "photo",
  storage_path: `${HANNA_ID}${url}`,
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
  m("m-still-01", CAT_STILL, "/photos/still-01.svg", 0, [720, 900]),
  m("m-still-02", CAT_STILL, "/photos/still-02.svg", 1, [720, 900]),
  m("m-stride-01", CAT_STRIDE, "/photos/stride-01.svg", 2, [900, 720]),
  m("m-stride-02", CAT_STRIDE, "/photos/stride-02.svg", 3, [900, 720]),
  m("m-turn-01", CAT_TURN, "/photos/turn-01.svg", 4, [720, 900]),
  m("m-turn-02", CAT_TURN, "/photos/turn-02.svg", 5, [720, 900]),
];

export const mockProfiles: Record<string, Profile> = {
  [hannaProfile.slug]: hannaProfile,
};

export const mockCategories: Record<string, Category[]> = {
  [HANNA_ID]: hannaCategories,
};

export const mockMedia: Record<string, Media[]> = {
  [HANNA_ID]: hannaMedia,
};
