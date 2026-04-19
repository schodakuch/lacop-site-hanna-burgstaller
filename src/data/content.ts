// UI copy only — LACOP profile data (display_name, categories, media) lives
// in src/data/mock.ts and is read via async resolvers in src/lib/lacop.ts.
//
// Multi-tenant shell: scenes 01/05/06 are the fixed narrative bookends
// (Hello / Process / Reach) and belong to the hanna-burgstaller visual
// concept ("three rhythms on a runway"). Scenes 02/03/04 are derived at
// render time from the active customer's first three categories — whatever
// names they use — so flipping LACOP_USER_SLUG swaps the whole content tier
// without touching the shell's voice. Tempo words and captions are
// positional (index 0/1/2), not slug-bound.

export const fixedScenes = {
  hello: { n: "01", anchor: "#scene-01" },
  process: { n: "05", anchor: "#scene-05" },
  reach: { n: "06", anchor: "#scene-06" },
} as const;

// Tempo eyebrow applied to category at index i. Site-level voice — every
// customer deployed through this shell inherits this three-beat rhythm.
export const tempoByIndex = [
  { en: "held", de: "gehalten" },
  { en: "in motion", de: "in Bewegung" },
  { en: "pivot", de: "Drehpunkt" },
];

// Caption applied to category at index i. Kept generic enough to read
// sensibly against any category name the customer uses.
export const captionByIndex = [
  {
    en: "Held poses. The moment before the next one.",
    de: "Gehaltene Posen. Der Moment vor dem nächsten.",
  },
  {
    en: "Walking frames. Weight between two feet.",
    de: "Laufende Frames. Gewicht zwischen zwei Füßen.",
  },
  {
    en: "Pivots. The frame re-finds the subject.",
    de: "Drehungen. Das Bild findet das Motiv neu.",
  },
];

export const translations = {
  nav: {
    hello: { en: "Hello", de: "Hallo" },
    process: { en: "Process", de: "Prozess" },
    reach: { en: "Reach", de: "Ansprache" },
    index: { en: "Index", de: "Index" },
    close: { en: "Close", de: "Schließen" },
  },
  hello: {
    eyebrow: { en: "A scrolling sequence", de: "Eine Sequenz im Scroll" },
    subtitle: {
      en: "Six scenes. Scroll — the type responds.",
      de: "Sechs Szenen. Scrollen — die Schrift antwortet.",
    },
    invitation: {
      en: "Begin the sequence",
      de: "Sequenz beginnen",
    },
    hint: {
      en: "The heading breathes with your scroll speed.",
      de: "Die Überschrift atmet mit deiner Scroll-Geschwindigkeit.",
    },
  },
  process: {
    heading: { en: "Process", de: "Prozess" },
    body: {
      en: "A working diary will live here — call sheets, test frames, the ten minutes before a slate. For now, this scene is a placeholder until the subject's own notes are in.",
      de: "Hier wächst ein Arbeitsjournal — Dispositionen, Testaufnahmen, die zehn Minuten vor einer Klappe. Bis eigene Notizen eingereicht sind, bleibt diese Szene ein Platzhalter.",
    },
    placeholder_note: {
      en: "Placeholder — replace with the subject's own wording before going live.",
      de: "Platzhaltertext — vor dem Livegang durch eigene Worte ersetzen.",
    },
    stats_empty: { en: "Measurements to come.", de: "Maße folgen." },
    agencies_empty: { en: "Representation to come.", de: "Agentur folgt." },
  },
  reach: {
    heading: { en: "Reach", de: "Ansprache" },
    lede: {
      en: "One line, not a form.",
      de: "Eine Zeile, kein Formular.",
    },
    copy_hint: { en: "Click to copy", de: "Klicken zum Kopieren" },
    copied: { en: "Copied", de: "Kopiert" },
    placeholder_note: {
      en: "Placeholder address — replace before going live.",
      de: "Platzhalter-Adresse — vor Livegang ersetzen.",
    },
  },
  footer: {
    rights: { en: "All rights reserved", de: "Alle Rechte vorbehalten" },
    set: { en: "Set on lacop.app", de: "Gesetzt auf lacop.app" },
  },
  notfound: {
    heading: { en: "Off-sequence", de: "Außerhalb der Sequenz" },
    body: {
      en: "This address isn't part of the walk.",
      de: "Diese Adresse gehört nicht zum Ablauf.",
    },
    home: { en: "Return to scene 01", de: "Zurück zu Szene 01" },
  },
};
