import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getCategories, getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: name,
    description: profile.bio ?? `${name} — portfolio.`,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const [profile, categories] = await Promise.all([
    getProfile(),
    getCategories(),
  ]);
  return <HomeClient profile={profile} categories={categories} />;
}
