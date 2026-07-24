"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, AttendanceDocument, MemberDocument } from "@/lib/appwrite/types";

type AttendanceParams = {
  date?: string;
};

function getAttendanceDate(date?: string) {
  return date || new Date().toISOString().split("T")[0];
}

function getRevalidatePaths() {
  return ["/owner/dashboard", "/owner/dashboard/attendance"];
}

export async function getAttendance(params: AttendanceParams = {}) {
  const gym = await getCurrentGym();
  if (!gym) {
    return { data: [], total: 0, page: 1, limit: 50 };
  }

  const attendanceDate = getAttendanceDate(params.date);

  try {
    const { databases } = await createAdminClient();
    const attendanceRes = await databases.listDocuments<AttendanceDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.ATTENDANCE,
      [
        Query.equal("gymId", gym.$id),
        Query.equal("attendanceDate", attendanceDate),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]
    );

    const data = await Promise.all(
      attendanceRes.documents.map(async (record) => {
        let memberName = "Member";

        try {
          const member = await databases.getDocument<MemberDocument>(
            APPWRITE_DB_ID,
            COLLECTIONS.MEMBERS,
            record.memberId
          );

          if (member.gymId === gym.$id) {
            memberName = member.name;
          }
        } catch {}

        return {
          id: record.$id,
          member_id: record.memberId,
          member: { name: memberName },
          checkIn: record.checkIn,
          method: record.method,
          source: record.source,
        };
      })
    );

    return {
      data,
      total: attendanceRes.total,
      page: 1,
      limit: 100,
    };
  } catch (error) {
    console.error("[getAttendance] Failed to fetch attendance:", error);
    return { data: [], total: 0, page: 1, limit: 50 };
  }
}

export async function markAttendance(memberId: string, date?: string) {
  const gym = await getCurrentGym();
  if (!gym) {
    return { success: false, error: "Unauthorized" };
  }

  const attendanceDate = getAttendanceDate(date);

  try {
    const { databases } = await createAdminClient();

    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      memberId
    );

    if (member.gymId !== gym.$id) {
      return { success: false, error: "Member does not belong to this gym." };
    }

    const existing = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.ATTENDANCE,
      [
        Query.equal("gymId", gym.$id),
        Query.equal("memberId", memberId),
        Query.equal("attendanceDate", attendanceDate),
        Query.limit(1),
      ]
    );

    if (existing.total > 0) {
      getRevalidatePaths().forEach((path) => revalidatePath(path));
      return { success: true, alreadyMarked: true };
    }

    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, ID.unique(), {
      gymId: gym.$id,
      memberId,
      attendanceDate,
      checkIn: new Date().toISOString(),
      checkOut: null,
      method: "manual",
      source: "manual",
    });

    getRevalidatePaths().forEach((path) => revalidatePath(path));
    return { success: true };
  } catch (error) {
    console.error("[markAttendance] Failed to mark attendance:", error);
    return { success: false, error: "Failed to mark attendance." };
  }
}

export async function bulkMarkAttendance(memberIds: string[], date?: string) {
  const gym = await getCurrentGym();
  if (!gym) {
    return { success: false, error: "Unauthorized" };
  }

  const attendanceDate = getAttendanceDate(date);

  try {
    let markedCount = 0;

    for (const memberId of memberIds) {
      const result = await markAttendance(memberId, attendanceDate);
      if (result.success) {
        markedCount += 1;
      }
    }

    getRevalidatePaths().forEach((path) => revalidatePath(path));
    return { success: true, markedCount };
  } catch (error) {
    console.error("[bulkMarkAttendance] Failed to mark attendance:", error);
    return { success: false, error: "Failed to mark attendance." };
  }
}

export async function getMembersForAttendance() {
  const gym = await getCurrentGym();
  if (!gym) {
    return [];
  }

  try {
    const { databases } = await createAdminClient();
    const membersRes = await databases.listDocuments<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", gym.$id), Query.orderAsc("name"), Query.limit(100)]
    );

    return membersRes.documents.map((member) => ({
      id: member.$id,
      name: member.name,
      phone: member.phone,
      photo_url: null,
    }));
  } catch (error) {
    console.error("[getMembersForAttendance] Failed to fetch members:", error);
    return [];
  }
}
