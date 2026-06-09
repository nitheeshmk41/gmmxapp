import { getCurrentGym, getCurrentUser } from "@/features/auth/actions";
import { prisma } from "@/lib/prisma";
import { SettingsClientPage } from "./client";

export default async function SettingsPage() {
  const [user, gym] = await Promise.all([getCurrentUser(), getCurrentGym()]);

  const subscription = gym
    ? await prisma.subscription.findFirst({ where: { gym_id: gym.id }, orderBy: { created_at: "desc" } })
    : null;

  return <SettingsClientPage gym={gym as never} user={user as never} subscription={subscription as never} />;
}
