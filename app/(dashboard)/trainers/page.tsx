import { getTrainers } from "@/features/trainers/actions";
import { TrainersClientPage } from "./client";

export default async function TrainersPage() {
  const trainers = await getTrainers();
  return <TrainersClientPage trainers={trainers as never} />;
}
