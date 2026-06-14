import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function OwnerDashboardGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleUpper = (user.role || "").toUpperCase();
  if (roleUpper === "TRAINER") {
    redirect("/trainer/dashboard");
  } else if (roleUpper === "MEMBER") {
    redirect("/member/dashboard");
  }

  return <>{children}</>;
}
