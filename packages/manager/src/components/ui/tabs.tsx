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
        <button
          key={i}
          // variant={tab.isCurrent ? 'subtle' : 'ghost'}
          className={`px-2 pb-4 text-sm text-gray-500 hover:text-gray-900 ${
            tab.isCurrent ? 'border-b-2 border-sky-500 font-semibold text-gray-900' : ''
          }`}
          onClick={() => props.onSelectTab(tab.name)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
