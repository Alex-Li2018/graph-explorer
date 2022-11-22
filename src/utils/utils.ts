import { RelationshipModel } from '../models/Relationship';
import { IndexMap, Degree } from '../types';
import { isObject } from './object';

export const isArray = Array.isArray;

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

export const getFuncByUnknownType = (
  defaultValue: number,
  value?:
    | number
    | number[]
    | { width: number; height: number }
    | ((d?: any) => number)
    | undefined,
  resultIsNumber = true,
): ((d?: any) => number | number[]) => {
  if (!value && value !== 0) {
    return (d) => {
      if (d.size) {
        if (Array.isArray(d.size))
          return d.size[0] > d.size[1] ? d.size[0] : d.size[1];
        if (isObject(d.size))
          return d.size.width > d.size.height ? d.size.width : d.size.height;
        return d.size;
      }
      return defaultValue;
    };
  }
  if (isFunction(value)) {
    return value;
  }
  if (isNumber(value)) {
    return () => value;
  }
  if (Array.isArray(value)) {
    return () => {
      if (resultIsNumber) {
        const max = Math.max(...(value as number[]));
        return isNaN(max) ? defaultValue : max;
      }
      return value;
    };
  }
  if (isObject(value)) {
    return () => {
      if (resultIsNumber) {
        const max = Math.max(value.width, value.height);
        return isNaN(max) ? defaultValue : max;
      }
      return [value.width, value.height];
    };
  }
  return () => defaultValue;
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
