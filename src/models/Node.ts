import { VizItemProperty } from '../types';
import { GraphModel } from './Graph';

type NodeProperties = { [key: string]: string };
export type NodeCaptionLine = {
  node: NodeModel;
  text: string;
  baseline: number;
  remainingWidth: number;
};

export class NodeModel {
  id: string;
  labels: string[];
  propertyList: VizItemProperty[];
  propertyMap: NodeProperties;
  isNode = true;
  isRelationship = false;

  // Visualisation properties
  radius: number;
  caption: NodeCaptionLine[];
  selected: boolean;
  contextMenu?: { menuSelection: string; menuContent: string; label: string };

  x: number;
  y: number;
  fx: number | null = null;
  fy: number | null = null;
  // 鼠标移入固定节点 移出可以移动节点
  hoverFixed: boolean;
  initialPositionCalculated: boolean;
  // 节点的度
  degree: number;
  // 样式信息 可以修改节点的颜色 大小
  class: any[];

  constructor(
    id: string,
    labels: string[],
    properties: NodeProperties,
    propertyTypes: Record<string, string>,
  ) {
    this.id = id;
    this.labels = labels;
    this.propertyMap = properties;
    this.propertyList = Object.keys(properties).map((key: string) => ({
      key,
      type: propertyTypes[key],
      value: properties[key],
    }));

    // Initialise visualisation items
    this.radius = 0;
    this.caption = [];
    this.selected = false;
    this.x = 0;
    this.y = 0;
    this.hoverFixed = false;
    this.initialPositionCalculated = false;
    this.degree = 0;
    this.class = [];
  }

  toJSON(): NodeProperties {
    return this.propertyMap;
  }

  relationshipCount(graph: GraphModel): number {
    return graph
      .relationships()
      .filter((rel) => rel.source === this || rel.target === this).length;
  }

  hasRelationships(graph: GraphModel): boolean {
    return graph
      .relationships()
      .some((rel) => rel.source === this || rel.target === this);
  }
}
