import { VizItemProperty } from '../types';
import { GraphModel } from './Graph';
declare type NodeProperties = {
    [key: string]: string;
};
export declare type NodeCaptionLine = {
    node: NodeModel;
    text: string;
    baseline: number;
    remainingWidth: number;
};
export declare class NodeModel {
    id: string;
    labels: string[];
    propertyList: VizItemProperty[];
    propertyMap: NodeProperties;
    isNode: boolean;
    isRelationship: boolean;
    radius: number;
    caption: NodeCaptionLine[];
    selected: boolean;
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
    class: any[];
    constructor(id: string, labels: string[], properties: NodeProperties, propertyTypes: Record<string, string>);
    toJSON(): NodeProperties;
    relationshipCount(graph: GraphModel): number;
    hasRelationships(graph: GraphModel): boolean;
}
export {};
