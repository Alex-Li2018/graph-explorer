import { GraphModel } from './models/Graph';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
import { GetNodeNeighboursFn, VizItem } from './types';
import { GraphStats } from './utils/mapper';
import GraphVisualization from './index';
export declare type GraphInteraction = 'NODE_EXPAND' | 'NODE_UNPINNED' | 'NODE_DISMISSED';
export declare type GraphInteractionCallBack = (event: GraphInteraction, properties?: Record<string, unknown>) => void;
export declare class GraphEventHandlerModel {
    getNodeNeighbours: GetNodeNeighboursFn;
    graph: GraphModel;
    visualization: GraphVisualization;
    onGraphModelChange: (stats: GraphStats) => void;
    onItemMouseOver: (item: VizItem) => void;
    onItemSelected: (item: VizItem) => void;
    onGraphInteraction: GraphInteractionCallBack;
    selectedItem: NodeModel | RelationshipModel | null;
    constructor(graph: GraphModel, visualization: GraphVisualization, getNodeNeighbours: GetNodeNeighboursFn, onItemMouseOver: (item: VizItem) => void, onItemSelected: (item: VizItem) => void, onGraphModelChange: (stats: GraphStats) => void, onGraphInteraction?: (event: GraphInteraction) => void);
    graphModelChanged(): void;
    selectItem(item: NodeModel | RelationshipModel): void;
    deselectItem(): void;
    nodeClose(d: NodeModel): void;
    nodeClicked(node: NodeModel): void;
    nodeUnlock(d: NodeModel): void;
    nodeDblClicked(d: NodeModel): void;
    nodeCollapse(d: NodeModel): void;
    onNodeMouseOver(node: NodeModel): void;
    onMenuMouseOver(itemWithMenu: NodeModel): void;
    onRelationshipMouseOver(relationship: RelationshipModel): void;
    onRelationshipClicked(relationship: RelationshipModel): void;
    onCanvasClicked(): void;
    onItemMouseOut(): void;
    bindEventHandlers(): void;
}