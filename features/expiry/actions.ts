"use server";

export async function getExpiringMembers(filter: string = "week") {
  return [];
}

export async function renewMembership(memberId: string, planId: string) {
  return { success: true };
}
