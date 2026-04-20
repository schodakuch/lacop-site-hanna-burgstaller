// UI copy for the single-page longscroll. Six scenes: cover → three
// rhythm scenes (driven positionally by the tenant's first 3 categories,
// see PITFALLS § 4) → process → contact. The LACOP profile data
// (display_name, categories, media) lives in src/data/mock.ts and is
// read via async resolvers in src/lib/lacop.ts.

// Eyebrow tempo word attached to the rhythm scene at index i. Site-level
// voice; every customer inherits this three-beat rhythm as their first
// three categories are rendered in scenes 02/03/04.
export const tempoByIndex = [
  { en: "held", de: "gehalten" },
  { en: "in motion", de: "in Bewegung" },
  { en: "pivot", de: "Drehpunkt" },
];

// One-sentence caption for the rhythm scene at index i. Kept generic
// enough to read sensibly against any category name the customer uses.
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
    jump_to: { en: "Jump to", de: "Springe zu" },
    close: { en: "Close", de: "Schließen" },
    cover: { en: "Cover", de: "Cover" },
    process: { en: "Process", de: "Arbeit" },
    contact: { en: "Contact", de: "Kontakt" },
  },
  cover: {
    eyebrow: { en: "A scrolling sequence", de: "Eine Sequenz im Scroll" },
    subtitle: {
      en: "Six scenes. One page. The type thickens and softens with your scroll speed — that's the whole UI.",
      de: "Sechs Szenen. Eine Seite. Die Schrift verdichtet und weicht sich, während du scrollst — das ist das ganze Interface.",
    },
    invitation: { en: "Start the walk", de: "Sequenz starten" },
    hint: {
      en: "Scroll. The heading breathes with the velocity.",
      de: "Scrolle. Die Überschrift atmet mit der Geschwindigkeit.",
    },
  },
  process: {
    heading: { en: "Process", de: "Arbeit" },
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
    tempo: { en: "in progress", de: "in Arbeit" },
  },
  contact: {
    heading: { en: "A direct line", de: "Direkte Leitung" },
    lede: {
      en: "One line, not a form. Click to copy.",
      de: "Eine Zeile, kein Formular. Klicken zum Kopieren.",
    },
    copy_hint: { en: "Click to copy", de: "Klicken zum Kopieren" },
    copied: { en: "Copied", de: "Kopiert" },
    placeholder_note: {
      en: "Placeholder address — replace before going live.",
      de: "Platzhalter-Adresse — vor Livegang ersetzen.",
    },
    tempo: { en: "direct", de: "direkt" },
  },
  photos: {
    frame_count: {
      one: { en: "1 photo", de: "1 Foto" },
      other: { en: "{n} photos", de: "{n} Fotos" },
    },
    empty: { en: "frames to come", de: "Frames folgen" },
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
    home: { en: "Return to the cover", de: "Zurück zum Cover" },
  },
};
