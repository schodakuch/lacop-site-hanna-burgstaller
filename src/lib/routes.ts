// Route ledger for the multi-page shell. Four routes, tenant-agnostic.
// Home stays `/`, photos + process + contact are their own pages. The
// Navigation minimap iterates this list, keying the active entry off
// `usePathname()`.

export type RouteKey = "home" | "photos" | "process" | "contact";

export type RouteEntry = {
  key: RouteKey;
  href: string;
  label: { en: string; de: string };
};

export function buildRoutes(labels: {
  home: { en: string; de: string };
  photos: { en: string; de: string };
  process: { en: string; de: string };
  contact: { en: string; de: string };
}): RouteEntry[] {
  return [
    { key: "home", href: "/", label: labels.home },
    { key: "photos", href: "/photos", label: labels.photos },
    { key: "process", href: "/process", label: labels.process },
    { key: "contact", href: "/contact", label: labels.contact },
  ];
}
