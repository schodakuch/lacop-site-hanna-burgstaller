import type { Metadata } from "next";
import ProcessClient from "./ProcessClient";
import { getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: "Process",
    description: `${name} — working notes.`,
    alternates: { canonical: "/process" },
  };
}

export default async function ProcessPage() {
  const profile = await getProfile();
  return <ProcessClient profile={profile} />;
}
