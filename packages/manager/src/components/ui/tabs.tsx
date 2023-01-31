import React from 'react';
import cn from '../../utils/cn';
import { Button } from './button';

export default function Tabs(props: {
  tabs: { name: string; isCurrent: boolean }[];
  onSelectTab: (name: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('-mx-12 space-x-2 border-b px-4 pb-4', props.className)}>
      {props.tabs.map((tab) => (
        <Button size="sm" variant={tab.isCurrent ? 'subtle' : 'ghost'} onClick={() => props.onSelectTab(tab.name)}>
          {tab.name}
        </Button>
      ))}
    </div>
  );
}
