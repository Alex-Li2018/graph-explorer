import { calculateDefaultNodeColors } from '../utils/wordColorCalculator';
import { selectorArrayToString, selectorStringToArray } from '../utils/utils';

// 节点 边选择器
export class Selector {
  tag = '';
  classes: string[] = [];
  constructor(tag: string, classes: null | string[]) {
    this.tag = tag;
    this.classes = classes ?? [];
  }

  toString = (): string => {
    return selectorArrayToString([this.tag].concat(this.classes));
  };
}

class StyleElement {
  selector: Selector;
  props: any;
  constructor(selector: Selector) {
    this.selector = selector;
    this.props = {};
  }

  /**
   * 从当前样式规则里找到对应的选择集样式
   * @param rules
   * @returns
   */
  applyRules = (rules: StyleRule[]) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.matches(this.selector)) {
        this.props = { ...this.props, ...rule.props };
        this.props.caption = this.props.caption || this.props.defaultCaption;
      }
    }
    return this;
  };

  get = (attr: string) => {
    return this.props[attr] || '';
  };
}

class StyleRule {
  selector: Selector;
  props: Record<string, string>;
  constructor(selector1: Selector, props1: Record<string, string>) {
    this.selector = selector1;
    this.props = props1;
  }

  matches = (selector: Selector) => {
    if (this.selector.tag !== selector.tag) {
      return false;
    }
    for (let i = 0; i < this.selector.classes.length; i++) {
      const selectorClass = this.selector.classes[i];
      if (
        selectorClass != null &&
        selector.classes.indexOf(selectorClass) === -1
      ) {
        return false;
      }
    }
    return true;
  };

  matchesExact = (selector: Selector) => {
    return (
      this.matches(selector) &&
      this.selector.classes.length === selector.classes.length
    );
  };
}

// 默认样式
const DEFAULT_STYLE = {
  'node.1times': {
    diameter: '50px',
  },
  'node.125times': {
    diameter: '62px',
  },
  'node.15times': {
    diameter: '75px',
  },
  'node.175times': {
    diameter: '88px',
  },
  'node.2times': {
    diameter: '100px',
  },
  node: {
    diameter: '50px',
    color: '#A5ABB6',
    'border-color': '#9AA1AC',
    'border-width': '2px',
    'text-color-internal': '#FFFFFF',
    'font-size': '10px',
  },
  relationship: {
    color: '#A5ABB6',
    'shaft-width': '1px',
    'font-size': '8px',
    padding: '3px',
    'text-color-external': '#000000',
    'text-color-internal': '#FFFFFF',
    caption: '<type>',
  },
};
// 直径
type DefaultSizeType = { diameter: string };
const DEFAULT_SIZES: DefaultSizeType[] = [
  {
    diameter: '50px',
  },
  {
    diameter: '62px',
  },
  {
    diameter: '75px',
  },
  {
    diameter: '88px',
  },
  {
    diameter: '100px',
  },
];
type DefaultArrayWidthType = { 'shaft-width': string };
const DEFAULT_ARRAY_WIDTHS: DefaultArrayWidthType[] = [
  {
    'shaft-width': '1px',
  },
  {
    'shaft-width': '2px',
  },
  {
    'shaft-width': '3px',
  },
  {
    'shaft-width': '5px',
  },
  {
    'shaft-width': '8px',
  },
  {
    'shaft-width': '13px',
  },
  {
    'shaft-width': '25px',
  },
  {
    'shaft-width': '38px',
  },
];

type DefaultColorType = {
  color: string;
  'border-color': string;
  'text-color-internal': string;
};
// 默认样式 每个节点不同label不同样式
const DEFAULT_COLORS: DefaultColorType[] = [
  {
    color: '#604A0E',
    'border-color': '#423204',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#C990C0',
    'border-color': '#b261a5',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#F79767',
    'border-color': '#f36924',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#57C7E3',
    'border-color': '#23b3d7',
    'text-color-internal': '#2A2C34',
  },
  {
    color: '#F16667',
    'border-color': '#eb2728',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#D9C8AE',
    'border-color': '#c0a378',
    'text-color-internal': '#2A2C34',
  },
  {
    color: '#8DCC93',
    'border-color': '#5db665',
    'text-color-internal': '#2A2C34',
  },
  {
    color: '#ECB5C9',
    'border-color': '#da7298',
    'text-color-internal': '#2A2C34',
  },
  {
    color: '#4C8EDA',
    'border-color': '#2870c2',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#FFC454',
    'border-color': '#d7a013',
    'text-color-internal': '#2A2C34',
  },
  {
    color: '#DA7194',
    'border-color': '#cc3c6c',
    'text-color-internal': '#FFFFFF',
  },
  {
    color: '#569480',
    'border-color': '#447666',
    'text-color-internal': '#FFFFFF',
  },
];

