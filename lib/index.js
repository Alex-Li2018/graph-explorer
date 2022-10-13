'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('core-js/modules/es.array.filter.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.array.join.js');
var d3Ease = require('d3-ease');
var d3Selection = require('d3-selection');
var d3Zoom = require('d3-zoom');

/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var ZOOM_MIN_SCALE = 0.1;
var ZOOM_MAX_SCALE = 2;
var ZOOM_FIT_PADDING_PERCENT = 0.05;

var GraphVisualization = /*#__PURE__*/function () {
  //   private geometry: GraphGeometryModel
  // private callbacks: Record<
  //   string,
  //   undefined | Array<(...args: any[]) => void>
  // > = {};
  // forceSimulation: ForceSimulation;
  // This flags that a panning is ongoing and won't trigger
  // 'canvasClick' event when panning ends.
  function GraphVisualization(element, measureSize, // onZoomEvent: (limitsReached: ZoomLimitsReached) => void,
  onDisplayZoomWheelInfoMessage, // private graph: GraphModel,
  // public style: GraphStyleModel,
  isFullscreen, wheelZoomRequiresModKey) {
    var _this = this;

    this.measureSize = void 0;
    this.isFullscreen = void 0;
    this.wheelZoomRequiresModKey = void 0;
    this.root = void 0;
    this.baseGroup = void 0;
    this.rect = void 0;
    this.container = void 0;
    this.zoomBehavior = void 0;
    this.zoomMinScaleExtent = ZOOM_MIN_SCALE;
    this.draw = false;
    this.isZoomClick = false;

    this.getZoomScaleFactorToFitWholeGraph = function () {
      var _this$container$node, _this$root$node, _this$root$node2;

      var graphSize = (_this$container$node = _this.container.node()) == null ? void 0 : _this$container$node.getBBox();
      var availableWidth = (_this$root$node = _this.root.node()) == null ? void 0 : _this$root$node.clientWidth;
      var availableHeight = (_this$root$node2 = _this.root.node()) == null ? void 0 : _this$root$node2.clientHeight;

      if (graphSize && availableWidth && availableHeight) {
        var graphWidth = graphSize.width;
        var graphHeight = graphSize.height;
        var graphCenterX = graphSize.x + graphWidth / 2;
        var graphCenterY = graphSize.y + graphHeight / 2;
        if (graphWidth === 0 || graphHeight === 0) return;
        var scale = (1 - ZOOM_FIT_PADDING_PERCENT) / Math.max(graphWidth / availableWidth, graphHeight / availableHeight);
        var centerPointOffset = {
          x: -graphCenterX,
          y: -graphCenterY
        };
        return {
          scale: scale,
          centerPointOffset: centerPointOffset
        };
      }

      return;
    };

    this.adjustZoomMinScaleExtentToFitGraph = function (padding_factor) {
      if (padding_factor === void 0) {
        padding_factor = 0.75;
      }

      var scaleAndOffset = _this.getZoomScaleFactorToFitWholeGraph();

      var scaleToFitGraphWithPadding = scaleAndOffset ? scaleAndOffset.scale * padding_factor : _this.zoomMinScaleExtent;

      if (scaleToFitGraphWithPadding <= _this.zoomMinScaleExtent) {
        _this.zoomMinScaleExtent = scaleToFitGraphWithPadding;

        _this.zoomBehavior.scaleExtent([scaleToFitGraphWithPadding, ZOOM_MAX_SCALE]);
      }
    };

    this.measureSize = measureSize;
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
    this.root = d3Selection.select(element);
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey; // Remove the base group element when re-creating the visualization

    this.root.selectAll('g').remove();
    this.baseGroup = this.root.append('g').attr('transform', 'translate(0,0)');
    this.rect = this.baseGroup.append('rect').style('fill', 'none').style('pointer-events', 'all') // Make the rect cover the whole surface, center of the svg viewbox is in (0,0)
    .attr('x', function () {
      return -Math.floor(measureSize().width / 2);
    }).attr('y', function () {
      return -Math.floor(measureSize().height / 2);
    }).attr('width', '100%').attr('height', '100%').attr('transform', 'scale(1)') // Background click event
    // Check if panning is ongoing
    .on('click', function () {
      if (!_this.draw) ;
    });
    this.container = this.baseGroup.append('g'); // this.geometry = new GraphGeometryModel(style);

    this.zoomBehavior = d3Zoom.zoom().scaleExtent([this.zoomMinScaleExtent, ZOOM_MAX_SCALE]).on('zoom', function (e) {
      var isZoomClick = _this.isZoomClick;
      _this.draw = true;
      _this.isZoomClick = false; // const currentZoomScale = e.transform.k;
      // const limitsReached: ZoomLimitsReached = {
      //   zoomInLimitReached: currentZoomScale >= ZOOM_MAX_SCALE,
      //   zoomOutLimitReached: currentZoomScale <= this.zoomMinScaleExtent,
      // };
      // onZoomEvent(limitsReached);

      return _this.container.transition().duration(isZoomClick ? 400 : 20).call(function (sel) {
        return isZoomClick ? sel.ease(d3Ease.easeCubic) : sel;
      }).attr('transform', String(e.transform));
    }) // This is the default implementation of wheelDelta function in d3-zoom v3.0.0
    // For some reasons typescript complains when trying to get it by calling zoomBehaviour.wheelDelta() instead
    // but it should be the same (and indeed it works at runtime).
    // https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/README.md#zoom_wheelDelta
    // Keps the zoom behavior constant for metam ctrl and shift key. Otherwise scrolling is faster with ctrl key.
    .wheelDelta(function (e) {
      return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);
    }).filter(function (e) {
      if (e.type === 'wheel') {
        var modKeySelected = e.metaKey || e.ctrlKey || e.shiftKey;

        if (_this.wheelZoomRequiresModKey && !modKeySelected) {
          onDisplayZoomWheelInfoMessage();
          return false;
        }
      }

      return true;
    });
    this.root.call(this.zoomBehavior) // Single click is not panning
    .on('click.zoom', function () {
      return _this.draw = false;
    }).on('dblclick.zoom', null); // this.forceSimulation = new ForceSimulation(this.render.bind(this));
  } // private render() {
  // this.geometry.onTick(this.graph);
  // const nodeGroups = this.container
  //   .selectAll<SVGGElement, NodeModel>('g.node')
  //   .attr('transform', (d) => `translate(${d.x},${d.y})`);
  // nodeRenderer.forEach((renderer) => nodeGroups.call(renderer.onTick, this));
  // const relationshipGroups = this.container
  //   .selectAll<SVGGElement, RelationshipModel>('g.relationship')
  //   .attr(
  //     'transform',
  //     (d) =>
  //       `translate(${d.source.x} ${d.source.y}) rotate(${
  //         d.naturalAngle + 180
  //       })`,
  //   );
  // relationshipRenderer.forEach((renderer) =>
  //   relationshipGroups.call(renderer.onTick, this),
  // );
  // }


  var _proto = GraphVisualization.prototype;

  _proto.updateNodes = function updateNodes() {// const nodes = this.graph.nodes();
    // this.geometry.onGraphChange(this.graph, {
    //   updateNodes: true,
    //   updateRelationships: false,
    // });
    // const nodeGroups = this.container
    //   .select('g.layer.nodes')
    //   .selectAll<SVGGElement, NodeModel>('g.node')
    //   .data(nodes, (d) => d.id)
    //   .join('g')
    //   .attr('class', 'node')
    //   .attr('aria-label', (d) => `graph-node${d.id}`)
    //   .call(nodeEventHandlers, this.trigger, this.forceSimulation.simulation)
    //   .classed('selected', (node) => node.selected);
    // nodeRenderer.forEach((renderer) =>
    //   nodeGroups.call(renderer.onGraphChange, this),
    // );
    // nodeMenuRenderer.forEach((renderer) =>
    //   nodeGroups.call(renderer.onGraphChange, this),
    // );
    // this.forceSimulation.updateNodes(this.graph);
    // this.forceSimulation.updateRelationships(this.graph);
  };

  _proto.updateRelationships = function updateRelationships() {// const relationships = this.graph.relationships();
    // this.geometry.onGraphChange(this.graph, {
    //   updateNodes: false,
    //   updateRelationships: true,
    // });
    // const relationshipGroups = this.container
    //   .select('g.layer.relationships')
    //   .selectAll<SVGGElement, RelationshipModel>('g.relationship')
    //   .data(relationships, (d) => d.id)
    //   .join('g')
    //   .attr('class', 'relationship')
    //   .call(relationshipEventHandlers, this.trigger)
    //   .classed('selected', (relationship) => relationship.selected);
    // relationshipRenderer.forEach((renderer) =>
    //   relationshipGroups.call(renderer.onGraphChange, this),
    // );
    // this.forceSimulation.updateRelationships(this.graph);
  } // zoomByType = (zoomType: ZoomType): void => {
  // this.draw = true;
  // this.isZoomClick = true;
  // if (zoomType === ZoomType.IN) {
  //   this.zoomBehavior.scaleBy(this.root, 1.3);
  // } else if (zoomType === ZoomType.OUT) {
  //   this.zoomBehavior.scaleBy(this.root, 0.7);
  // } else if (zoomType === ZoomType.FIT) {
  //   this.zoomToFitViewport();
  //   this.adjustZoomMinScaleExtentToFitGraph(1);
  // }
  // };
  // private zoomToFitViewport = () => {
  //   const scaleAndOffset = this.getZoomScaleFactorToFitWholeGraph();
  //   if (scaleAndOffset) {
  //     const { scale, centerPointOffset } = scaleAndOffset;
  //     // Do not zoom in more than zoom max scale for really small graphs
  //     this.zoomBehavior.transform(
  //       this.root,
  //       zoomIdentity
  //         .scale(Math.min(scale, ZOOM_MAX_SCALE))
  //         .translate(centerPointOffset.x, centerPointOffset.y),
  //     );
  //   }
  // };
  ;

  // on = (event: string, callback: (...args: any[]) => void): this => {
  //   if (isNullish(this.callbacks[event])) {
  //     this.callbacks[event] = [];
  //   }
  //   this.callbacks[event]?.push(callback);
  //   return this;
  // };
  // trigger = (event: string, ...args: any[]): void => {
  //   const callbacksForEvent = this.callbacks[event] ?? [];
  //   callbacksForEvent.forEach((callback) => callback.apply(null, args));
  // };
  _proto.init = function init() {
    this.container.selectAll('g.layer').data(['relationships', 'nodes']).join('g').attr('class', function (d) {
      return "layer " + d;
    });
    this.updateNodes();
    this.updateRelationships();
    this.adjustZoomMinScaleExtentToFitGraph();
    this.setInitialZoom();
  };

  _proto.setInitialZoom = function setInitialZoom() {// const count = this.graph.nodes().length;
    // // chosen by *feel* (graph fitting guesstimate)
    // const scale = -0.02364554 + 1.913 / (1 + (count / 12.7211) ** 0.8156444);
    // this.zoomBehavior.scaleBy(this.root, Math.max(0, scale));
  };

  _proto.precomputeAndStart = function precomputeAndStart() {// this.forceSimulation.precomputeAndStart(
    //   () => this.initialZoomToFit && this.zoomByType(ZoomType.FIT),
    // );
  } // update(options: {
  //   updateNodes: boolean;
  //   updateRelationships: boolean;
  //   restartSimulation?: boolean;
  // }): void {
  // if (options.updateNodes) {
  //   this.updateNodes();
  // }
  // if (options.updateRelationships) {
  //   this.updateRelationships();
  // }
  // if (options.restartSimulation ?? true) {
  //   this.forceSimulation.restart();
  // }
  // this.trigger('updated');
  // }
  ;

  _proto.boundingBox = function boundingBox() {
    var _this$container$node2;

    return (_this$container$node2 = this.container.node()) == null ? void 0 : _this$container$node2.getBBox();
  };

  _proto.resize = function resize(isFullscreen, wheelZoomRequiresModKey) {
    var size = this.measureSize();
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
    this.rect.attr('x', function () {
      return -Math.floor(size.width / 2);
    }).attr('y', function () {
      return -Math.floor(size.height / 2);
    });
    this.root.attr('viewBox', [-Math.floor(size.width / 2), -Math.floor(size.height / 2), size.width, size.height].join(' '));
  };

  return GraphVisualization;
}();

exports.GraphVisualization = GraphVisualization;
