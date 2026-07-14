import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/context";
import { getTenantBySubdomain, getTenantByHostname } from "@/lib/tenant";
import { headers } from "next/headers";
import GymPage from "../page";

interface Props {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PreviewPage(props: Props) {
  const { subdomain } = await props.params;
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const hostname = host.split(":")[0];

  const tenant = await getTenantByHostname(hostname) || await getTenantBySubdomain(subdomain);
  if (!tenant) redirect("/owner/login");

  const context = await getCurrentContext();
  const isOwner = context?.user?.id === tenant.ownerId;

  if (!isOwner) {
    redirect("/owner/login");
  }

  return <GymPage params={props.params} />;
}
