import { GraphModel } from './Graph';
import { NodeModel } from './Node';
import { RelationshipModel } from './Relationship';
import { BasicNode, BasicRelationship } from '../types';
export declare function createGraph(nodes: BasicNode[], relationships: BasicRelationship[]): GraphModel;
export declare function mapNodes(nodes: BasicNode[]): NodeModel[];
export declare function mapRelationships(relationships: BasicRelationship[], graph: GraphModel): RelationshipModel[];
