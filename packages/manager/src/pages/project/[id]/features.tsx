import { useRouter } from 'next/router';
import React from 'react';
import { api, type RouterOutputs } from '../../../utils/api';
import cn from '../../../utils/cn';
import { Button } from '../../../components/ui/button';

import { ChevronRight } from 'lucide-react';
import Tabs from '../../../components/ui/tabs';
import ProjectLayout from '../../../components/scenes/project-layout';
import { ParamsTab } from '../../../components/scenes/parameters-tab';
import { FeatureTab } from '../../../components/scenes/feature-tab';
import { BehavioursTab } from '../../../components/scenes/behaviours-tab';
import { SettingsTab } from '../../../components/scenes/settings-tab';

type Project = NonNullable<RouterOutputs['projects']['byId']>;
type Feature = Project['features'][number];

export default function ProjectPage() {
  const context = api.useContext();
  const router = useRouter();
  const projectId = router.query.id as string;
  const { data: project } = api.projects.byId.useQuery(projectId);
  const createFeature = api.features.create.useMutation();
  const [selectedFeatureId, setSelectedFeatureId] = React.useState<Feature['id']>();
  const [tabs, setTabs] = React.useState([
    {
      name: 'Feature',
      isCurrent: true,
    },
    {
      name: 'Parameters',
      isCurrent: false,
    },
    {
      name: 'Behaviours',
      isCurrent: false,
    },
    {
      name: 'Settings',
      isCurrent: false,
    },
  ]);
  const selectedFeature = React.useMemo(
    () => project?.features.find((feat) => feat.id === selectedFeatureId),
    [project, selectedFeatureId],
  );
  const selectedTab = tabs.find((tab) => tab.isCurrent)!.name;

  const onSelectTab = (t: String) =>
    setTabs((s) => s.map((tab) => (t === tab.name ? { ...tab, isCurrent: true } : { ...tab, isCurrent: false })));

  React.useEffect(() => {
    if (project?.features.length && !selectedFeatureId) {
      setSelectedFeatureId(project.features[0]?.id);
    }
  }, [project?.features]);

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
          {project?.features.length ? (
            project?.features?.map((feature) => {
              const isSelected = selectedFeatureId === feature.id;
              return (
                <li
                  className={cn(`w-full max-w-xs rounded-lg`, isSelected && 'bg-slate-100 font-medium')}
                  key={feature.id}
                >
                  <button
                    className="flex w-full items-center justify-between py-1.5 px-3 text-left"
                    onClick={() => setSelectedFeatureId(feature.id)}
                  >
                    <span className="truncate">
                      {feature.title || <span className="italic">Untitled feature</span>}
                    </span>
                    {isSelected && <ChevronRight width={14} height={14} className="ml-2" />}
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
      <div className="w-full">
        {selectedFeature && (
          <>
            <Tabs tabs={tabs} onSelectTab={onSelectTab} className="px-6 pt-4" />
            <div className="px-8 py-4">
              {project && (
                <>
                  {selectedTab === 'Feature' && (
                    <FeatureTab key={selectedFeatureId} feature={selectedFeature} project={project} />
                  )}
                  {selectedTab === 'Parameters' && <ParamsTab feature={selectedFeature} project={project} />}
                  {selectedTab === 'Behaviours' && <BehavioursTab project={project} />}
                  {selectedTab === 'Settings' && <SettingsTab feature={selectedFeature} project={project} />}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </ProjectLayout>
  );
}
