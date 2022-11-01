import { Simulation } from 'd3-force';
import { GraphModel } from '../render/Graph';
import { NodeModel } from '../render/Node';
import { RelationshipModel } from '../render/Relationship';
export declare class ForceSimulation {
  simulation: Simulation<NodeModel, RelationshipModel>;
  simulationTimeout: null | number;
  constructor(render: () => void);
  updateNodes(graph: GraphModel): void;
  updateRelationships(graph: GraphModel): void;
  precomputeAndStart(onEnd?: () => void): void;
  restart(): void;
}
