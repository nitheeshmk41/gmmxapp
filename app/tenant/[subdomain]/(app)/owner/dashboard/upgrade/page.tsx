import { getCurrentGym } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import PricingClient from "./PricingClient";

export default async function UpgradePage() {
  const gym = await getCurrentGym();
  if (!gym) redirect("/owner/login");

  return <PricingClient gym={gym} />;
}
