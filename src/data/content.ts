// UI copy only — LACOP profile data lives in src/data/mock.ts, read via
// async resolvers in src/lib/lacop.ts.
//
// Runway vocabulary: "scenes" not "pages". One URL, six scenes, a minimap
// tracks position. Numbering is part of the type system so it lives here.

export const scenes = [
  { n: "01", key: "hello" as const, anchor: "#scene-01" },
  { n: "02", key: "still" as const, anchor: "#scene-02" },
  { n: "03", key: "stride" as const, anchor: "#scene-03" },
  { n: "04", key: "turn" as const, anchor: "#scene-04" },
  { n: "05", key: "process" as const, anchor: "#scene-05" },
  { n: "06", key: "reach" as const, anchor: "#scene-06" },
];

export const translations = {
  nav: {
    hello: { en: "Hello", de: "Hallo" },
    still: { en: "Still", de: "Still" },
    stride: { en: "Stride", de: "Schritt" },
    turn: { en: "Turn", de: "Wende" },
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
      en: "Begin with Still",
      de: "Mit Still beginnen",
    },
    hint: {
      en: "The heading breathes with your scroll speed.",
      de: "Die Überschrift atmet mit deiner Scroll-Geschwindigkeit.",
    },
  },
  scene: {
    held: { en: "held", de: "gehalten" },
    in_motion: { en: "in motion", de: "in Bewegung" },
    pivot: { en: "pivot", de: "Drehpunkt" },
    frame_count: {
      one: { en: "1 frame", de: "1 Aufnahme" },
      other: { en: "{n} frames", de: "{n} Aufnahmen" },
    },
    empty: { en: "to be filmed", de: "wird noch aufgenommen" },
  },
  still: {
    caption: {
      en: "Held poses. The moment before the next one.",
      de: "Gehaltene Posen. Der Moment vor dem nächsten.",
    },
  },
  stride: {
    caption: {
      en: "Walking frames. Weight between two feet.",
      de: "Laufende Frames. Gewicht zwischen zwei Füßen.",
    },
  },
  turn: {
    caption: {
      en: "Pivots. The frame re-finds the subject.",
      de: "Drehungen. Das Bild findet das Motiv neu.",
    },
  },
  process: {
    heading: { en: "Process", de: "Prozess" },
    body: {
      en: "A working diary will live here — call sheets, test frames, the ten minutes before a slate. For now, this scene is a placeholder until Hanna's own notes are in.",
      de: "Hier wächst ein Arbeitsjournal — Dispositionen, Testaufnahmen, die zehn Minuten vor einer Klappe. Bis Hanna ihre Notizen einreicht, bleibt diese Szene ein Platzhalter.",
    },
    placeholder_note: {
      en: "Placeholder — replace with Hanna's own wording before going live.",
      de: "Platzhaltertext — vor dem Livegang durch Hannas eigene Worte ersetzen.",
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
