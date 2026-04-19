import type { Metadata } from "next";
import PhotosClient from "./PhotosClient";
import { getAllMedia, getCategories, getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: "Photos",
    description: `${name} — photographs, organised by series.`,
    alternates: { canonical: "/photos" },
  };
}

export default async function PhotosPage() {
  const [categories, media] = await Promise.all([getCategories(), getAllMedia()]);
  return <PhotosClient categories={categories} media={media} />;
}
