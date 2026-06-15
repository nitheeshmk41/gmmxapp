import { getMembersForAttendance, getAttendance } from "@/features/attendance/actions";
import { AttendanceClientPage } from "./client";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const date = params.date || new Date().toISOString().split("T")[0];

  const [members, { data: attendance }] = await Promise.all([
    getMembersForAttendance(),
    getAttendance({ date }),
  ]);

  return (
    <AttendanceClientPage
      members={members as never}
      attendance={attendance as never}
      date={date}
    />
  );
}
