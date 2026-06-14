import { getCurrentGym, getCurrentUser } from "@/features/auth/actions";
import { SettingsClientPage } from "./client";

export default async function SettingsPage() {
  const [user, gym] = await Promise.all([getCurrentUser(), getCurrentGym()]);

  // Stub subscription
  const subscription = null;

  return <SettingsClientPage gym={gym as never} user={user as never} subscription={subscription as never} />;
}
