import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getAllMedia, getCategories, getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: name,
    description: profile.bio ?? `${name} — Portfolio.`,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const [profile, categories, media] = await Promise.all([
    getProfile(),
    getCategories(),
    getAllMedia(),
  ]);
  return <HomeClient profile={profile} categories={categories} media={media} />;
}
