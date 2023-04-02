import { RouterOutputs } from '@hummus/api';
import { ChevronUp, ChevronDown, Delete, XCircle, X } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { api } from '../../utils/api';
import cn from '../../utils/cn';
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
type Behaviour = RouterOutputs['behaviours']['browser'][number];
type Steps = { behaviour: { id: string; value: string }; params: { name: string; value: string; type: string }[] }[];
export function BehavioursTab(props: { project: Project }) {
  interface CreateBehaviourForm extends HTMLFormElement {
    readonly elements: HTMLFormControlsCollection & {
      'new-behaviour-value': HTMLInputElement;
    };
  }
  const context = api.useContext();
  const defaultBehaviours = api.behaviours.browser.useQuery();
  const projectBehaviours = api.behaviours.byProjectId.useQuery({ projectId: props.project.id });
  const create = api.behaviours.create.useMutation();

  const [steps, setSteps] = useState<Steps>([]);

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
            context.behaviours.browser.invalidate();
            context.behaviours.byProjectId.invalidate();
            (e.target as CreateBehaviourForm).reset();
          },
        },
      );
    }
  };
  const onAddStep = (behaviour: Behaviour) => {
    console.log('on add', behaviour);
    setSteps([...steps, { behaviour, params: [] }]);
  };
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
            {projectBehaviours.data?.map((b) => (
              <li>{b.value}</li>
            ))}
          </ul>
        </div>
        <div className="basis-1/2 space-y-6">
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

              <Steps steps={steps} />

              <AddStep onAdd={onAddStep} />
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

function Steps(props: { steps: Steps }) {
  const [showActions, setShowActions] = React.useState<number>();

  const onRemoveStep = (step: Steps[number]) => {};
  return (
    <ul className="">
      {props.steps.map((step, index) => {
        return (
          <li
            tabIndex={1}
            key={index}
            className={cn(
              'relative rounded-lg  border-transparent py-1',
              showActions === index && '-mx-2 border-inherit px-2',
            )}
            onMouseOver={() => setShowActions(index)}
            onMouseLeave={() => setShowActions(undefined)}
          >
            {getStepBehaviour(step)}
            {showActions === index && (
              <div className="absolute right-2 top-1 flex space-x-1">
                <button className="hover:text-red-400" title="Delete" onClick={() => onRemoveStep(step)}>
                  <X width={20} />
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AddStep(props: { onAdd: (behaviour: Behaviour) => void }) {
  const behaviours = api.behaviours.browser.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="mr-auto" variant="ghost">
          + Add step
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {behaviours.data?.map((behaviour) => (
          <DropdownMenuItem key={behaviour.id} onSelect={() => props.onAdd(behaviour)}>
            {behaviour.value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const getStepBehaviour = (step: Steps[number]) => {
  let behaviour: React.ReactNode[] | string = step.behaviour.value;

  for (const [index, param] of step.params.entries()) {
    behaviour = reactStringReplace(behaviour, `<${param.type}>`, (_match, _i) => (
      <ParamSelect key={`${step.behaviour.id}-${param.type}-${index}`} param={param}>
        {param.name}
      </ParamSelect>
    )) as React.ReactNode[];
  }

  let regex = /<(.*?)>/g;

  behaviour = reactStringReplace(behaviour, regex, (type, i) => {
    return (
      <ParamSelect key={`${step.behaviour.id}-${type}-${i}`} param={{ type }} variant="warning">
        {`<${type}>`}
      </ParamSelect>
    );
  }) as React.ReactNode[];

  return behaviour;
};

function ParamSelect(
  props: React.PropsWithChildren<{
    variant?: 'warning';
    param: { id?: number; type: string };
    // stepId: number;
  }>,
) {
  // const context = api.useContext();
  // const update = api.steps.update.useMutation();
  const availableParams = api.params.byType.useQuery({
    type: props.param.type,
  });

  const onSelectParam = (value: string) => {
    // update.mutate(
    //   {
    //     stepId: props.stepId,
    //     params: { oldId: props.param.id, newId: Number(value) },
    //   },
    //   { onSuccess: () => context.projects.byId.invalidate() },
    // );
  };

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
        <DropdownMenuRadioGroup value={String(props.param.id)} onValueChange={onSelectParam}>
          {availableParams.data?.map((param) => (
            <DropdownMenuRadioItem key={param.id} value={String(param.id)}>
              {param.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
