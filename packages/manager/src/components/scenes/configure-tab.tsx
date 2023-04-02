import { RouterOutputs } from '@hummus/api';
import { api } from '../../utils/api';
import { Button } from '../ui/button';

type Project = NonNullable<RouterOutputs['projects']['byId']>;
type Feature = Project['features'][number];

export function ConfigureTab(props: { project: Project; feature: Feature }) {
  const context = api.useContext();

  const del = api.features.delete.useMutation();
  const onDelete = () => {
    del.mutate(
      {
        id: props.feature.id,
      },
      {
        onSuccess: () => {
          context.projects.byId.invalidate();
        },
      },
    );
  };
  return (
    <>
      <h2 className="text-lg font-semibold ">Confiure</h2>
      <div className="mt-6 flex">
        <Button variant="outline" size="sm" onClick={onDelete}>
          Delete feature
        </Button>
      </div>
    </>
  );
}
