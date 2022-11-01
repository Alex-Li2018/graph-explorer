export declare class Selector {
  tag: string;
  classes: string[];
  constructor(tag: string, classes: null | string[]);
  toString: () => string;
}
declare class StyleElement {
  selector: Selector;
  props: any;
  constructor(selector: Selector);
  applyRules: (rules: StyleRule[]) => this;
  get: (attr: string) => any;
}
declare class StyleRule {
  selector: Selector;
  props: Record<string, string>;
  constructor(selector1: Selector, props1: Record<string, string>);
  matches: (selector: Selector) => boolean;
  matchesExact: (selector: Selector) => boolean;
}
declare type DefaultSizeType = {
  diameter: string;
};
declare type DefaultArrayWidthType = {
  'shaft-width': string;
};
declare type DefaultColorType = {
  color: string;
  'border-color': string;
  'text-color-internal': string;
};
export declare class GraphStyleModel {
  private useGeneratedDefaultColors;
  rules: StyleRule[];
  constructor(useGeneratedDefaultColors?: boolean);
  parseSelector: (key: string) => Selector;
  nodeSelector: (node?: { labels: null | string[] }) => Selector;
  relationshipSelector: (rel?: { type: null | string }) => Selector;
  findRule: (selector: Selector, rules: StyleRule[]) => StyleRule | undefined;
  findAvailableDefaultColor: (rules: StyleRule[]) => DefaultColorType;
  getDefaultNodeCaption: (item: any) =>
    | {
        caption: string;
      }
    | {
        defaultCaption: string;
      };
  calculateStyle: (selector: Selector) => StyleElement;
  setDefaultNodeStyle: (selector: Selector, item: any) => void;
  changeForSelector: (selector: Selector, props: any) => StyleRule;
  destroyRule: (rule: StyleRule) => void;
  importGrass: (string: string) => void;
  parse: (string: string) => any;
  resetToDefault: () => void;
  toSheet: () => any;
  toString: () => string;
  loadRules: (data?: any) => void;
  defaultSizes: () => DefaultSizeType[];
  defaultArrayWidths: () => DefaultArrayWidthType[];
  defaultColors: () => DefaultColorType[];
  interpolate: (str: any, item: any) => any;
  forNode: (node?: any) => StyleElement;
  forRelationship: (rel: any) => StyleElement;
}
export {};
