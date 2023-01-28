import React from "react";
import ProjectHeader from "./project-header";

export default function ProjectLayout(props: React.PropsWithChildren<{}>) {
  return (
    <>
      <ProjectHeader />
      <div className="mt-4 flex justify-between border-t">{props.children}</div>
    </>
  );
}
