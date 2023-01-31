import ProjectLayout from "../../../components/scenes/project-layout";
import { api } from "../../../utils/api";

export default function ParametersPage() {
  const params = api.params.byType.useQuery({type: 'selector'})
  return <ProjectLayout>
    {JSON.stringify(params.data)}</ProjectLayout>;
}
