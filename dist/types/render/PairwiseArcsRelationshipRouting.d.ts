import { GraphModel, NodePair } from '../models/Graph';
import { GraphStyleModel } from '../models/GraphStyle';
import { RelationshipModel } from '../models/Relationship';
export declare class PairwiseArcsRelationshipRouting {
    style: GraphStyleModel;
    canvas: HTMLCanvasElement;
    constructor(style: GraphStyleModel);
    measureRelationshipCaption(relationship: RelationshipModel, caption: string): number;
    captionFitsInsideArrowShaftWidth(relationship: RelationshipModel): boolean;
    measureRelationshipCaptions(relationships: RelationshipModel[]): void;
    shortenCaption(relationship: RelationshipModel, caption: string, targetWidth: number): [string, number];
    computeGeometryForNonLoopArrows(nodePairs: NodePair[]): void;
    distributeAnglesForLoopArrows(nodePairs: NodePair[], relationships: RelationshipModel[]): void;
    layoutRelationships(graph: GraphModel): void;
}
