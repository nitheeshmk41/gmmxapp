import { getTrainerById } from "@/features/trainers/actions";
import { notFound } from "next/navigation";
import TrainerEditForm from "./client";

interface Props {
  params: Promise<{ subdomain: string; id: string }>;
}

export default async function EditTrainerPage({ params }: Props) {
  const { id } = await params;
  const trainer = await getTrainerById(id);

  if (!trainer) {
    notFound();
  }

  // Map to serializable object
  const safeTrainer = {
    id: trainer.$id,
    name: trainer.name,
    phone: trainer.phone,
    email: trainer.email || "",
    specialization: trainer.specialization || "",
    experience_years: trainer.experienceYears || 0,
    bio: trainer.bio || "",
    isActive: trainer.isActive,
  };

  return <TrainerEditForm trainer={safeTrainer} />;
}
