import { useRouter } from 'next/router';
import React from 'react';
import { api } from '../../utils/api';
import Tabs from '../ui/tabs';

export default function ProjectLayout(props: React.PropsWithChildren<{}>) {
  // const router = useRouter();
  // const projectId = router.query.id as string;
  // const project = api.projects.byId.useQuery(projectId);

  return (
    <>
      {/* <h1 className="text-xl font-semibold">{project.data?.name}</h1> */}
      <div className="flex justify-between">{props.children}</div>
    </>
  );
}
