// UI copy for the multi-page shell: /, /photos, /process, /contact.
// LACOP profile data (display_name, categories, media) lives in
// src/data/mock.ts and is read via async resolvers in src/lib/lacop.ts.
// Per-category tempo + caption are site-level voice, indexed
// positionally so they work for any tenant taxonomy (see PITFALLS § 4).

// Eyebrow tempo word attached to the category section at index i.
export const tempoByIndex = [
  { en: "held", de: "gehalten" },
  { en: "in motion", de: "in Bewegung" },
  { en: "pivot", de: "Drehpunkt" },
];

// One-sentence caption for the category section at index i. Wraps
// with modulo in the component so any count works (1 or 12
// categories).
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
    home: { en: "Cover", de: "Cover" },
    photos: { en: "Photos", de: "Fotos" },
    process: { en: "Process", de: "Arbeit" },
    contact: { en: "Contact", de: "Kontakt" },
    jump_to: { en: "Jump to", de: "Springe zu" },
    close: { en: "Close", de: "Schließen" },
  },
  cover: {
    eyebrow: { en: "A runway sequence", de: "Eine Sequenz im Scroll" },
    subtitle: {
      en: "Four pages. Kinetic type that breathes with scroll speed. Start with the photos.",
      de: "Vier Seiten. Kinetische Schrift, die mit der Scroll-Geschwindigkeit atmet. Fotos zuerst.",
    },
    invitation: { en: "Enter the photos", de: "Zu den Fotos" },
    hint: {
      en: "Scroll. The heading breathes with the velocity.",
      de: "Scrolle. Die Überschrift atmet mit der Geschwindigkeit.",
    },
  },
  photos: {
    heading: { en: "Photos", de: "Fotos" },
    intro: {
      en: "One page, every series. Scroll through or jump between categories from the minimap.",
      de: "Eine Seite, alle Serien. Scrolle durch oder springe über die Minimap zwischen Kategorien.",
    },
    frame_count: {
      one: { en: "1 frame", de: "1 Frame" },
      other: { en: "{n} frames", de: "{n} Frames" },
    },
    empty: { en: "frames to come", de: "Frames folgen" },
    more: { en: "more from the series", de: "mehr aus der Serie" },
  },
  process: {
    heading: { en: "Process", de: "Arbeit" },
    tempo: { en: "in progress", de: "in Arbeit" },
    body: {
      en: "A working diary will live here — call sheets, test frames, the ten minutes before a slate. For now, this page is a placeholder until the subject's own notes are in.",
      de: "Hier wächst ein Arbeitsjournal — Dispositionen, Testaufnahmen, die zehn Minuten vor einer Klappe. Bis eigene Notizen eingereicht sind, bleibt diese Seite ein Platzhalter.",
    },
    placeholder_note: {
      en: "Placeholder — replace with the subject's own wording before going live.",
      de: "Platzhaltertext — vor dem Livegang durch eigene Worte ersetzen.",
    },
    stats_empty: { en: "Measurements to come.", de: "Maße folgen." },
    agencies_empty: { en: "Representation to come.", de: "Agentur folgt." },
  },
  contact: {
    heading: { en: "A direct line", de: "Direkte Leitung" },
    tempo: { en: "direct", de: "direkt" },
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
