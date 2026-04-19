// Flat 4-page booklet ledger: cover → photos → about → contact.
// Photo categories live inside /photos as stacked, anchored sections
// (sticky category strip scroll-spies between them) rather than as
// separate pages. The ledger is tenant-agnostic — whichever customer
// LACOP_USER_SLUG points at, the shell always ships four pages.

export type Page = {
  n: string;
  key: string;
  href: string;
  label: string;
};

export function buildPages(labels: {
  cover: string;
  photos: string;
  about: string;
  contact: string;
}): Page[] {
  return [
    { n: "01", key: "cover", href: "/", label: labels.cover },
    { n: "02", key: "photos", href: "/photos", label: labels.photos },
    { n: "03", key: "about", href: "/about", label: labels.about },
    { n: "04", key: "contact", href: "/contact", label: labels.contact },
  ];
}
