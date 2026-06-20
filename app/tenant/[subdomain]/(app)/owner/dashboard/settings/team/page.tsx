import { redirect } from "next/navigation";

export default function TeamRedirect() {
  redirect("/owner/dashboard/settings");
}
