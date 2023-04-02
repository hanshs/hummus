import type { ReactNode } from 'react';

type RenderParamFunction = (param: { type: string; name?: string; value?: string }, index: number) => ReactNode;

interface PlaceholderParam {
  name: string;
  value: string;
  type: string;
}

export default function replacePlaceholders(
  value: string,
  params: PlaceholderParam[],
  renderParam: RenderParamFunction,
): React.ReactNode[] {
  const regex = /<(.*?)>/g;
  const indexMap: { [type: string]: number } = {};
  const parts = value.split(regex);

  return parts.reduce((acc: React.ReactNode[], part, i) => {
    if (i % 2 === 0) {
      acc.push(part);
    } else {
      const type = part;
      const index = indexMap[type] || 0;
      const param = params.filter((param) => param.type === type)[index] || { type };
      acc.push(renderParam(param, index));
      indexMap[type] = index + 1;
    }

    return acc;
  }, []);
}
