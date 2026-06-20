import { redirect } from "next/navigation";

export default function IntegrationsRedirect() {
  redirect("/owner/dashboard/settings");
}
