import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { getCategories, getProfile } from "@/lib/lacop";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const body = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanna-burgstaller.lacop.site";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const displayName = profile.display_name ?? profile.slug;
  const description =
    profile.bio ??
    `${displayName} — a scrolling sequence. Stills, strides, turns.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: displayName,
      template: `%s · ${displayName}`,
    },
    description,
    authors: [{ name: displayName }],
    creator: displayName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      locale: "en_US",
      alternateLocale: ["de_DE"],
      url: SITE_URL,
      siteName: displayName,
      title: displayName,
      description,
      images: profile.hero_image_url
        ? [{ url: profile.hero_image_url, alt: displayName }]
        : undefined,
    },
    twitter: {
      card: profile.hero_image_url ? "summary_large_image" : "summary",
      title: displayName,
      description,
      images: profile.hero_image_url ? [profile.hero_image_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);
  const displayName = profile.display_name ?? profile.slug;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    jobTitle: profile.role,
    url: SITE_URL,
    image: profile.hero_image_url ?? profile.profile_image_url ?? undefined,
    sameAs: Object.values(profile.social_links),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: displayName,
    url: SITE_URL,
    inLanguage: ["en-US", "de-DE"],
  };

  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} bg-paper text-ink min-h-screen flex flex-col`}
      >
        <a
          href="#scene-01"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em]"
        >
          Skip to content
        </a>
        <ProfileProvider profile={profile} categories={categories}>
          <LanguageProvider>
            <Navigation />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ProfileProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
