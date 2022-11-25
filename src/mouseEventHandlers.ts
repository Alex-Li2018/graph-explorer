import { D3DragEvent, drag as d3Drag } from 'd3-drag';
import { Simulation } from 'd3-force';
import { BaseType, Selection } from 'd3-selection';

import {
  DEFAULT_ALPHA_TARGET,
  DRAGGING_ALPHA,
  DRAGGING_ALPHA_TARGET,
} from './constants';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';

export const nodeEventHandlers = (
  selection: Selection<SVGGElement, NodeModel, BaseType, unknown>,
  trigger: (event: string, node: NodeModel, _event: Event) => void,
) => {
  const onNodeClick = (_event: Event, node: NodeModel) => {
    trigger('nodeClicked', node, _event);
  };

  const onNodeDblClick = (_event: Event, node: NodeModel) => {
    trigger('nodeDblClicked', node, _event);
  };

  const onNodeMouseOver = (_event: Event, node: NodeModel) => {
    if (!node.fx && !node.fy) {
      node.hoverFixed = true;
      node.fx = node.x;
      node.fy = node.y;
    }

    trigger('nodeMouseOver', node, _event);
  };

  const onNodeMouseOut = (_event: Event, node: NodeModel) => {
    if (node.hoverFixed) {
      node.hoverFixed = false;
      node.fx = null;
      node.fy = null;
    }

    trigger('nodeMouseOut', node, _event);
  };

  return selection
    .on('mouseover', onNodeMouseOver)
    .on('mouseout', onNodeMouseOut)
    .on('click', onNodeClick)
    .on('dblclick', onNodeDblClick);
};

// 力模型的拖拽事件
export const nodeForceDragEventHandlers = (
  selection: Selection<SVGGElement, NodeModel, BaseType, unknown>,
  simulation?: Simulation<NodeModel, RelationshipModel>,
) => {
  let initialDragPosition: [number, number];
  let restartedSimulation = false;
  const tolerance = 25;

  const dragstarted = (event: D3DragEvent<SVGGElement, NodeModel, any>) => {
    initialDragPosition = [event.x, event.y];
    restartedSimulation = false;
  };

  const dragged = (
    event: D3DragEvent<SVGGElement, NodeModel, any>,
    node: NodeModel,
  ) => {
    // Math.sqrt was removed to avoid unnecessary computation, since this
    // function is called very often when dragging.
    const dist =
      Math.pow(initialDragPosition[0] - event.x, 2) +
      Math.pow(initialDragPosition[1] - event.y, 2);

    // This is to prevent clicks/double clicks from restarting the simulation
    if (dist > tolerance && !restartedSimulation && simulation) {
      // Set alphaTarget to a value higher than alphaMin so the simulation
      // isn't stopped while nodes are being dragged.
      simulation
        .alphaTarget(DRAGGING_ALPHA_TARGET)
        .alpha(DRAGGING_ALPHA)
        .restart();
      restartedSimulation = true;
    }

    node.hoverFixed = false;
    node.fx = event.x;
    node.fy = event.y;
  };

  const dragended = (_event: D3DragEvent<SVGGElement, NodeModel, any>) => {
    if (restartedSimulation && simulation) {
      // Reset alphaTarget so the simulation cools down and stops.
      simulation.alphaTarget(DEFAULT_ALPHA_TARGET);
    }
  };

  return selection.call(
    d3Drag<SVGGElement, NodeModel>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
  );
};

export const nodeDragEventHandlers = (
  selection: Selection<SVGGElement, NodeModel, BaseType, unknown>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const dragstarted = () => {};

  const dragged = (
    event: D3DragEvent<SVGGElement, NodeModel, any>,
    node: NodeModel,
  ) => {
    node.x = event.x;
    node.y = event.y;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const dragended = () => {};

  return selection.call(
    d3Drag<SVGGElement, NodeModel>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
  );
};

export const relationshipEventHandlers = (
  selection: Selection<SVGGElement, RelationshipModel, BaseType, unknown>,
  trigger: (event: string, rel: RelationshipModel, _event: Event) => void,
) => {
  const onRelationshipClick = (event: Event, rel: RelationshipModel) => {
    event.stopPropagation();
    trigger('relationshipClicked', rel, event);
  };

  const onRelMouseOver = (_event: Event, rel: RelationshipModel) => {
    trigger('relMouseOver', rel, _event);
  };

  const onRelMouseOut = (_event: Event, rel: RelationshipModel) => {
    trigger('relMouseOut', rel, _event);
  };

  return selection
    .on('mousedown', onRelationshipClick)
    .on('mouseover', onRelMouseOver)
    .on('mouseout', onRelMouseOut);
};
