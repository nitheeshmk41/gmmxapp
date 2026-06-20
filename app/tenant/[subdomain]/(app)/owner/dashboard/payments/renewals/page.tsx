import { redirect } from "next/navigation";

export default function RenewalsRedirectPage() {
  redirect("/owner/dashboard/payments");
}
