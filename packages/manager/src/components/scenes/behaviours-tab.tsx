import { RouterOutputs } from '@hummus/api';
import { ChevronUp, ChevronDown, Delete, XCircle, X } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { api } from '../../utils/api';
import cn from '../../utils/cn';
import replacePlaceholders from '../../utils/replace-placeholders';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown';

type Project = NonNullable<RouterOutputs['projects']['byId']>;
type DefaultBehaviour = RouterOutputs['behaviours']['browser'][number];
type ProjectBehaviours = RouterOutputs['behaviours']['byProjectId'][number];
type Steps = {
  behaviour: { id: string; value: string };
  params: { id: number; name: string; value: string; type: string }[];
}[];
type Params = Steps[number]['params'];
export function BehavioursTab(props: { project: Project }) {
  const defaultBehaviours = api.behaviours.browser.useQuery();
  const projectBehaviours = api.behaviours.byProjectId.useQuery({ projectId: props.project.id });

  return (
    <>
      {/* <h2 className="text-lg font-semibold ">Behaviours</h2> */}
      <div className="mt-6 flex justify-between">
        <div className="flex flex-col">
          <ul className="basis-1/2">
            {defaultBehaviours.data?.map((b) => (
              <li>{b.value}</li>
            ))}
          </ul>

          {/* <h3 className="mt-4 text-lg font-semibold">Project behaviours</h3> */}
          <hr className="mt-4" />
          <ul className="mt-4 basis-1/2">
            {projectBehaviours.data?.map((behaviour) =>
              behaviour.subSteps.length > 0 ? (
                <li key={behaviour.id} className="flex flex-col">
                  <details>
                    <summary>{behaviour.value}</summary>
                    <ul className="ml-6">
                      {behaviour.subSteps
                        .sort((step, next) => step.order - next.order)
                        .map((subStep) => (
                          <li key={subStep.id}>
                            {replacePlaceholders(subStep.behaviour.value, subStep.params, (param, key) => (
                              <span className="text-blue-500">{param.name}</span>
                            ))}
                          </li>
                        ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={behaviour.id}>{behaviour.value}</li>
              ),
            )}
          </ul>
        </div>
        <div className="basis-1/2 space-y-6">
          <CreateBehaviour project={props.project} />
        </div>
      </div>
    </>
  );
}

function useAllBehaviours(projectId: string): (DefaultBehaviour | ProjectBehaviours)[] {
  const defaultBehaviours = api.behaviours.browser.useQuery();
  const projectBehaviours = api.behaviours.byProjectId.useQuery({ projectId });

  return [...(defaultBehaviours.data || []), ...(projectBehaviours.data || [])];
}

function CreateBehaviour(props: { project: Project }) {
  interface CreateBehaviourForm extends HTMLFormElement {
    readonly elements: HTMLFormControlsCollection & {
      'new-behaviour-value': HTMLInputElement;
    };
  }
  const context = api.useContext();
  const create = api.behaviours.create.useMutation();
  const behaviours = useAllBehaviours(props.project.id);
  const params = api.params.all.useQuery({
    projectId: props.project.id,
  });

  const [steps, setSteps] = useState<Steps>([]);

  const onAddStep = (behaviour: DefaultBehaviour) => {
    setSteps([...steps, { behaviour, params: [] }]);
  };
  const onRemoveStep = (step: Steps[number]) => {};
  const onCreateBehaviour = (e: React.FormEvent<CreateBehaviourForm>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;
    if (props.project) {
      create.mutate(
        {
          value: elements['new-behaviour-value'].value,
          projectId: props.project.id,
          steps: steps.map((s) => ({ behaviourId: s.behaviour.id, paramIds: s.params.map((p) => p.id) })),
        },
        {
          onSuccess: () => {
            context.projects.byId.invalidate();
            context.behaviours.browser.invalidate();
            context.behaviours.byProjectId.invalidate();
            (e.target as CreateBehaviourForm).reset();
            setSteps([]);
          },
        },
      );
    }
  };
  const onSelectParam = (step: Steps[number], param: Params[number]) => {
    setSteps((steps) =>
      steps.map((s) => (s.behaviour === step.behaviour ? { ...s, params: s.params.concat(param) } : s)),
    );
  };
  return (
    <form onSubmit={onCreateBehaviour}>
      <fieldset
        disabled={create.isLoading}
        className="flex flex-col space-y-4 rounded-lg border bg-slate-50 px-6 py-4 transition-all ease-in-out"
      >
        <h4 className="font-medium">New behaviour</h4>
        <div className="space-y-1">
          <label className="block text-sm text-slate-400">Value</label>
          <input
            name="new-behaviour-value"
            required
            className="form-input"
            placeholder={`eg. "I drag <selector> to <selector>"`}
          />
        </div>

        <ul className="">
          {steps.map((step, index) => {
            return (
              <li tabIndex={1} key={index} className="relative rounded-lg  border-transparent py-1">
                {replacePlaceholders(step.behaviour.value, step.params, (param, index) => (
                  <BehaviourSubStepParamSelect
                    projectId={props.project.id}
                    key={index}
                    param={param}
                    variant={param?.name && param?.value ? undefined : 'warning'}
                    onSelectParam={(param) => onSelectParam(step, param)}
                  >
                    {param.name || `<${param.type}>`}
                  </BehaviourSubStepParamSelect>
                ))}
                <div className="absolute right-2 top-1 flex space-x-1">
                  <button className="hover:text-red-400" title="Delete" onClick={() => onRemoveStep(step)}>
                    <X width={20} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="mr-auto" variant="ghost">
              + Add step
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {behaviours.map((behaviour) => (
              <DropdownMenuItem key={behaviour.id} onSelect={() => onAddStep(behaviour)}>
                {behaviour.value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="ml-auto">
          Create
        </Button>
      </fieldset>
    </form>
  );
}

function BehaviourSubStepParamSelect(
  props: React.PropsWithChildren<{
    variant?: 'warning';
    param: { id?: number; type: string };
    onSelectParam: (param: Params[number]) => void;
    projectId: string;
  }>,
) {
  const availableParams = api.params.byType.useQuery({
    type: props.param.type,
    projectId: props.projectId,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'font-medium  focus:outline-0',
          props.variant === 'warning' ? 'text-orange-500 hover:text-orange-400' : 'text-blue-500 hover:text-blue-400',
        )}
      >
        {props.children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={String(props.param.id)}>
          {availableParams.data?.map((param) => (
            <DropdownMenuRadioItem key={param.id} value={String(param.id)} onSelect={() => props.onSelectParam(param)}>
              {param.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
