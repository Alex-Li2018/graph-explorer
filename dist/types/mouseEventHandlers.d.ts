import { Simulation } from 'd3-force';
import { BaseType, Selection } from 'd3-selection';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
export declare const nodeEventHandlers: (selection: Selection<SVGGElement, NodeModel, BaseType, unknown>, trigger: (event: string, node: NodeModel) => void, simulation: Simulation<NodeModel, RelationshipModel>) => Selection<SVGGElement, NodeModel, BaseType, unknown>;
export declare const relationshipEventHandlers: (selection: Selection<SVGGElement, RelationshipModel, BaseType, unknown>, trigger: (event: string, rel: RelationshipModel) => void) => Selection<SVGGElement, RelationshipModel, BaseType, unknown>;