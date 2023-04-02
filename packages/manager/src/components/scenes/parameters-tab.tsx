import { RouterInputs, RouterOutputs } from '@hummus/api';
import { Trash2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { api } from '../../utils/api';
import { Button } from '../ui/button';

type Project = NonNullable<RouterOutputs['projects']['byId']>;
type Feature = Project['features'][number];
type Param = Feature['params'][number];

export function ParamsTab(props: { feature: Feature }) {
  type ParamUpdateInput = RouterInputs['params']['update'];
  interface CreateParamForm extends HTMLFormElement {
    readonly elements: HTMLFormControlsCollection & {
      'new-param-name': HTMLInputElement;
      'new-param-value': HTMLInputElement;
      'new-param-type': HTMLInputElement;
    };
  }
  const context = api.useContext();
  const createParam = api.params.create.useMutation();
  const deleteParam = api.params.delete.useMutation();
  const updateParam = api.params.update.useMutation();
  const sortedParams = props.feature.params.reduce<Record<string, Param[]>>((acc, param) => {
    acc[param.type] ??= [];
    acc[param.type]!.push(param);
    return acc;
  }, {});

  const onCreateParam = (e: React.FormEvent<CreateParamForm>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;

    createParam.mutate(
      {
        name: elements['new-param-name'].value,
        value: elements['new-param-value'].value,
        type: elements['new-param-type'].value,
        featureId: props.feature.id,
      },
      {
        onSuccess: () => {
          context.projects.byId.invalidate();
          (e.target as CreateParamForm).reset();
        },
      },
    );
  };

  const onDeleteParam = (param: Param) => {
    let confirm = true;
    if (param.steps.length > 0) {
      confirm = window.confirm(
        `This parameter is used in ${param.steps.length} steps, are you sure you want to delete?`,
      );
    }
    if (confirm) {
      deleteParam.mutate(
        { id: param.id },
        {
          onSuccess: () => context.projects.byId.invalidate(),
        },
      );
    }
  };

  const save = useDebouncedCallback((data: ParamUpdateInput) => {
    updateParam.mutate(data, { onSuccess: () => context.projects.byId.invalidate() });
  }, 1000);

  return (
    <>
      {/* <h2 className="text-lg font-semibold ">Parameters</h2> */}
      <div className="mt-6 flex">
        <div className="basis-1/2 space-y-6 pr-6">
          {props.feature.params.length ? (
            Object.entries(sortedParams).map(([type, params]) => {
              return (
                <ul className="">
                  <h3 className="text-lg text-blue-800">{type}</h3>
                  {params.map((param) => (
                    <li
                      key={param.id}
                      className={`group relative -ml-7 flex justify-between rounded-lg py-1 pl-7 pr-6 hover:bg-slate-100`}
                    >
                      <input
                        className="font-medium"
                        defaultValue={param.name}
                        onChange={(e) => save({ param: { name: e.target.value, value: param.value }, id: param.id })}
                      />
                      <input
                        className="ml-4 italic"
                        defaultValue={param.value}
                        onChange={(e) => save({ param: { name: param.name, value: e.target.value }, id: param.id })}
                      />
                      <button
                        className="absolute left-1 hidden hover:text-red-500 group-hover:block"
                        onClick={() => onDeleteParam(param)}
                      >
                        <Trash2 width={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              );
            })
          ) : (
            <p>This feature has no parameters.</p>
          )}
        </div>
        <div className="basis-1/2 space-y-6">
          <h4>New parameter</h4>
          <form onSubmit={onCreateParam}>
            <fieldset
              disabled={createParam.isLoading}
              className="mt-6 flex flex-col space-y-4 rounded-lg border bg-slate-50 px-6 py-4 transition-all ease-in-out"
            >
              <div className="space-y-1">
                <label className="block text-sm text-slate-400">Name</label>
                <input required name="new-param-name" className="form-input" placeholder={`eg. "login button"`} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm text-slate-400">Value</label>
                <input
                  name="new-param-value"
                  required
                  className="form-input"
                  placeholder={`eg. "data-test=['login-btn']"`}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm text-slate-400">Type</label>
                <input required className="form-input" list="param-types" id="new-param-type" name="new-param-type" />
                <datalist id="param-types">
                  {Object.keys(sortedParams).map((type) => (
                    <option value={type}>{type}</option>
                  ))}
                </datalist>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Create
              </Button>
              {createParam.isError && 'Failed to create parameter with these values'}
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
