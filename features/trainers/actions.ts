"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { APPWRITE_DB_ID, COLLECTIONS, TrainerDocument } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

const trainerSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email().optional().or(z.literal("")),
  specialization: z.string().optional(),
  experience_years: z.coerce.number().int().min(0).max(50).optional(),
  bio: z.string().optional(),
  is_active: z.boolean().default(true),
});

export async function getTrainers() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const { databases } = await createAdminClient();
  const response = await databases.listDocuments<TrainerDocument>(
    APPWRITE_DB_ID,
    COLLECTIONS.TRAINERS,
    [Query.equal("gymId", gym.$id), Query.orderAsc("name")]
  );

  return response.documents;
}

export async function getTrainerById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { databases } = await createAdminClient();
  try {
    const trainer = await databases.getDocument<TrainerDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      id
    );
    if (trainer.gymId !== gym.$id) return null;
    return trainer;
  } catch {
    return null;
  }
}

export async function createTrainer(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = trainerSchema.safeParse({ ...raw, is_active: true });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { databases } = await createAdminClient();

  await databases.createDocument(
    APPWRITE_DB_ID,
    COLLECTIONS.TRAINERS,
    ID.unique(),
    {
      ...parsed.data,
      gymId: gym.$id
    }
  );

  revalidatePath("/dashboard/trainers");
  return { success: true };
}

export async function updateTrainer(id: string, formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = trainerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { databases } = await createAdminClient();

  await databases.updateDocument(
    APPWRITE_DB_ID,
    COLLECTIONS.TRAINERS,
    id,
    parsed.data
  );

  revalidatePath("/dashboard/trainers");
  return { success: true };
}

export async function deleteTrainer(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const { databases } = await createAdminClient();
  await databases.deleteDocument(
    APPWRITE_DB_ID,
    COLLECTIONS.TRAINERS,
    id
  );

  revalidatePath("/dashboard/trainers");
  return { success: true };
}
