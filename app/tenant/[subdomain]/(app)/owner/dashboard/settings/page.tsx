import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/owner/dashboard/settings/profile");
}
