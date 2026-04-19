// UI copy. LACOP profile data (display_name, categories, media) lives in
// src/data/mock.ts and is read via async resolvers in src/lib/lacop.ts.
//
// Multi-page site: cover (01) / photos (02) / about (03) / contact (04).
// Photo categories are sections INSIDE /photos (not separate pages), with
// a sticky scroll-spy strip. Page content is tenant-agnostic — flipping
// LACOP_USER_SLUG swaps the profile + categories but keeps the shell
// voice intact.

// Tempo eyebrow applied to the photo-section at index i. Site-level
// voice — every customer inherits this three-beat rhythm as their first
// three categories are rendered in /photos.
export const tempoByIndex = [
  { en: "held", de: "gehalten" },
  { en: "in motion", de: "in Bewegung" },
  { en: "pivot", de: "Drehpunkt" },
];

// Caption applied to the photo-section at index i. Kept generic enough
// to read sensibly against any category name the customer uses.
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
    cover: { en: "Cover", de: "Cover" },
    photos: { en: "Photos", de: "Fotos" },
    about: { en: "About", de: "Über" },
    contact: { en: "Contact", de: "Kontakt" },
    menu: { en: "Menu", de: "Menü" },
    close: { en: "Close", de: "Schließen" },
  },
  cover: {
    eyebrow: { en: "A scrolling sequence", de: "Eine Sequenz im Scroll" },
    subtitle: {
      en: "Four pages. Type that breathes with scroll speed. Start with the photos.",
      de: "Vier Seiten. Schrift, die mit der Scroll-Geschwindigkeit atmet. Fotos zuerst.",
    },
    invitation: {
      en: "Enter the photos",
      de: "Zu den Fotos",
    },
    hint: {
      en: "The heading breathes with your scroll speed.",
      de: "Die Überschrift atmet mit deiner Scroll-Geschwindigkeit.",
    },
  },
  photos: {
    heading: { en: "Photos", de: "Fotos" },
    intro: {
      en: "One page, every series. The strip below tracks where you are as you scroll.",
      de: "Eine Seite, alle Serien. Der Streifen unten zeigt, wo du bist.",
    },
    categories_label: { en: "Series", de: "Serien" },
    frame_count: {
      one: { en: "1 photo", de: "1 Foto" },
      other: { en: "{n} photos", de: "{n} Fotos" },
    },
    empty: { en: "empty", de: "leer" },
  },
  about: {
    heading: { en: "About", de: "Über" },
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
    tempo: { en: "in progress", de: "in Arbeit" },
  },
  contact: {
    heading: { en: "Contact", de: "Kontakt" },
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
    tempo: { en: "direct", de: "direkt" },
  },
  pagination: {
    prev: { en: "Previous", de: "Vorherige" },
    next: { en: "Next", de: "Nächste" },
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
