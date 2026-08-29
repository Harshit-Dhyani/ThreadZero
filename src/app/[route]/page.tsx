import { notFound } from "next/navigation";
import { RouteScreen } from "@/components/route-screen";
import { ALL_ROUTE_IDS } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ROUTE_IDS.map((route) => ({ route }));
}

export default async function RoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  if (!ALL_ROUTE_IDS.includes(route)) notFound();
  return <RouteScreen routeId={route} />;
}
