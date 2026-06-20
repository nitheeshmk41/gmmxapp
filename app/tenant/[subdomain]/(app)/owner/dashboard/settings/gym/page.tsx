import { redirect } from "next/navigation";

export default function GymSettingsRedirect() {
  redirect("/owner/dashboard/settings");
}
