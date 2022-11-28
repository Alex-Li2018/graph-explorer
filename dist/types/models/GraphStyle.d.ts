import { NodeModel } from './Node';
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
    /**
     * 从当前样式规则里找到对应的选择集样式
     * @param rules
     * @returns
     */
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
declare type DefaultColorType = {
    color: string;
    'border-color': string;
    'text-color-internal': string;
};
export declare class GraphStyleModel {
    rules: StyleRule[];
    constructor();
    parseSelector: (key: string) => Selector;
    /**
     *
     * @param node 节点
     * @returns 节点的选择{ tag: node, class: [lables]}
     */
    nodeSelector: (node?: {
        labels: null | string[];
        class: string[];
    }) => Selector;
    /**
     * 关系选择其
     * @param rel 关系
     * @returns
     */
    relationshipSelector: (rel?: {
        type: null | string;
    }) => Selector;
    /**
     * 根据selector寻找对应的规则 没有返回undefined
     * @param selector
     * @param rules
     * @returns
     */
    findRule: (selector: Selector, rules: StyleRule[]) => StyleRule | undefined;
    /**
     * 根据规则找到可以使用的颜色
     * @param rules
     * @returns
     */
    findAvailableDefaultColor: (rules: StyleRule[]) => DefaultColorType;
    /**
     * 设置默认的节点名称
     * @param item
     * @returns
     */
    getDefaultNodeCaption: (item: any) => {
        caption: string;
    } | {
        defaultCaption: string;
    };
    /**
     * 计算对应的样式
     * @param selector 选择器
     * @returns
     */
    calculateStyle: (selector: Selector) => StyleElement;
    /**
     * 设置节点默认样式
     * @param selector 选择器
     * @param item 节点
     */
    setDefaultNodeStyle: (selector: Selector, item: any) => void;
    /**
     * 根据传入的selector 和 prop样式 为this.rules添加新的规则
     * @param selector 选择器
     * @param props 样式
     * @returns stylerRules新的规则
     */
    changeForSelector: (selector: Selector, props: any) => StyleRule;
    changeForSelectorWithNodeClass: (node: NodeModel, props: any) => StyleRule;
    /**
     * 删除对应的规则
     * @param rule
     */
    destroyRule: (rule: StyleRule) => void;
    importGrass: (string: string) => void;
    parse: (string: string) => any;
    resetToDefault: () => void;
    toSheet: () => any;
    toString: () => string;
    /**
     * 加载样式 可以外部传入
     * @param data 样式
     */
    loadRules: (data?: any) => void;
    defaultColors: () => DefaultColorType[];
    interpolate: (str: any, item: any) => any;
    /**
     * 传入node为节点 返回对应的样式
     * @param node 节点
     * @returns 节点的样式信息
     */
    forNode: (node?: any) => StyleElement;
    /**
     * 传入节点 返回对应的样式
     * @param rel
     * @returns
     */
    forRelationship: (rel: any) => StyleElement;
}
export {};
