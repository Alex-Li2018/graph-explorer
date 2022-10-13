import { NodeModel } from './Node';
import { RelationshipModel } from './Relationship';
declare type NodeMap = Record<string, string[]>;
export declare class GraphModel {
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
export declare class NodePair {
    nodeA: NodeModel;
    nodeB: NodeModel;
    relationships: RelationshipModel[];
    constructor(node1: NodeModel, node2: NodeModel);
    isLoop(): boolean;
    toString(): string;
}
export {};
