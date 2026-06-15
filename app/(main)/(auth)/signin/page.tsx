import { getCurrentUser } from "@/features/auth/actions";
import { routeForUser } from "@/lib/auth/bootstrap";
import { redirect } from "next/navigation";
import { SignInClient } from "./SignInClient";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(routeForUser(user));
  }

  return <SignInClient />;
}
