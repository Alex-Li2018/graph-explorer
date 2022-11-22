import { Simulation } from 'd3-force';
import { GraphModel } from '../../models/Graph';
import { NodeModel } from '../../models/Node';
import { RelationshipModel } from '../../models/Relationship';
export declare class ForceSimulation {
    simulation: Simulation<NodeModel, RelationshipModel>;
    simulationTimeout: null | number;
    constructor(render: () => void);
    updateNodes(graph: GraphModel): void;
    updateRelationships(graph: GraphModel): void;
    precomputeAndStart(onEnd?: () => void): void;
    restart(): void;
    stop(): void;
}
