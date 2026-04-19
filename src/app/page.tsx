import HomeClient from "./HomeClient";
import { getProfile } from "@/lib/lacop";

export const revalidate = 10;

export default async function Home() {
  const profile = await getProfile();
  return <HomeClient profile={profile} />;
}
