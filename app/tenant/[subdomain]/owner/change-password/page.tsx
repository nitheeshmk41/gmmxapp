import { ChangePasswordClient } from "./client";
import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user || !(user as any).requiresPasswordChange) {
    redirect("/owner/dashboard");
  }
  return <ChangePasswordClient />;
}
