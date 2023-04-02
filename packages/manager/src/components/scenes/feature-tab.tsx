import { RouterInputs, RouterOutputs } from '@hummus/api';
import { ChevronUp, ChevronDown, Delete, DeleteIcon, Trash, Trash2, TrashIcon } from 'lucide-react';
import React from 'react';
import reactStringReplace from 'react-string-replace';
import { useDebouncedCallback } from 'use-debounce';
import { api } from '../../utils/api';
import { moveArrayElement } from '../../utils/array';
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
type Feature = Project['features'][number];
type Scenario = Feature['scenarios'][number];
type Step = Scenario['steps'][number];

export function FeatureTab(props: { feature: Feature }) {
  type FeatureUpdateData = RouterInputs['features']['update']['data'];
  const context = api.useContext();
  const updateFeature = api.features.update.useMutation();
  const addScenario = api.scenarios.create.useMutation();

  // const []

  const error = updateFeature.error;
  const save = useDebouncedCallback((data: FeatureUpdateData) => {
    updateFeature.mutate(
      { id: props.feature.id, data },
      { onSuccess: () => context.projects.byId.invalidate(props.feature.projectId) },
    );
  }, 1000);

  const onAddScenario = () => {
    addScenario.mutate(
      { featureId: props.feature.id },
      { onSuccess: () => context.projects.byId.invalidate(props.feature.projectId) },
    );
  };

  console.log(props.feature.title, props.feature.description);

  return (
    <>
      <label className="mb-3 block text-sm text-gray-500">Feature</label>
      <input
        className="form-input"
        defaultValue={props.feature.title || 'notitle'}
        onChange={(e) => save({ title: e.target.value })}
      />
      <label className="mb-3 mt-6 block text-sm text-gray-500">Description</label>
      <textarea
        className="form-input"
        defaultValue={props.feature.description || ''}
        onChange={(e) => save({ description: e.target.value })}
      />

      <ul className="mt-6 space-y-4">
        {props.feature.scenarios.length ? (
          props.feature.scenarios.map((scenario) => (
            <li key={scenario.id}>
              <Scenario scenario={scenario} key={scenario.id} />
            </li>
          ))
        ) : (
          <p>This feature has no scenarios.</p>
        )}
      </ul>
      {error && error.message}
      <Button className="mt-6" variant="subtle" onClick={onAddScenario}>
        Add scenario
      </Button>
    </>
  );
}

function Scenario(props: { scenario: Scenario }) {
  type ScenarioUpdateData = RouterInputs['scenarios']['update']['data'];
  const context = api.useContext();
  const update = api.scenarios.update.useMutation();
  const remove = api.scenarios.delete.useMutation();

  const onSuccess = () => context.projects.byId.invalidate();

  const save = useDebouncedCallback((data: ScenarioUpdateData) => {
    update.mutate({ id: props.scenario.id, data }, { onSuccess });
  }, 1000);

  const onDeleteScenario = () => {
    remove.mutate({ id: props.scenario.id }, { onSuccess });
  };

  return (
    <div className="rounded border bg-gray-50 p-4" key={props.scenario.id}>
      <h2 className="text-sm text-gray-500">Scenario</h2>
      <div className="items-between mt-3 flex justify-between gap-10">
        <input
          className="form-input"
          defaultValue={props.scenario.name || ''}
          placeholder="Scenario name"
          onChange={(e) => save({ name: e.target.value })}
        />
        <button className="float-right hover:text-red-400" title="Delete" onClick={() => onDeleteScenario()}>
          <Trash2 width={20} />
        </button>
      </div>
      <div className="mt-6 mb-2 text-sm text-gray-500">Steps</div>
      <Steps scenarioId={props.scenario.id} steps={props.scenario.steps} />

      <div className="mt-6">
        <AddStep scenarioId={props.scenario.id} stepsLength={props.scenario.steps.length} />
      </div>
    </div>
  );
}

