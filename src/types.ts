import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';

export type BasicNode = {
  id: string;
  labels: string[];
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export type BasicRelationship = {
  id: string;
  startNodeId: string;
  endNodeId: string;
  type: string;
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export type BasicNodesAndRels = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
};

export type DeduplicatedBasicNodesAndRels = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
  limitHit?: boolean;
};

export type VizItemProperty = { key: string; value: string; type: string };

export type VizItem =
  | NodeItem
  | ContextMenuItem
  | RelationshipItem
  | CanvasItem
  | StatusItem;

export type NodeItem = {
  type: 'node';
  item: Pick<NodeModel, 'id' | 'labels' | 'propertyList'>;
};

type ContextMenuItem = {
  type: 'context-menu-item';
  item: {
    label: string;
    content: string;
    selection: string;
  };
};

type StatusItem = {
  type: 'status-item';
  item: string;
};

export type RelationshipItem = {
  type: 'relationship';
  item: Pick<RelationshipModel, 'id' | 'type' | 'propertyList'>;
};

type CanvasItem = {
  type: 'canvas';
  item: {
    nodeCount: number;
    relationshipCount: number;
  };
};

export type ZoomLimitsReached = {
  zoomInLimitReached: boolean;
  zoomOutLimitReached: boolean;
};

export enum ZoomType {
  IN = 'in',
  OUT = 'out',
  FIT = 'fit',
}

export type GetNodeNeighboursFn = (
  node: BasicNode | NodeModel,
  currentNeighbourIds: string[],
  callback: (data: BasicNodesAndRels) => void,
) => void;

export type LayoutType = 'force' | 'cricular' | 'cascade';

export type PointTuple = [number, number];

export type IndexMap = {
  [key: string]: number;
};

export type Degree = {
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
  onLayoutEnd?: () => void;
}
