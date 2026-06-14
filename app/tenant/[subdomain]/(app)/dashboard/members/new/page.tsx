import { getPlans } from "@/features/plans/actions";
import { MemberFormPage } from "../form";

export default async function NewMemberPage() {
  const plans = await getPlans();
  return <MemberFormPage plans={plans as never} mode="create" />;
}
