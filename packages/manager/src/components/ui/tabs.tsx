import React from 'react';
import cn from '../../utils/cn';
import { Button } from './button';

export default function Tabs(props: {
  tabs: { name: string; isCurrent: boolean }[];
  onSelectTab: (name: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-x-2 border-b', props.className)}>
      {props.tabs.map((tab, i) => (
        <Button
          size="sm"
          key={i}
          variant={tab.isCurrent ? 'subtle' : 'ghost'}
          onClick={() => props.onSelectTab(tab.name)}
        >
          {tab.name}
        </Button>
      ))}
    </div>
  );
}
