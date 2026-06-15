import { notFound } from "next/navigation";
import { getMemberById } from "@/features/members/actions";
import { getPlans } from "@/features/plans/actions";
import { MemberFormPage } from "../../form";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, plans] = await Promise.all([
    getMemberById(id),
    getPlans(),
  ]);

  if (!member) {
    notFound();
  }

  const safePlans = plans.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <MemberFormPage 
      plans={safePlans as never} 
      mode="edit" 
      member={member as never} 
    />
  );
}
