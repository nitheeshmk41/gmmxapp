import { getPlans } from "@/features/plans/actions";
import { PlansClientPage } from "./client";

export default async function PlansPage() {
  const plans = await getPlans();
  return <PlansClientPage plans={plans as never} />;
}