function AddStep(props: { scenarioId: number; stepsLength: number }) {
  const context = api.useContext();
  const behaviours = api.behaviours.browser.useQuery();
  const addStep = api.scenarios.addStep.useMutation();

  const onAddStep = (behaviourId: string) => {
    addStep.mutate(
      {
        scenarioId: props.scenarioId,
        data: { order: props.stepsLength + 1, behaviourId },
      },
      { onSuccess: () => context.projects.byId.invalidate() },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="" variant="outline">
          Add step
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {behaviours.data?.map((behaviour) => (
          <DropdownMenuItem key={behaviour.id} onSelect={() => onAddStep(behaviour.id)}>
            {behaviour.value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Steps(props: { scenarioId: number; steps: Step[] }) {
  const context = api.useContext();
  const remove = api.scenarios.removeStep.useMutation();
  const reorder = api.scenarios.reorderSteps.useMutation();

  const [showActions, setShowActions] = React.useState<number>();

  const onRemoveStep = (step: Step) =>
    remove.mutate(
      { scenarioId: props.scenarioId, stepId: step.id },
      { onSuccess: () => context.projects.byId.invalidate() },
    );

  const onReorderStep = (index: number, direction: 'up' | 'down') => {
    reorder.mutate(
      {
        scenarioId: props.scenarioId,
        steps: moveArrayElement(
          props.steps.map((s) => ({ id: s.id })),
          index,
          direction,
        ),
      },
      { onSuccess: () => context.projects.byId.invalidate() },
    );
  };

  return (
    <ul className="w-1/2">
      {props.steps.length ? (
        props.steps
          .sort((step, next) => step.order - next.order)
          .map((step, index) => {
            return (
              <li
                tabIndex={1}
                key={index}
                className={cn(
                  'relative rounded-lg  border-transparent py-1',
                  showActions === index && '-mx-2 border-inherit bg-gray-200 px-2',
                )}
                onMouseOver={() => setShowActions(index)}
                onMouseLeave={() => setShowActions(undefined)}
              >
                <span className="mr-1 text-gray-400">{step.order}.</span> {getStepBehaviour(step)}
                {showActions === index && (
                  <div className="absolute right-2 top-1 flex space-x-1">
                    <button className="hover:text-blue-400" title="Move up">
                      <ChevronUp width={20} onClick={() => onReorderStep(index, 'up')} />
                    </button>
                    <button
                      className="hover:text-blue-400"
                      title="Move down"
                      onClick={() => onReorderStep(index, 'down')}
                    >
                      <ChevronDown width={20} />
                    </button>
                    <button className="hover:text-red-400" title="Delete" onClick={() => onRemoveStep(step)}>
                      <Delete width={20} />
                    </button>
                  </div>
                )}
              </li>
            );
          })
      ) : (
        <span className="text-gray-500">-</span>
      )}
    </ul>
  );
}

function ParamSelect(
  props: React.PropsWithChildren<{
    variant?: 'warning';
    param: { id?: number; type: string };
    stepId: number;
  }>,
) {
  const context = api.useContext();
  const update = api.steps.update.useMutation();
  const availableParams = api.params.byType.useQuery({
    type: props.param.type,
  });

  const onSelectParam = (value: string) => {
    update.mutate(
      {
        stepId: props.stepId,
        params: { oldId: props.param.id, newId: Number(value) },
      },
      { onSuccess: () => context.projects.byId.invalidate() },
    );
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

const getStepBehaviour = (step: Step) => {
  let behaviour: React.ReactNode[] | string = step.behaviour.value;

  for (const [index, param] of step.params.entries()) {
    behaviour = reactStringReplace(behaviour, `<${param.type}>`, (_match, _i) => (
      <ParamSelect key={`${step.id}-${param.id}-${index}`} param={param} stepId={step.id}>
        {param.name}
      </ParamSelect>
    )) as React.ReactNode[];
  }

  let regex = /<(.*?)>/g;

  behaviour = reactStringReplace(behaviour, regex, (type, i) => {
    return (
      <ParamSelect key={`${step.id}-${type}-${i}`} param={{ type }} stepId={step.id} variant="warning">
        {`<${type}>`}
      </ParamSelect>
    );
  }) as React.ReactNode[];

  return behaviour;
};
