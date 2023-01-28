import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { Button } from "../ui/button";

export default function ProjectHeader() {
  const router = useRouter();
  const projectId = router.query.id as string;
  const project = api.projects.byId.useQuery(projectId);

  const isPath = (route: string) => router.asPath.includes(route);

  const routes = [
    {
      name: "Features",
      href: `/project/${projectId}/features`,
      isCurrent: router.asPath.includes("features"),
    },
    {
      name: "Parameters",
      href: `/project/${projectId}/parameters`,
      isCurrent: router.asPath.includes("parameters"),
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">{project.data?.name}</h1>
      <div className="space-x-1">
        {routes.map((route) => (
          <Link href={route.href}>
            <Button
              size="sm"
              variant={route.isCurrent ? "subtle" : "ghost"}
              // className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-medium"
              value="features"
            >
              {route.name}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
