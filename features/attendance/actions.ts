"use server";

export async function getAttendance(params: any = {}) {
  return { data: [], total: 0, page: 1, limit: 10 };
}

export async function markAttendance(memberId: string, date?: string) {
  return { success: true };
}

export async function bulkMarkAttendance(memberIds: string[], date?: string) {
  return { success: true };
}

export async function getMembersForAttendance() {
  return [];
}
