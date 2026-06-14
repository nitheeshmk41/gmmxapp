import { getCurrentGym } from "@/features/auth/actions";
import { GalleryClientPage } from "./client";

export default async function WebsiteGalleryPage() {
  const gym = await getCurrentGym();
  return <GalleryClientPage gym={gym as any} />;
}
