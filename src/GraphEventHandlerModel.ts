import { GraphModel } from './models/Graph';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
import { GetNodeNeighboursFn, VizItem } from './types';
import { GraphStats, getGraphStats } from './utils/mapper';
import GraphVisualization from './GraphVisualization';

export type GraphInteraction =
  | 'NODE_EXPAND'
  | 'NODE_UNPINNED'
  | 'NODE_DISMISSED';

export class GraphEventHandlerModel {
  getNodeNeighbours: GetNodeNeighboursFn;
  graph: GraphModel;
  visualization: GraphVisualization;
  onGraphModelChange: (stats: GraphStats) => void;
  onItemMouseOver: (item: VizItem, event?: Event) => void;
  onItemSelected: (item: VizItem, event?: Event) => void;
  onGraphInteraction: (item: VizItem, event: Event) => void;

  constructor(
    graph: GraphModel,
    visualization: GraphVisualization,
    getNodeNeighbours: GetNodeNeighboursFn,
    onItemMouseOver: (item: VizItem, event?: Event) => void,
    onItemSelected: (item: VizItem, event?: Event) => void,
    onGraphModelChange: (stats: GraphStats) => void,
    onGraphInteraction: (item: VizItem, event: Event) => void,
  ) {
    this.graph = graph;
    this.visualization = visualization;
    this.getNodeNeighbours = getNodeNeighbours;
    this.onItemMouseOver = onItemMouseOver;
    this.onItemSelected = onItemSelected;
    this.onGraphInteraction = onGraphInteraction;

    this.onGraphModelChange = onGraphModelChange;
  }

  graphModelChanged(): void {
    this.onGraphModelChange(getGraphStats(this.graph));
  }

  selectItem(item: NodeModel | RelationshipModel): void {
    item.selected = true;

    this.visualization.update({
      updateNodes: item.isNode,
      updateRelationships: item.isRelationship,
      restartSimulation: false,
    });
  }

  deselectItem(event?: Event): void {
    this.graph.getSelectedNode() && this.clearAllNodesSelected();

    this.graph.getSelectedRelationship() &&
      this.clearAllRelationshipsSelected();

    this.visualization.update({
      updateNodes: true,
      updateRelationships: true,
      restartSimulation: false,
    });

    this.onItemSelected(
      {
        type: 'canvas',
        item: {
          nodeCount: this.graph.nodes().length,
          relationshipCount: this.graph.relationships().length,
        },
      },
      event,
    );
  }

  nodeClicked(node: NodeModel, event: Event): void {
    if (!node) {
      return;
    }
    node.hoverFixed = false;
    node.fx = node.x;
    node.fy = node.y;

    // 情况所有的选中状态
    this.clearAllNodesSelected();

    this.selectItem(node);
    this.onItemSelected(
      {
        type: 'node',
        item: node,
      },
      event,
    );
  }

  // 节点双击 触发
  nodeDblClicked(d: NodeModel, event: Event): void {
    this.onGraphInteraction(
      {
        type: 'node',
        item: d,
      },
      event,
    );
  }

  onNodeMouseOver(node: NodeModel, event: Event): void {
    if (!node.contextMenu) {
      this.onItemMouseOver(
        {
          type: 'node',
          item: node,
        },
        event,
      );
    }
  }

  onMenuMouseOver(itemWithMenu: NodeModel, event: Event): void {
    if (!itemWithMenu.contextMenu) {
      throw new Error('menuMouseOver triggered without menu');
    }
    this.onItemMouseOver(
      {
        type: 'context-menu-item',
        item: {
          label: itemWithMenu.contextMenu.label,
          content: itemWithMenu.contextMenu.menuContent,
          selection: itemWithMenu.contextMenu.menuSelection,
        },
      },
      event,
    );
  }

  onRelationshipMouseOver(relationship: RelationshipModel, event: Event): void {
    this.onItemMouseOver(
      {
        type: 'relationship',
        item: relationship,
      },
      event,
    );
  }

  onRelationshipClicked(relationship: RelationshipModel, event: Event): void {
    this.clearAllRelationshipsSelected();
    this.selectItem(relationship);
    this.onItemSelected(
      {
        type: 'relationship',
        item: relationship,
      },
      event,
    );
  }

  onCanvasClicked(): void {
    this.deselectItem();
  }

  onItemMouseOut(): void {
    this.onItemMouseOver({
      type: 'canvas',
      item: {
        nodeCount: this.graph.nodes().length,
        relationshipCount: this.graph.relationships().length,
      },
    });
  }

  clearAllNodesSelected() {
    this.graph.nodes().map((item) => (item.selected = false));
  }

  clearAllRelationshipsSelected() {
    this.graph.relationships().map((item) => (item.selected = false));
  }

  bindEventHandlers(): void {
    this.visualization
      .on('nodeMouseOver', this.onNodeMouseOver.bind(this))
      .on('nodeMouseOut', this.onItemMouseOut.bind(this))
      .on('menuMouseOver', this.onMenuMouseOver.bind(this))
      .on('menuMouseOut', this.onItemMouseOut.bind(this))
      .on('relMouseOver', this.onRelationshipMouseOver.bind(this))
      .on('relMouseOut', this.onItemMouseOut.bind(this))
      .on('relationshipClicked', this.onRelationshipClicked.bind(this))
      .on('canvasClicked', this.onCanvasClicked.bind(this))
      .on('nodeClicked', this.nodeClicked.bind(this))
      .on('nodeDblClicked', this.nodeDblClicked.bind(this));
    this.onItemMouseOut();
  }
}