export class GraphStyleModel {
  rules: StyleRule[];

  constructor(private useGeneratedDefaultColors: boolean = false) {
    this.rules = [];
    try {
      this.loadRules();
    } catch (_error) {
      // e = _error
    }
  }

  parseSelector = function (key: string): Selector {
    const tokens = selectorStringToArray(key);
    return new Selector(tokens[0], tokens.slice(1));
  };

  /**
   *
   * @param node 节点
   * @returns 节点的选择{ tag: node, class: [lables]}
   */
  nodeSelector = function (
    node: { labels: null | string[] } = { labels: null },
  ): Selector {
    const classes = node.labels != null ? node.labels : [];
    return new Selector('node', classes);
  };

  /**
   * 关系选择其
   * @param rel 关系
   * @returns
   */
  relationshipSelector = function (
    rel: { type: null | string } = { type: null },
  ): Selector {
    const classes = rel.type != null ? [rel.type] : [];
    return new Selector('relationship', classes);
  };

  /**
   * 根据selector寻找对应的规则 没有返回undefined
   * @param selector
   * @param rules
   * @returns
   */
  findRule = function (
    selector: Selector,
    rules: StyleRule[],
  ): StyleRule | undefined {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.matchesExact(selector)) {
        return rule;
      }
    }
    return undefined;
  };

  /**
   * 根据规则找到可以使用的颜色
   * @param rules
   * @returns
   */
  findAvailableDefaultColor = function (rules: StyleRule[]): DefaultColorType {
    const usedColors = rules
      .filter((rule: StyleRule) => {
        return rule.props.color != null;
      })
      .map((rule: StyleRule) => {
        return rule.props.color;
      });
    const index =
      // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'number' a... Remove this comment to see the full error message
      usedColors.length - 1 > DEFAULT_COLORS ? 0 : usedColors.length - 1;
    return DEFAULT_COLORS[index];
  };

  /**
   * 设置默认的节点名称
   * @param item
   * @returns
   */
  getDefaultNodeCaption = function (
    item: any,
  ): { caption: string } | { defaultCaption: string } {
    if (
      !item ||
      // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
      !(item.propertyList != null ? item.propertyList.length : 0) > 0
    ) {
      return {
        defaultCaption: '<id>',
      };
    }
    const captionPrioOrder = [
      /^name$/i,
      /^title$/i,
      /^label$/i,
      /name$/i,
      /description$/i,
      /^.+/,
    ];
    let defaultCaption = captionPrioOrder.reduceRight((leading, current) => {
      const hits = item.propertyList.filter((prop: any) =>
        current.test(prop.key),
      );
      if (hits.length) {
        return `{${hits[0].key}}`;
      } else {
        return leading;
      }
    }, '');
    defaultCaption || (defaultCaption = '<id>');
    return {
      caption: defaultCaption,
    };
  };

  /**
   * 计算对应的样式
   * @param selector 选择器
   * @returns
   */
  calculateStyle = (selector: Selector): StyleElement => {
    return new StyleElement(selector).applyRules(this.rules);
  };

  /**
   * 设置节点默认样式
   * @param selector 选择器
   * @param item 节点
   */
  setDefaultNodeStyle = (selector: Selector, item: any): void => {
    let defaultColor = true;
    let defaultCaption = true;
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if (rule.selector.classes.length > 0 && rule.matches(selector)) {
        if (rule.props.hasOwnProperty('color')) {
          defaultColor = false;
        }
        if (rule.props.hasOwnProperty('caption')) {
          defaultCaption = false;
        }
      }
    }
    const minimalSelector = new Selector(
      selector.tag,
      selector.classes.sort().slice(0, 1),
    );
    if (defaultColor) {
      const calcColor = (label: Selector): DefaultColorType => {
        const { backgroundColor, borderColor, textColor } =
          calculateDefaultNodeColors(label.classes[0]);

        return {
          'border-color': borderColor,
          'text-color-internal': textColor,
          color: backgroundColor,
        };
      };

      this.changeForSelector(
        minimalSelector,
        this.useGeneratedDefaultColors
          ? calcColor(minimalSelector)
          : this.findAvailableDefaultColor(this.rules),
      );
    }
    if (defaultCaption) {
      this.changeForSelector(minimalSelector, this.getDefaultNodeCaption(item));
    }
  };

  /**
   * 根据传入的selector 和 prop样式 为this.rules添加新的规则
   * @param selector 选择器
   * @param props 样式
   * @returns stylerRules新的规则
   */
  changeForSelector = (selector: Selector, props: any): StyleRule => {
    let rule = this.findRule(selector, this.rules);
    if (rule == null) {
      rule = new StyleRule(selector, props);
      this.rules.push(rule);
    }
    rule.props = { ...rule.props, ...props };
    return rule;
  };

  /**
   * 删除对应的规则
   * @param rule
   */
  destroyRule = (rule: StyleRule): void => {
    const idx = this.rules.indexOf(rule);
    if (idx != null) {
      this.rules.splice(idx, 1);
    }
  };

  importGrass = (string: string): void => {
    try {
      const rules = this.parse(string);
      this.loadRules(rules);
    } catch (_error) {
      // e = _error
    }
  };

  parse = function (string: string) {
    const chars = string.split('');
    let insideString = false;
    let insideProps = false;
    let keyword = '';
    let props = '';
    const rules: any = {};
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      let skipThis = true;
      switch (c) {
        case '{':
          if (!insideString) {
            insideProps = true;
          } else {
            skipThis = false;
          }
          break;
        case '}':
          if (!insideString) {
            insideProps = false;
            rules[keyword] = props;
            keyword = '';
            props = '';
          } else {
            skipThis = false;
          }
          break;
        case "'":
          // @ts-expect-error ts-migrate(2447) FIXME: The '^=' operator is not allowed for boolean types... Remove this comment to see the full error message
          insideString ^= true;
          break;
        default:
          skipThis = false;
      }
      if (skipThis) {
        continue;
      }
      if (insideProps) {
        props += c;
      } else {
        if (!c.match(/[\s\n]/)) {
          keyword += c;
        }
      }
    }
    for (const k in rules) {
      const v = rules[k];
      rules[k] = {};
      v.split(';').forEach((prop: any) => {
        const [key, val] = prop.split(':');
        if (key && val) {
          rules[k][key.trim()] = val.trim();
        }
      });
    }
    return rules;
  };

  resetToDefault = (): void => {
    this.loadRules();
  };

  toSheet = () => {
    const sheet: any = {};
    this.rules.forEach((rule: StyleRule) => {
      sheet[rule.selector.toString()] = rule.props;
    });
    return sheet;
  };

  toString = (): string => {
    let str = '';
    this.rules.forEach((r: StyleRule) => {
      str += `${r.selector.toString()} {\n`;
      for (const k in r.props) {
        let v = r.props[k];
        if (k === 'caption') {
          v = `'${v}'`;
        }
        str += `  ${k}: ${v};\n`;
      }
      str += '}\n\n';
    });
    return str;
  };

  /**
   * 加载样式 可以外部传入
   * @param data 样式
   */
  loadRules = (data?: any): void => {
    const localData = typeof data === 'object' ? data : DEFAULT_STYLE;
    this.rules = [];
    for (const key in localData) {
      const props = localData[key];
      this.rules.push(new StyleRule(this.parseSelector(key), props));
    }
  };

  defaultSizes = function (): DefaultSizeType[] {
    return DEFAULT_SIZES;
  };

  defaultArrayWidths = function (): DefaultArrayWidthType[] {
    return DEFAULT_ARRAY_WIDTHS;
  };

  defaultColors = function (): DefaultColorType[] {
    return DEFAULT_COLORS;
  };

  interpolate = (str: any, item: any) => {
    let ips = str.replace(/\{([^{}]*)\}/g, (_a: any, b: any) => {
      const r = item.propertyMap[b];
      if (typeof r === 'object') {
        return r.join(', ');
      }
      if (typeof r === 'string' || typeof r === 'number') {
        return r;
      }
      return '';
    });
    if (ips.length < 1 && str === '{type}' && item.isRelationship) {
      ips = '<type>';
    }
    if (ips.length < 1 && str === '{id}' && item.isNode) {
      ips = '<id>';
    }
    return ips.replace(/^<(id|type)>$/, (_a: any, b: any) => {
      const r = item[b];
      if (typeof r === 'string' || typeof r === 'number') {
        return r;
      }
      return '';
    });
  };

  /**
   * 传入node为节点 返回对应的样式
   * @param node 节点
   * @returns 节点的样式信息
   */
  forNode = (node: any = {}): StyleElement => {
    const selector = this.nodeSelector(node);
    if ((node.labels != null ? node.labels.length : 0) > 0) {
      this.setDefaultNodeStyle(selector, node);
    }
    return this.calculateStyle(selector);
  };

  /**
   * 传入节点 返回对应的样式
   * @param rel
   * @returns
   */
  forRelationship = (rel: any): StyleElement => {
    const selector = this.relationshipSelector(rel);
    return this.calculateStyle(selector);
  };
}
