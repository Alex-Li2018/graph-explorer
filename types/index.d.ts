import { Simulation } from 'd3-force';

declare type Point$1 = {
    x: number;
    y: number;
};
declare class ArcArrow {
    deflection: number;
    midShaftPoint: Point$1;
    outline: (shortCaptionLength: number) => string;
    overlay: (minWidth: number) => string;
    shaftLength: number;
    constructor(startRadius: number, endRadius: number, endCentre: number, deflection: number, arrowWidth: number, headWidth: number, headLength: number, captionLayout: RelationshipCaptionLayout);
}

declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    toString(): string;
}
declare class LoopArrow {
    midShaftPoint: Point;
    outline: () => string;
    overlay: (minWidth: number) => string;
    shaftLength: number;
    constructor(nodeRadius: number, straightLength: number, spreadDegrees: number, shaftWidth: number, headWidth: number, headLength: number, captionHeight: number);
}

declare class StraightArrow {
    length: number;
    midShaftPoint: {
        x: number;
        y: number;
    };
    outline: (shortCaptionLength: number) => string;
    overlay: (minWidth: number) => string;
    shaftLength: number;
    deflection: number;
    constructor(startRadius: number, endRadius: number, centreDistance: number, shaftWidth: number, headWidth: number, headHeight: number, captionLayout: RelationshipCaptionLayout);
}

declare type RelationshipCaptionLayout = 'internal' | 'external';
declare class RelationshipModel {
    id: string;
    propertyList: VizItemProperty[];
    propertyMap: Record<string, string>;
    source: NodeModel;
    target: NodeModel;
    type: string;
    isNode: boolean;
    isRelationship: boolean;
    naturalAngle: number;
    caption: string;
    captionLength: number;
    captionHeight: number;
    captionLayout: RelationshipCaptionLayout;
    shortCaption: string | undefined;
    shortCaptionLength: number | undefined;
    selected: boolean;
    centreDistance: number;
    internal: boolean | undefined;
    arrow: ArcArrow | LoopArrow | StraightArrow | undefined;
    constructor(id: string, source: NodeModel, target: NodeModel, type: string, properties: Record<string, string>, propertyTypes: Record<string, string>);
    toJSON(): Record<string, string>;
    isLoop(): boolean;
}

declare type NodeMap = Record<string, string[]>;
declare class GraphModel {
    _nodes: NodeModel[];
    _relationships: RelationshipModel[];
    expandedNodeMap: NodeMap;
    nodeMap: Record<string, NodeModel>;
    relationshipMap: Record<string, RelationshipModel>;
    constructor();
    nodes(): NodeModel[];
    relationships(): RelationshipModel[];
    groupedRelationships(): NodePair[];
    addNodes(nodes: NodeModel[]): void;
    addExpandedNodes: (node: NodeModel, nodes: NodeModel[]) => void;
    removeNode(node: NodeModel): void;
    collapseNode: (node: NodeModel) => void;
    updateNode(node: NodeModel): void;
    removeConnectedRelationships(node: NodeModel): void;
    addRelationships(relationships: RelationshipModel[]): void;
    addInternalRelationships(relationships: RelationshipModel[]): void;
    pruneInternalRelationships(): void;
    findNode(id: string): NodeModel;
    findNodeNeighbourIds(id: string): string[];
    findRelationship(id: string): RelationshipModel | undefined;
    findAllRelationshipToNode(node: NodeModel): RelationshipModel[];
    resetGraph(): void;
}
declare class NodePair {
    nodeA: NodeModel;
    nodeB: NodeModel;
    relationships: RelationshipModel[];
    constructor(node1: NodeModel, node2: NodeModel);
    isLoop(): boolean;
    toString(): string;
}

declare type NodeProperties = {
    [key: string]: string;
};
declare type NodeCaptionLine = {
    node: NodeModel;
    text: string;
    baseline: number;
    remainingWidth: number;
};
declare class NodeModel {
    id: string;
    labels: string[];
    propertyList: VizItemProperty[];
    propertyMap: NodeProperties;
    isNode: boolean;
    isRelationship: boolean;
    radius: number;
    caption: NodeCaptionLine[];
    selected: boolean;
    expanded: boolean;
    minified: boolean;
    contextMenu?: {
        menuSelection: string;
        menuContent: string;
        label: string;
    };
    x: number;
    y: number;
    fx: number | null;
    fy: number | null;
    hoverFixed: boolean;
    initialPositionCalculated: boolean;
    degree: number;
    constructor(id: string, labels: string[], properties: NodeProperties, propertyTypes: Record<string, string>);
    toJSON(): NodeProperties;
    relationshipCount(graph: GraphModel): number;
    hasRelationships(graph: GraphModel): boolean;
}

