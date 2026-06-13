import { getPlans } from "@/features/plans/actions";
import { getTrainers } from "@/features/trainers/actions";
import { MemberFormPage } from "../form";

export default async function NewMemberPage() {
  const [plans, trainers] = await Promise.all([getPlans(), getTrainers()]);
  return <MemberFormPage plans={plans as never} trainers={trainers as never} mode="create" />;
}
