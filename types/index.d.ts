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
declare type ZoomLimitsReached = {
    zoomInLimitReached: boolean;
    zoomOutLimitReached: boolean;
};
declare enum ZoomType {
    IN = "in",
    OUT = "out",
    FIT = "fit"
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
}

declare type MeasureSizeFn = () => {
    width: number;
    height: number;
};
declare class GraphVisualization {
    private measureSize;
    graphData: BasicNodesAndRels;
    isFullscreen: boolean;
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
    private graph;
    style: GraphStyleModel;
    forceSimulation: ForceSimulation;
    private draw;
    private isZoomClick;
    constructor(element: SVGElement, measureSize: MeasureSizeFn, onZoomEvent: (limitsReached: ZoomLimitsReached) => void, onDisplayZoomWheelInfoMessage: () => void, graphData: BasicNodesAndRels, isFullscreen: boolean, wheelZoomRequiresModKey?: boolean | undefined, initialZoomToFit?: boolean | undefined);
    private render;
    private updateNodes;
    private updateRelationships;
    zoomByType: (zoomType: ZoomType) => void;
    private zoomToFitViewport;
    private getZoomScaleFactorToFitWholeGraph;
    private adjustZoomMinScaleExtentToFitGraph;
    on: (event: string, callback: (...args: any[]) => void) => this;
    trigger: (event: string, ...args: any[]) => void;
    init(): void;
    setInitialZoom(): void;
    precomputeAndStart(): void;
    update(options: {
        updateNodes: boolean;
        updateRelationships: boolean;
        restartSimulation?: boolean;
    }): void;
    boundingBox(): DOMRect | undefined;
    resize(isFullscreen: boolean, wheelZoomRequiresModKey: boolean): void;
}

export { GraphVisualization as default };
