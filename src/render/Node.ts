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
  expanded: boolean;
  minified: boolean;
  contextMenu?: { menuSelection: string; menuContent: string; label: string };

  x: number;
  y: number;
  fx: number | null = null;
  fy: number | null = null;
  hoverFixed: boolean;
  initialPositionCalculated: boolean;

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
    this.expanded = false;
    this.minified = false;
    this.x = 0;
    this.y = 0;
    this.hoverFixed = false;
    this.initialPositionCalculated = false;
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
