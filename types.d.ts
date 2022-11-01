import { NodeModel } from './render/Node';
import { RelationshipModel } from './render/Relationship';
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
export declare type VizItem =
  | NodeItem
  | ContextMenuItem
  | RelationshipItem
  | CanvasItem
  | StatusItem;
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
  IN = 'in',
  OUT = 'out',
  FIT = 'fit',
}
export declare type GetNodeNeighboursFn = (
  node: BasicNode | NodeModel,
  currentNeighbourIds: string[],
  callback: (data: BasicNodesAndRels) => void,
) => void;
export {};
