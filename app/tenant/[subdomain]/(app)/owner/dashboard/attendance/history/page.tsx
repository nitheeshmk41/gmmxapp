import { redirect } from "next/navigation";

export default function AttendanceHistoryRedirectPage() {
  redirect("/owner/dashboard/attendance");
}
