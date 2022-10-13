import { PairwiseArcsRelationshipRouting } from './PairwiseArcsRelationshipRouting';
import { GraphModel } from './Graph';
import { GraphStyleModel } from './GraphStyle';
import { NodeModel } from './Node';
import { RelationshipModel } from './Relationship';
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
