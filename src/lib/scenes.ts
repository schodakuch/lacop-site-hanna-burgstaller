// Scene ledger for the longscroll. The six scenes the minimap tracks and
// the homepage renders in order. Scenes 1, 5, 6 are shell-level (cover,
// process, contact). Scenes 2-4 are driven by the active tenant's first
// three categories — the label comes from `category.name`, not a
// hard-coded slug (see PITFALLS § 4).

export const SCENE_IDS = {
  cover: "scene-cover",
  rhythm: (index: number) => `scene-rhythm-${index}`,
  process: "scene-process",
  contact: "scene-contact",
} as const;

export type SceneEntry = {
  id: string;
  kind: "cover" | "rhythm" | "process" | "contact";
  label: { en: string; de: string };
};

export function rhythmSceneId(index: number) {
  return SCENE_IDS.rhythm(index);
}
