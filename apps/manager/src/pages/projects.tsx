import Link from "next/link";
import { ExternalLink } from "react-feather";
import { api } from "../utils/api";
import { withSession } from "../utils/session";
interface CreateProjectForm extends HTMLFormElement {
  readonly elements: HTMLFormControlsCollection & {
    "hummus-project-name": HTMLInputElement;
  };
}
export default function ProjectsPage() {
  const context = api.useContext();
  const projects = api.projects.all.useQuery();
  const create = api.projects.create.useMutation();

  const onCreateProject = (e: React.FormEvent<CreateProjectForm>) => {
    e.preventDefault();
    create.mutate(
      {
        name: e.currentTarget.elements["hummus-project-name"].value,
      },
      {
        onSuccess: () => {
          context.projects.all.invalidate();
          e.currentTarget.reset();
        },
      },
    );
  };

  return (
    <div className="flex gap-10">
      <div className="w-full basis-2/3 rounded border bg-slate-50 py-4 px-6">
        <h1 className="mb-4 text-lg font-semibold">Projects</h1>
        <div className="flex flex-col gap-2">
          {projects.data?.length ? (
            projects.data?.map((project) => {
              return (
                <Link href={`/project/${project.id}/features`} key={project.id}>
                  <button
                    key={project.id}
                    className="flex w-full justify-between rounded border bg-white px-6 py-4 text-left font-medium shadow-sm hover:text-gray-600"
                  >
                    {project.name}
                    <ExternalLink />
                  </button>
                </Link>
              );
            })
          ) : (
            <span className="text-slate-400">You have no projects.</span>
          )}
        </div>
      </div>

      <form onSubmit={onCreateProject} className="w-full basis-1/3">
        <h2 className="mb-4 text-lg font-semibold">Create new project</h2>
        <div className="items-between flex justify-between gap-2">
          <input
            className="form-input"
            required
            type="text"
            placeholder="Project name"
            name="hummus-project-name"
          />
          <button className="button-primary" type="submit">
            Create
          </button>
        </div>
        {projects.error && (
          <span className="text-orange-700">{projects.error.message}</span>
        )}
      </form>
    </div>
  );
}

export const getServerSideProps = withSession({
  onLoggedOut: {
    redirect: {
      destination: "/",
      permanent: false,
    },
  },
});
