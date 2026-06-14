import { getCurrentGym } from "@/features/auth/actions";
import { ContactClientPage } from "./client";

export default async function WebsiteContactPage() {
  const gym = await getCurrentGym();
  return <ContactClientPage gym={gym as any} />;
}
