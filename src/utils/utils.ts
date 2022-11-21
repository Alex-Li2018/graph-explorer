import { RelationshipModel } from '../models/Relationship';
import { IndexMap, Degree } from '../types';

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function';

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';

export const isNaN = (num: unknown) => Number.isNaN(Number(num));

export const toNumber = (val: any): any => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};

export const isString = (val: unknown): val is string =>
  typeof val === 'string';

export function isNullish(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

export function optionalToString(value: any) {
  return !isNullish(value) && typeof value?.toString === 'function'
    ? value.toString()
    : value;
}

export const selectorStringToArray = (selector: string) => {
  // Negative lookbehind simulation since js support is very limited.
  // We want to match all . that are not preceded by \\
  // Instead we reverse and look
  // for . that are not followed by \\ (negative lookahead)
  const reverseSelector = selector.split('').reverse().join('');
  const re = /(.+?)(?!\.\\)(?:\.|$)/g;
  const out = [];
  let m;
  while ((m = re.exec(reverseSelector)) !== null) {
    const res = m[1].split('').reverse().join('');
    out.push(res);
  }

  return out
    .filter((r) => r)
    .reverse()
    .map((r) => (r as string).replace(/\\./g, '.'));
};

export const selectorArrayToString = (selectors: any) => {
  const escaped = selectors.map((r: any) => r.replace(/\./g, '\\.'));
  return escaped.join('.');
};

// 获取节点的度
export const getDegree = (
  n: number,
  nodeIdxMap: IndexMap,
  edges: RelationshipModel[] | null,
) => {
  const degrees: Degree[] = [];
  for (let i = 0; i < n; i++) {
    degrees[i] = {
      in: 0,
      out: 0,
      all: 0,
    };
  }
  if (!edges) return degrees;
  edges.forEach((e) => {
    const source = getEdgeTerminal(e, 'source');
    const target = getEdgeTerminal(e, 'target');
    if (source && degrees[nodeIdxMap[source]]) {
      degrees[nodeIdxMap[source]].out += 1;
      degrees[nodeIdxMap[source]].all += 1;
    }
    if (target && degrees[nodeIdxMap[target]]) {
      degrees[nodeIdxMap[target]].in += 1;
      degrees[nodeIdxMap[target]].all += 1;
    }
  });
  return degrees;
};

// 获取边开始节点 结束节点的ID
export const getEdgeTerminal = (
  RelationshipModel: RelationshipModel,
  type: 'source' | 'target',
) => {
  const terminal = RelationshipModel[type];

  return terminal?.id;
};
