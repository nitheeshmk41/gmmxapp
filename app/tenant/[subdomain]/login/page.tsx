import { redirect } from "next/navigation";

export default function TenantLoginRedirect() {
  // Members are the primary users of the gym portal, 
  // so we default to the member login. Trainers can use /trainer/login.
  redirect("/member/login");
}
