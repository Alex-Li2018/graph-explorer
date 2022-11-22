import { PairwiseArcsRelationshipRouting } from './PairwiseArcsRelationshipRouting';
import { GraphModel } from '../models/Graph';
import { GraphStyleModel } from '../models/GraphStyle';
import { NodeModel } from '../models/Node';
import { RelationshipModel } from '../models/Relationship';
export declare class GraphGeometryModel {
    relationshipRouting: PairwiseArcsRelationshipRouting;
    style: GraphStyleModel;
    canvas: HTMLCanvasElement;
    constructor(style: GraphStyleModel);
    formatNodeCaptions(nodes: NodeModel[]): void;
    formatRelationshipCaptions(relationships: RelationshipModel[]): void;
    setNodeRadii(nodes: NodeModel[]): void;
    onGraphChange(graph: GraphModel, options?: {
        updateNodes: boolean;
        updateRelationships: boolean;
    }): void;
    onTick(graph: GraphModel): void;
}