declare type BasicNode = {
    id: string;
    labels: string[];
    properties: Record<string, string>;
    propertyTypes: Record<string, string>;
};
declare type BasicRelationship = {
    id: string;
    startNodeId: string;
    endNodeId: string;
    type: string;
    properties: Record<string, string>;
    propertyTypes: Record<string, string>;
};
declare type BasicNodesAndRels = {
    nodes: BasicNode[];
    relationships: BasicRelationship[];
};
declare type VizItemProperty = {
    key: string;
    value: string;
    type: string;
};
declare type VizItem = NodeItem | ContextMenuItem | RelationshipItem | CanvasItem | StatusItem;
declare type NodeItem = {
    type: 'node';
    item: Pick<NodeModel, 'id' | 'labels' | 'propertyList'>;
};
declare type ContextMenuItem = {
    type: 'context-menu-item';
    item: {
        label: string;
        content: string;
        selection: string;
    };
};
declare type StatusItem = {
    type: 'status-item';
    item: string;
};
declare type RelationshipItem = {
    type: 'relationship';
    item: Pick<RelationshipModel, 'id' | 'type' | 'propertyList'>;
};
declare type CanvasItem = {
    type: 'canvas';
    item: {
        nodeCount: number;
        relationshipCount: number;
    };
};
declare type ZoomLimitsReached = {
    zoomInLimitReached: boolean;
    zoomOutLimitReached: boolean;
};
declare enum ZoomType {
    IN = "in",
    OUT = "out",
    FIT = "fit"
}
declare type GetNodeNeighboursFn = (node: BasicNode | NodeModel, currentNeighbourIds: string[], callback: (data: BasicNodesAndRels) => void) => void;
declare type LayoutType = 'force' | 'circular' | 'grid';
declare type PointTuple = [number, number];
interface CircularLayoutOptions {
    type: 'circular';
    center?: PointTuple;
    width?: number;
    height?: number;
    radius?: number | null;
    startRadius?: number | null;
    endRadius?: number | null;
    clockwise?: boolean;
    divisions?: number;
    ordering?: 'topology' | 'topology-directed' | 'degree' | null;
    angleRatio?: number;
    workerEnabled?: boolean;
    startAngle?: number;
    endAngle?: number;
    nodes: NodeModel[];
    edges: RelationshipModel[];
    nodeSpacing?: ((d?: unknown) => number) | number | undefined;
    nodeSize?: number | undefined;
    onLayoutEnd?: () => void;
}
interface GridLayoutOptions {
    type: 'grid';
    nodes: NodeModel[];
    edges: RelationshipModel[];
    width?: number;
    height?: number;
    begin?: PointTuple;
    preventOverlap?: boolean;
    nodeSize?: number | number[];
    preventOverlapPadding?: number;
    condense?: boolean;
    rows?: number;
    cols?: number;
    sortBy?: string;
    workerEnabled?: boolean;
    position?: ((node: NodeModel) => {
        row?: number;
        col?: number;
    }) | undefined;
    onLayoutEnd?: () => void;
}

