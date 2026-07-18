import { getCurrentGym } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import PricingClient from "./PricingClient";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export default async function UpgradePage() {
  const gym = await getCurrentGym();
  if (!gym) redirect("/owner/login");

  let isTrial = false;
  let daysLeft = 0;

  try {
    const { databases } = await createAdminClient();
    const subRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.equal("gymId", gym.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(1)
    ]);
    const subscription = subRes.documents[0];
    if (subscription && subscription.status === "trial") {
      isTrial = true;
      daysLeft = Math.max(0, Math.ceil((new Date(subscription.endsAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    }
  } catch (error) {
    console.error("Failed to fetch subscription for upgrade page", error);
  }

  return <PricingClient gym={gym} isTrial={isTrial} daysLeft={daysLeft} />;
}
