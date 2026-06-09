import { getDomains } from "@/features/domains/actions";
import { getCurrentGym } from "@/features/auth/actions";
import { DomainClientPage } from "./client";

export default async function DomainPage() {
  const [domains, gym] = await Promise.all([getDomains(), getCurrentGym()]);
  return <DomainClientPage domains={domains as never} gym={gym as never} />;
}
