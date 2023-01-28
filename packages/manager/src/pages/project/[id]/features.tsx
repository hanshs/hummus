import { useRouter } from "next/router";
import React from "react";
import { api, RouterInputs, type RouterOutputs } from "../../../utils/api";
import { useDebouncedCallback } from "use-debounce";
import cn from "../../../utils/cn";
import { Button } from "../../../components/ui/button";
import reactStringReplace from "react-string-replace";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown";
import { ChevronUp, ChevronDown, ChevronRight, Delete } from "lucide-react";
import { moveArrayElement } from "../../../utils/array";
import Link from "next/link";
import ProjectHeader from "../../../components/scenes/project-header";
import ProjectLayout from "../../../components/scenes/project-layout";

type Project = NonNullable<RouterOutputs["projects"]["byId"]>;
type Feature = Project["features"][number];
type Scenario = Feature["scenarios"][number];
type Step = Scenario["steps"][number];
type Param = Step["params"][number];

export default function ProjectPage() {
  const context = api.useContext();
  const router = useRouter();
  const projectId = router.query.id as string;
  const project = api.projects.byId.useQuery(projectId);
  const createFeature = api.features.create.useMutation();
  const [selectedFeatureId, setSelectedFeatureId] =
    React.useState<Feature["id"]>();

  const selectedFeature = React.useMemo(
    () => project.data?.features.find((feat) => feat.id === selectedFeatureId),
    [project.data, selectedFeatureId],
  );

  React.useEffect(() => {
    if (project.data?.features.length && !selectedFeatureId) {
      setSelectedFeatureId(project.data.features[0]?.id);
    }
  }, [project.data?.features]);

  const onCreateFeature = () => {
    createFeature.mutate(
      { projectId },
      {
        onSuccess: () => context.projects.byId.invalidate(projectId),
      },
    );
  };
  return (
    <ProjectLayout>
      <div className="h-screen w-full max-w-xs border-r py-4 pr-4">
        <ul className="text-sm ">
          {project.data?.features.length ? (
            project.data?.features?.map((feature) => {
              const isSelected = selectedFeatureId === feature.id;
              return (
                <li
                  className={cn(
                    `w-full max-w-xs rounded-lg`,
                    isSelected && "bg-slate-100 font-medium",
                  )}
                  key={feature.id}
                >
                  <button
                    className="flex w-full items-center justify-between py-1.5 px-3 text-left"
                    onClick={() => setSelectedFeatureId(feature.id)}
                  >
                    <span className="truncate">
                      {feature.title || (
                        <span className="italic">Untitled feature</span>
                      )}
                    </span>
                    {isSelected && (
                      <ChevronRight width={14} height={14} className="ml-2" />
                    )}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="text-slate-400">You have no features.</li>
          )}
        </ul>
        <Button className="mt-6 block" onClick={onCreateFeature}>
          New feature
        </Button>
      </div>
      <div className="w-full px-12 py-6">
        {selectedFeature && (
          <Feature feature={selectedFeature} key={`${selectedFeatureId}`} />
        )}
      </div>
    </ProjectLayout>
  );
}

function Feature(props: { feature: Feature }) {
  type FeatureUpdateData = RouterInputs["features"]["update"]["data"];
  const context = api.useContext();
  const updateFeature = api.features.update.useMutation();
  const addScenario = api.scenarios.create.useMutation();
  const error = addScenario.error || updateFeature.error;

  const save = useDebouncedCallback((data: FeatureUpdateData) => {
    updateFeature.mutate(
      {
        id: props.feature.id,
        data,
      },
      {
        onSuccess: () => {
          context.projects.byId.invalidate(props.feature.projectId);
        },
      },
    );
  }, 1000);

  const onAddScenario = () => {
    addScenario.mutate(
      { featureId: props.feature.id },
      {
        onSuccess: () => {
          context.projects.byId.invalidate(props.feature.projectId);
        },
      },
    );
  };

  return (
    <div>
      <label className="mb-2 block text-lg font-semibold">Feature</label>
      <input
        className="form-input"
        defaultValue={props.feature.title || ""}
        onChange={(e) => save({ title: e.target.value })}
      />
      <label className="mb-2 mt-4 block text-lg font-semibold">
        Description
      </label>
      <textarea
        className="form-input"
        defaultValue={props.feature.description || ""}
        onChange={(e) => save({ description: e.target.value })}
      />
      <h2 className="mt-6 text-lg font-semibold">Scenarios</h2>
      <ul className="mt-4 space-y-4">
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
      <Button className="mt-4" variant="subtle" onClick={onAddScenario}>
        Add scenario
      </Button>
    </div>
  );
}

function Scenario(props: { scenario: Scenario }) {
  type ScenarioUpdateData = RouterInputs["scenarios"]["update"]["data"];
  const context = api.useContext();
  const update = api.scenarios.update.useMutation();

  const debouncedSave = useDebouncedCallback((data: ScenarioUpdateData) => {
    update.mutate(
      { id: props.scenario.id, data },
      { onSuccess: () => context.projects.byId.invalidate() },
    );
  }, 1000);

  return (
    <div
      className="space-y-4 rounded border bg-slate-50 p-4"
      key={props.scenario.id}
    >
      <input
        className="form-input"
        defaultValue={props.scenario.name || ""}
        placeholder="Scenario name"
        onChange={(e) => debouncedSave({ name: e.target.value })}
      />
      <div className="mt-6 mb-4 font-medium">Steps</div>
      <Steps scenarioId={props.scenario.id} steps={props.scenario.steps} />

      <CreateStep
        scenarioId={props.scenario.id}
        stepsLength={props.scenario.steps.length}
      />
    </div>
  );
}

function CreateStep(props: { scenarioId: number; stepsLength: number }) {
  const context = api.useContext();
  const behaviours = api.behaviours.all.useQuery();
  const addStep = api.scenarios.addStep.useMutation();

  const onAddStep = (behaviourId: number) => {
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
          <DropdownMenuItem
            key={behaviour.id}
            onSelect={() => onAddStep(behaviour.id)}
          >
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

  const onReorderStep = (index: number, direction: "up" | "down") => {
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

  const getStepBehaviour = (step: Step) => {
    let behaviour: React.ReactNode[] | string = step.behaviour.value;

    for (const [index, param] of step.params.entries()) {
      behaviour = reactStringReplace(
        behaviour,
        `<${param.type.type}>`,
        (_match, _i) => (
          <ParamSelector
            key={`${step.id}-${param.paramTypeId}-${index}`}
            param={{ type: param.type.type, id: param.id }}
            stepId={step.id}
          >
            {param.name}
          </ParamSelector>
        ),
      ) as React.ReactNode[];
    }

    let regex = /<(.*?)>/g;

    behaviour = reactStringReplace(behaviour, regex, (type, i) => {
      return (
        <ParamSelector
          key={`${step.id}-${type}-${i}`}
          param={{ type }}
          stepId={step.id}
          variant="warning"
        >
          {`<${type}>`}
        </ParamSelector>
      );
    }) as React.ReactNode[];

    return behaviour;
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
                  "relative rounded-lg  border-transparent py-1",
                  showActions === index &&
                    "-mx-2 border-inherit bg-slate-200 px-2",
                )}
                onMouseOver={() => setShowActions(index)}
                onMouseLeave={() => setShowActions(undefined)}
              >
                {step.order}. {getStepBehaviour(step)}
                {showActions === index && (
                  <div className="absolute right-2 top-1 flex space-x-1">
                    <button className="hover:text-blue-400" title="Move up">
                      <ChevronUp
                        width={20}
                        onClick={() => onReorderStep(index, "up")}
                      />
                    </button>
                    <button
                      className="hover:text-blue-400"
                      title="Move down"
                      onClick={() => onReorderStep(index, "down")}
                    >
                      <ChevronDown width={20} />
                    </button>
                    <button
                      className="hover:text-red-400"
                      title="Delete"
                      onClick={() => onRemoveStep(step)}
                    >
                      <Delete width={20} />
                    </button>
                  </div>
                )}
              </li>
            );
          })
      ) : (
        <span className="text-slate-500">No steps in this scenario.</span>
      )}
    </ul>
  );
}

function ParamSelector(
  props: React.PropsWithChildren<{
    variant?: "warning";
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
          "font-medium  focus:outline-0",
          props.variant === "warning"
            ? "text-orange-500 hover:text-orange-400"
            : "text-blue-500 hover:text-blue-400",
        )}
      >
        {props.children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={String(props.param.id)}
          onValueChange={onSelectParam}
        >
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
