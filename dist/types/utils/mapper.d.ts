import { GraphModel } from '../models/Graph';
import { NodeModel } from '../models/Node';
import { RelationshipModel } from '../models/Relationship';
import { BasicNode, BasicRelationship } from '../types';
export declare function createGraph(nodes: BasicNode[], relationships: BasicRelationship[]): GraphModel;
export declare function mapNodes(nodes: BasicNode[]): NodeModel[];
export declare function mapRelationships(relationships: BasicRelationship[], graph: GraphModel): RelationshipModel[];
export declare type GraphStatsLabels = Record<string, {
    count: number;
    properties: Record<string, string>;
}>;
export declare type GraphStatsRelationshipTypes = Record<string, {
    count: number;
    properties: Record<string, string>;
}>;
export declare type GraphStats = {
    labels?: GraphStatsLabels;
    relTypes?: GraphStatsRelationshipTypes;
};
export declare function getGraphStats(graph: GraphModel): GraphStats;
