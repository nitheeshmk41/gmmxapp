import { redirect } from "next/navigation";

export default function TenantLoginRedirect() {
  // Owners are the primary users of the gym portal, 
  // so we default to the owner login.
  redirect("/owner/login");
}
