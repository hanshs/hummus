import { RouterOutputs } from '@hummus/api';
import { api } from '../../utils/api';
import { Button } from '../ui/button';

type Project = RouterOutputs['projects']['byId'];

export function BehavioursTab(props: { project?: Project }) {
  interface CreateBehaviourForm extends HTMLFormElement {
    readonly elements: HTMLFormControlsCollection & {
      'new-behaviour-value': HTMLInputElement;
    };
  }
  const context = api.useContext();
  const behaviours = api.behaviours.all.useQuery();
  const create = api.behaviours.create.useMutation();
  const onCreateBehaviour = (e: React.FormEvent<CreateBehaviourForm>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;
    if (props.project) {
      create.mutate(
        {
          value: elements['new-behaviour-value'].value,
          projectId: props.project.id,
        },
        {
          onSuccess: () => {
            context.projects.byId.invalidate();
            context.behaviours.all.invalidate();
            (e.target as CreateBehaviourForm).reset();
          },
        },
      );
    }
  };
  return (
    <>
      <h2 className="text-lg font-semibold ">Behaviours</h2>
      <div className="mt-6 flex">
        <ul className="basis-1/2">
          {behaviours.data?.map((b) => (
            <li>{b.value}</li>
          ))}
        </ul>
        <div className="basis-1/2 space-y-6">
          <h4>New behaviour</h4>
          <form onSubmit={onCreateBehaviour}>
            <fieldset
              disabled={create.isLoading}
              className="mt-6 flex flex-col space-y-4 rounded-lg border bg-slate-50 px-6 py-4 transition-all ease-in-out"
            >
              <div className="space-y-1">
                <label className="block text-sm text-slate-400">Value</label>
                <input
                  name="new-behaviour-value"
                  required
                  className="form-input"
                  placeholder={`eg. "I drag <selector> to <selector>"`}
                />
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Create
              </Button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