declare class Selector {
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
declare class GraphStyleModel {
    private useGeneratedDefaultColors;
    rules: StyleRule[];
    constructor(useGeneratedDefaultColors?: boolean);
    parseSelector: (key: string) => Selector;
    nodeSelector: (node?: {
        labels: null | string[];
    }) => Selector;
    relationshipSelector: (rel?: {
        type: null | string;
    }) => Selector;
    findRule: (selector: Selector, rules: StyleRule[]) => StyleRule | undefined;
    findAvailableDefaultColor: (rules: StyleRule[]) => DefaultColorType;
    getDefaultNodeCaption: (item: any) => {
        caption: string;
    } | {
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

declare class ForceSimulation {
    simulation: Simulation<NodeModel, RelationshipModel>;
    simulationTimeout: null | number;
    constructor(render: () => void);
    updateNodes(graph: GraphModel): void;
    updateRelationships(graph: GraphModel): void;
    precomputeAndStart(onEnd?: () => void): void;
    restart(): void;
    stop(): void;
}

declare type GraphStatsLabels = Record<string, {
    count: number;
    properties: Record<string, string>;
}>;
declare type GraphStatsRelationshipTypes = Record<string, {
    count: number;
    properties: Record<string, string>;
}>;
declare type GraphStats = {
    labels?: GraphStatsLabels;
    relTypes?: GraphStatsRelationshipTypes;
};

declare type GraphInteraction = 'NODE_EXPAND' | 'NODE_UNPINNED' | 'NODE_DISMISSED';
declare type GraphInteractionCallBack = (event: GraphInteraction, properties?: Record<string, unknown>) => void;
declare class GraphEventHandlerModel {
    getNodeNeighbours: GetNodeNeighboursFn;
    graph: GraphModel;
    visualization: GraphVisualization;
    onGraphModelChange: (stats: GraphStats) => void;
    onItemMouseOver: (item: VizItem) => void;
    onItemSelected: (item: VizItem) => void;
    onGraphInteraction: GraphInteractionCallBack;
    selectedItem: NodeModel | RelationshipModel | null;
    constructor(graph: GraphModel, visualization: GraphVisualization, getNodeNeighbours: GetNodeNeighboursFn, onItemMouseOver: (item: VizItem) => void, onItemSelected: (item: VizItem) => void, onGraphModelChange: (stats: GraphStats) => void, onGraphInteraction?: (event: GraphInteraction) => void);
    graphModelChanged(): void;
    selectItem(item: NodeModel | RelationshipModel): void;
    deselectItem(): void;
    nodeClose(d: NodeModel): void;
    nodeClicked(node: NodeModel): void;
    nodeUnlock(d: NodeModel): void;
    nodeDblClicked(d: NodeModel): void;
    nodeCollapse(d: NodeModel): void;
    onNodeMouseOver(node: NodeModel): void;
    onMenuMouseOver(itemWithMenu: NodeModel): void;
    onRelationshipMouseOver(relationship: RelationshipModel): void;
    onRelationshipClicked(relationship: RelationshipModel): void;
    onCanvasClicked(): void;
    onItemMouseOut(): void;
    bindEventHandlers(): void;
}

declare class CircularLayout {
    /** 布局中心 */
    center: PointTuple | undefined;
    /** 固定半径，若设置了 radius，则 startRadius 与 endRadius 不起效 */
    radius: number | null;
    /** 节点间距，若设置 nodeSpacing，则 radius 将被自动计算，即设置 radius 不生效 */
    nodeSpacing: ((d?: unknown) => number) | number | undefined;
    /** 节点大小，配合 nodeSpacing，一起用于计算 radius。若不配置，节点大小默认为 30 */
    nodeSize: number | undefined;
    /** 起始半径 */
    startRadius: number | null;
    /** 终止半径 */
    endRadius: number | null;
    /** 起始角度 */
    startAngle: number;
    /** 终止角度 */
    endAngle: number;
    /** 是否顺时针 */
    clockwise: boolean;
    /** 节点在环上分成段数（几个段将均匀分布），在 endRadius - startRadius != 0 时生效 */
    divisions: number;
    /** 节点在环上排序的依据，可选: 'topology', 'degree', 'null' */
    ordering: 'topology' | 'topology-directed' | 'degree' | null;
    /** how many 2*pi from first to last nodes */
    angleRatio: number;
    nodes: NodeModel[];
    edges: RelationshipModel[];
    private degrees;
    width: number;
    height: number;
    onLayoutEnd: (() => void) | undefined;
    constructor(options?: CircularLayoutOptions);
    updateConfig(cfg: any): void;
    getDefaultConfig(): {
        radius: null;
        startRadius: null;
        endRadius: null;
        startAngle: number;
        endAngle: number;
        clockwise: boolean;
        divisions: number;
        ordering: null;
        angleRatio: number;
    };
    /**
     * 执行布局
     */
    execute(): {
        nodes: NodeModel[];
        edges: RelationshipModel[];
    } | undefined;
    /**
     * 根据节点的拓扑结构排序
     * @return {array} orderedNodes 排序后的结果
     */
    /**
     * 根据节点度数大小排序
     * @return {array} orderedNodes 排序后的结果
     */
    degreeOrdering(): NodeModel[];
    getType(): string;
}

/**
 * this algorithm refers to <cytoscape.js> - https://github.com/cytoscape/cytoscape.js/
 */

interface Size {
    width: number;
    height: number;
}
interface OutNode extends NodeModel {
    x: number;
    y: number;
    fx: number;
    fy: number;
    comboId?: string;
    layer?: number;
    _order?: number;
    layout?: boolean;
    size?: number | number[] | undefined;
}
declare type INode = OutNode & {
    degree: number;
    size: number | PointTuple | Size;
};
/**
 * 网格布局
 */
declare class GridLayout {
    /** 布局起始点 */
    begin: PointTuple;
    /** prevents node overlap(重叠), may overflow boundingBox if not enough space */
    preventOverlap: boolean;
    /** extra spacing around nodes when preventOverlap: true */
    preventOverlapPadding: number;
    /** uses all available space on false, uses minimal space on true */
    condense: boolean;
    /** force num of rows in the grid */
    rows: number | undefined;
    /** force num of columns in the grid */
    cols: number | undefined;
    /** the spacing between two nodes */
    nodeSpacing: ((d?: unknown) => number) | number | undefined;
    /** returns { row, col } for element */
    position: ((node: INode) => {
        row?: number;
        col?: number;
    }) | undefined;
    /** a sorting function to order the nodes; e.g. function(a, b){ return a.datapublic ('weight') - b.data('weight') } */
    sortBy: string;
    nodeSize: number | number[] | {
        width: number;
        height: number;
    } | undefined;
    nodes: INode[];
    edges: RelationshipModel[];
    width: number;
    height: number;
    private cells;
    private row;
    private col;
    private splits;
    private columns;
    private cellWidth;
    private cellHeight;
    private cellUsed;
    private id2manPos;
    /** 迭代结束的回调函数 */
    onLayoutEnd: () => void;
    constructor(options?: GridLayoutOptions);
    updateConfig(cfg: any): void;
    getDefaultCfg(): {
        begin: number[];
        preventOverlap: boolean;
        preventOverlapPadding: number;
        condense: boolean;
        rows: undefined;
        cols: undefined;
        position: undefined;
        sortBy: string;
        nodeSize: number;
    };
    /**
     * 执行布局
     */
    execute(): {
        nodes: INode[];
        edges: RelationshipModel[];
    };
    private small;
    private large;
    private used;
    private use;
    private moveToNextCell;
    private getPos;
    getType(): string;
}

declare type DataUrlType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';
interface DownloadImageOptions {
    scale: number;
    format: DataUrlType;
    quality: number;
    download: boolean;
    cssinline: number;
    ignore?: boolean | null;
    background?: string | null;
}

declare type MeasureSizeFn = () => {
    width: number;
    height: number;
};
declare type ZoomEvent = (limitsReached: ZoomLimitsReached) => void;
declare type VoidEvent = () => void;
declare class GraphVisualization {
    private measureSize;
    graphData: BasicNodesAndRels;
    isFullscreen: boolean;
    layout: LayoutType;
    wheelZoomRequiresModKey?: boolean | undefined;
    private initialZoomToFit?;
    private readonly root;
    private baseGroup;
    private rect;
    private container;
    private geometry;
    private zoomBehavior;
    private zoomMinScaleExtent;
    private callbacks;
    graph: GraphModel;
    style: GraphStyleModel;
    forceSimulation: ForceSimulation;
    circularlayout: CircularLayout;
    gridLayout: GridLayout;
    private draw;
    private isZoomClick;
    constructor(element: SVGElement, measureSize: MeasureSizeFn, graphData: BasicNodesAndRels, isFullscreen: boolean, layout: LayoutType, onZoomEvent?: ZoomEvent, onDisplayZoomWheelInfoMessage?: VoidEvent, wheelZoomRequiresModKey?: boolean | undefined, initialZoomToFit?: boolean | undefined);
    private initConfig;
    private initGraphData;
    private initStyle;
    private innitContainer;
    private containerZoomEvent;
    initNodeAndRelationship(): void;
    private initLayoutController;
    update(options: {
        updateNodes: boolean;
        updateRelationships: boolean;
        restartSimulation?: boolean;
    }): void;
    private updateNodes;
    private updateRelationships;
    private render;
    zoomByType: (zoomType: ZoomType) => void;
    private zoomToFitViewport;
    private getZoomScaleFactorToFitWholeGraph;
    private adjustZoomMinScaleExtentToFitGraph;
    setInitialZoom(): void;
    precomputeAndStart(): void;
    resize(isFullscreen: boolean, wheelZoomRequiresModKey: boolean | undefined): void;
    boundingBox(): DOMRect | undefined;
    initEventHandler(getNodeNeighbours: GetNodeNeighboursFn, onItemMouseOver: (item: VizItem) => void, onItemSelect: (item: VizItem) => void, onGraphModelChange: (stats: GraphStats) => void, onGraphInteraction: (event: GraphInteraction) => void): GraphEventHandlerModel;
    on: (event: string, callback: (...args: any[]) => void) => this;
    trigger: (event: string, ...args: any[]) => void;
    cricularLayoutHandler(): void;
    forceSimulationHandler(): void;
    gridLayoutHandler(): void;
    downloadImage(dom: Element, fileName?: string, options?: DownloadImageOptions): void;
    destroy(): void;
}

export { GraphVisualization as default };
