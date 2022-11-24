import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
export declare type BasicNode = {
    id: string;
    labels: string[];
    properties: Record<string, string>;
    propertyTypes: Record<string, string>;
};
export declare type BasicRelationship = {
    id: string;
    startNodeId: string;
    endNodeId: string;
    type: string;
    properties: Record<string, string>;
    propertyTypes: Record<string, string>;
};
export declare type BasicNodesAndRels = {
    nodes: BasicNode[];
    relationships: BasicRelationship[];
};
export declare type DeduplicatedBasicNodesAndRels = {
    nodes: BasicNode[];
    relationships: BasicRelationship[];
    limitHit?: boolean;
};
export declare type VizItemProperty = {
    key: string;
    value: string;
    type: string;
};
export declare type VizItem = NodeItem | ContextMenuItem | RelationshipItem | CanvasItem | StatusItem;
export declare type NodeItem = {
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
export declare type RelationshipItem = {
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
export declare type ZoomLimitsReached = {
    zoomInLimitReached: boolean;
    zoomOutLimitReached: boolean;
};
export declare enum ZoomType {
    IN = "in",
    OUT = "out",
    FIT = "fit"
}
export declare type GetNodeNeighboursFn = (node: BasicNode | NodeModel, currentNeighbourIds: string[], callback: (data: BasicNodesAndRels) => void) => void;
export declare type LayoutType = 'force' | 'circular' | 'grid';
export declare type PointTuple = [number, number];
export declare type IndexMap = {
    [key: string]: number;
};
export declare type Degree = {
    in: number;
    out: number;
    all: number;
};
export interface CircularLayoutOptions {
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
export interface GridLayoutOptions {
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
export {};
