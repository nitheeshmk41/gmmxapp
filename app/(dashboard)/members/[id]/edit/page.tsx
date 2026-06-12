import { notFound } from "next/navigation";
import { getMemberById } from "@/features/members/actions";
import { getPlans } from "@/features/plans/actions";
import { getTrainers } from "@/features/trainers/actions";
import { MemberFormPage } from "../../form";

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const [member, plans, trainers] = await Promise.all([
    getMemberById(params.id),
    getPlans(),
    getTrainers(),
  ]);

  if (!member) {
    notFound();
  }

  // Cast the Prisma object types to match the expected types in the form
  const safeMember = {
    ...member,
    height: member.height ? Number(member.height) : null,
    weight: member.weight ? Number(member.weight) : null,
  };

  const safePlans = plans.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <MemberFormPage 
      plans={safePlans as never} 
      trainers={trainers as never} 
      mode="edit" 
      member={safeMember as never} 
    />
  );
}
