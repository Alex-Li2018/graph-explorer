import { easeCubic } from 'd3-ease';
import { BaseType, Selection, select as d3Select } from 'd3-selection';
import {
  D3ZoomEvent,
  ZoomBehavior,
  zoom as d3Zoom,
  zoomIdentity,
} from 'd3-zoom';
import {
  ZOOM_FIT_PADDING_PERCENT,
  ZOOM_MAX_SCALE,
  ZOOM_MIN_SCALE,
} from './constants';
import { BasicNodesAndRels } from './types';
import { GraphModel } from './models/Graph';
import { createGraph } from './models/MapGraphData';
import { GraphGeometryModel } from './render/GraphGeometryModel';
import { GraphStyleModel } from './models/GraphStyle';
import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
import { isNullish } from './utils/utils';
import { ForceSimulation } from './layout/force/ForceSimulation';
import {
  nodeEventHandlers,
  relationshipEventHandlers,
  nodeForceDragEventHandlers,
  nodeDragEventHandlers,
} from './mouseEventHandlers';
import {
  node as nodeRenderer,
  relationship as relationshipRenderer,
} from './render/renderers/init';
import {
  ZoomLimitsReached,
  ZoomType,
  GetNodeNeighboursFn,
  VizItem,
  LayoutType,
} from './types';
import { GraphEventHandlerModel } from './GraphEventHandlerModel';
import { GraphStats } from './utils/mapper';
import { CircularLayout } from './layout/CircularLayout';
import { GridLayout } from './layout/GridLayout';
import { svgToImageDownload, DownloadImageOptions } from './imageDownload';

type UpdateStyle = {
  color?: string;
  size?: number;
};
type MeasureSizeFn = () => { width: number; height: number };
type ZoomEvent = (limitsReached: ZoomLimitsReached) => void;
type VoidEvent = () => void;

export default class GraphVisualization {
  private readonly root: Selection<SVGElement, unknown, BaseType, unknown>;
  private baseGroup: Selection<SVGGElement, unknown, BaseType, unknown>;
  private rect: Selection<SVGRectElement, unknown, BaseType, unknown>;
  private container: Selection<SVGGElement, unknown, BaseType, unknown>;
  private geometry: GraphGeometryModel;
  private zoomBehavior: ZoomBehavior<SVGElement, unknown>;
  // 最小缩放
  private zoomMinScaleExtent: number = ZOOM_MIN_SCALE;
  private callbacks: Record<
    string,
    undefined | Array<(...args: unknown[]) => void>
  > = {};
  public graph: GraphModel;
  public style: GraphStyleModel;

  // 力仿真
  forceSimulation: ForceSimulation;
  // 环形布局
  circularlayout: CircularLayout;
  // 网格布局
  gridLayout: GridLayout;

  // This flags that a panning is ongoing and won't trigger
  // 'canvasClick' event when panning(平移) ends.
  private draw = false;
  private isZoomClick = false;

  constructor(
    element: SVGElement,
    private measureSize: MeasureSizeFn,
    public graphData: BasicNodesAndRels,
    // public style: GraphStyleModel,
    public isFullscreen: boolean,
    public layout: LayoutType,
    onZoomEvent?: ZoomEvent,
    onDisplayZoomWheelInfoMessage?: VoidEvent,
    public wheelZoomRequiresModKey?: boolean,
    private initialZoomToFit?: boolean,
  ) {
    this.root = d3Select(element);

    // 初始化配置
    this.initConfig(
      isFullscreen,
      layout,
      wheelZoomRequiresModKey,
      initialZoomToFit,
    );
    // 初始化图谱数据
    this.initGraphData(graphData);
    // 初始化样式
    this.initStyle();
    // 初始化容器
    this.innitContainer(measureSize);
    // 设置svg的viebox 当画布尺寸变化时 可以调用此函数
    this.resize(this.isFullscreen, this.wheelZoomRequiresModKey);
    // 容器缩放事件
    this.containerZoomEvent(onZoomEvent, onDisplayZoomWheelInfoMessage);
    // 初始化所有节点 边
    this.initNodeAndRelationship();
    // 初始化缩放比例
    this.setInitialZoom();
    // 初始化布局控制逻辑
    this.execLayoutController();
  }

  // 初始化配置
  private initConfig(
    isFullscreen: boolean,
    layout: LayoutType,
    wheelZoomRequiresModKey?: boolean,
    initialZoomToFit?: boolean,
  ) {
    this.layout = layout;
    this.isFullscreen = isFullscreen;
    this.wheelZoomRequiresModKey = wheelZoomRequiresModKey;
    this.initialZoomToFit = initialZoomToFit;
  }

  // 初始化图谱数据
  private initGraphData(graphData: BasicNodesAndRels) {
    // init graph data
    this.graph = createGraph(graphData.nodes, graphData.relationships);
  }

  // 初始化样式
  private initStyle() {
    // init graph style
    this.style = new GraphStyleModel();

    this.geometry = new GraphGeometryModel(this.style);
  }

  // 初始化容器
  private innitContainer(measureSize: MeasureSizeFn) {
    // Remove the base group element when re-creating the visualization
    this.root.selectAll('g').remove();
    this.baseGroup = this.root.append('g').attr('transform', 'translate(0,0)');

    this.rect = this.baseGroup
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      // Make the rect cover the whole surface, center of the svg viewbox is in (0,0)
      .attr('x', () => -Math.floor(measureSize().width / 2))
      .attr('y', () => -Math.floor(measureSize().height / 2))
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('transform', 'scale(1)')
      // Background click event
      // Check if panning is ongoing
      .on('click', () => {
        if (!this.draw) {
          return this.trigger('canvasClicked');
        }
      });

    // node relation container
    this.container = this.baseGroup.append('g');
    this.container.classed('container-layer');

    this.container
      .selectAll('g.layer')
      .data(['relationships', 'nodes'])
      .join('g')
      .attr('class', (d) => `layer ${d}`);
  }

  // 容器缩放事件
  private containerZoomEvent(
    onZoomEvent?: ZoomEvent,
    onDisplayZoomWheelInfoMessage?: VoidEvent,
  ) {
    this.zoomBehavior = d3Zoom<SVGElement, unknown>()
      // 设置缩放的范围
      .scaleExtent([this.zoomMinScaleExtent, ZOOM_MAX_SCALE])
      .on('zoom', (e: D3ZoomEvent<SVGElement, unknown>) => {
        const isZoomClick = this.isZoomClick;
        this.draw = true;
        this.isZoomClick = false;

        const currentZoomScale = e.transform.k;
        const limitsReached: ZoomLimitsReached = {
          zoomInLimitReached: currentZoomScale >= ZOOM_MAX_SCALE,
          zoomOutLimitReached: currentZoomScale <= this.zoomMinScaleExtent,
        };
        onZoomEvent && onZoomEvent(limitsReached);

        return this.container
          .transition()
          .duration(isZoomClick ? 400 : 20)
          .call((sel) => (isZoomClick ? sel.ease(easeCubic) : sel))
          .attr('transform', String(e.transform));
      })
      // This is the default implementation of wheelDelta function in d3-zoom v3.0.0
      // For some reasons typescript complains when trying to get it by calling zoomBehaviour.wheelDelta() instead
      // but it should be the same (and indeed it works at runtime).
      // https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/README.md#zoom_wheelDelta
      // Keps the zoom behavior constant for metam ctrl and shift key. Otherwise scrolling is faster with ctrl key.
      .wheelDelta(
        (e) => -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002),
      )
      .filter((e) => {
        if (e.type === 'wheel') {
          const modKeySelected = e.metaKey || e.ctrlKey || e.shiftKey;
          if (this.wheelZoomRequiresModKey && !modKeySelected) {
            onDisplayZoomWheelInfoMessage && onDisplayZoomWheelInfoMessage();
            return false;
          }
        }
        return true;
      });

    this.root
      .call(this.zoomBehavior)
      // Single click is not panning
      .on('click.zoom', () => (this.draw = false))
      .on('dblclick.zoom', null);
  }

  // 初始化节点 边以及缩放比例
  initNodeAndRelationship(): void {
    this.updateNodes();
    this.updateRelationships();
  }

  // 初始化布局
  private execLayoutController() {
    switch (this.layout) {
      case 'force':
        this.forceSimulationHandler();
        break;
      case 'circular':
        this.cricularLayoutHandler();
        break;
      case 'grid':
        this.gridLayoutHandler();
        break;
      default:
        break;
    }
  }

  update(options: {
    updateNodes: boolean;
    updateRelationships: boolean;
    restartSimulation?: boolean;
  }): void {
    if (options.updateNodes) {
      this.updateNodes();
      this.forceSimulation.updateNodes(this.graph);
      this.forceSimulation.updateRelationships(this.graph);
    }

    if (options.updateRelationships) {
      this.updateRelationships();
      this.forceSimulation.updateRelationships(this.graph);
    }

    if (options.restartSimulation ?? true) {
      this.forceSimulation.restart();
    }
    this.trigger('updated');
  }

  private updateNodes() {
    const nodes = this.graph.nodes();
    this.geometry.onGraphChange(this.graph, {
      updateNodes: true,
      updateRelationships: false,
    });

    const nodeGroups = this.container
      .select('g.layer.nodes')
      .selectAll<SVGGElement, NodeModel>('g.node')
      .data(nodes, (d) => d.id)
      .join('g')
      .attr('class', 'node')
      .attr('aria-label', (d) => `graph-node${d.id}`)
      .call(nodeEventHandlers, this.trigger)
      // 如果被选中 那么添加对应的选择样式
      .classed('selected', (node) => node.selected);

    if (this.layout !== 'force') {
      // drag事件
      this.container
        .select('g.layer.nodes')
        .selectAll<SVGGElement, NodeModel>('g.node')
        .call(nodeDragEventHandlers);
    }

    nodeRenderer.forEach((renderer) =>
      nodeGroups.call(renderer.onGraphChange, this),
    );
  }

  private updateRelationships() {
    const relationships = this.graph.relationships();
    this.geometry.onGraphChange(this.graph, {
      updateNodes: false,
      updateRelationships: true,
    });

    const relationshipGroups = this.container
      .select('g.layer.relationships')
      .selectAll<SVGGElement, RelationshipModel>('g.relationship')
      .data(relationships, (d) => d.id)
      .join('g')
      .attr('class', 'relationship')
      .call(relationshipEventHandlers, this.trigger)
      .classed('selected', (relationship) => relationship.selected);

    relationshipRenderer.forEach((renderer) =>
      relationshipGroups.call(renderer.onGraphChange, this),
    );
  }

  // 更新节点样式
  public updateNodesStyle(node: NodeModel, style: UpdateStyle) {
    const { color, size } = style;
    color && node.class.push(color);
    size && node.class.push(`${size}`);

    const colorStyle = color ? { color } : {};
    const sizeStyle = size ? { diameter: `${50 * size}px` } : {};

    this.style.changeForSelectorWithNodeClass(node, {
      ...colorStyle,
      ...sizeStyle,
    });
    this.updateNodes();
  }

  public updateRelationShipsStyle(
    style: UpdateStyle,
    // relationship: RelationshipModel,
  ) {
    const { color } = style;
    const colorStyle = color ? { color } : {};

    this.style.changeForSelectorWithRelationClass({
      ...colorStyle,
    });
    this.updateRelationships();
  }

  private render() {
    this.geometry.onTick(this.graph);

    const nodeGroups = this.container
      .selectAll<SVGGElement, NodeModel>('g.node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    nodeRenderer.forEach((renderer) => nodeGroups.call(renderer.onTick, this));

    const relationshipGroups = this.container
      .selectAll<SVGGElement, RelationshipModel>('g.relationship')
      .attr(
        'transform',
        (d) =>
          `translate(${d.source.x} ${d.source.y}) rotate(${
            d.naturalAngle + 180
          })`,
      );

    relationshipRenderer.forEach((renderer) =>
      relationshipGroups.call(renderer.onTick, this),
    );
  }

  zoomByType = (zoomType: ZoomType): void => {
    this.draw = true;
    this.isZoomClick = true;

    if (zoomType === ZoomType.IN) {
      this.zoomBehavior.scaleBy(this.root, 1.3);
    } else if (zoomType === ZoomType.OUT) {
      this.zoomBehavior.scaleBy(this.root, 0.7);
    } else if (zoomType === ZoomType.FIT) {
      this.zoomToFitViewport();
      this.adjustZoomMinScaleExtentToFitGraph(1);
    }
  };

  private zoomToFitViewport = () => {
    const scaleAndOffset = this.getZoomScaleFactorToFitWholeGraph();
    if (scaleAndOffset) {
      const { scale, centerPointOffset } = scaleAndOffset;
      // Do not zoom in more than zoom max scale for really small graphs
      this.zoomBehavior.transform(
        this.root,
        zoomIdentity
          .scale(Math.min(scale, ZOOM_MAX_SCALE))
          .translate(centerPointOffset.x, centerPointOffset.y),
      );
    }
  };

  // 获取适配整个图谱的缩放大小 以及平移大小
  private getZoomScaleFactorToFitWholeGraph = ():
    | { scale: number; centerPointOffset: { x: number; y: number } }
    | undefined => {
    const graphSize =
      // this.container.node()返回当前选择集的第一个元素
      this.container.node()?.getBBox && this.container.node()?.getBBox();
    const availableWidth = this.root.node()?.clientWidth;
    const availableHeight = this.root.node()?.clientHeight;

    if (graphSize && availableWidth && availableHeight) {
      const graphWidth = graphSize.width;
      const graphHeight = graphSize.height;

      const graphCenterX = graphSize.x + graphWidth / 2;
      const graphCenterY = graphSize.y + graphHeight / 2;

      if (graphWidth === 0 || graphHeight === 0) return;

      const scale =
        (1 - ZOOM_FIT_PADDING_PERCENT) /
        Math.max(graphWidth / availableWidth, graphHeight / availableHeight);

      const centerPointOffset = { x: -graphCenterX, y: -graphCenterY };

      return { scale: scale, centerPointOffset: centerPointOffset };
    }
    return;
  };

  private adjustZoomMinScaleExtentToFitGraph = (
    padding_factor = 0.75,
  ): void => {
    const scaleAndOffset = this.getZoomScaleFactorToFitWholeGraph();
    const scaleToFitGraphWithPadding = scaleAndOffset
      ? scaleAndOffset.scale * padding_factor
      : this.zoomMinScaleExtent;
    if (scaleToFitGraphWithPadding <= this.zoomMinScaleExtent) {
      this.zoomMinScaleExtent = scaleToFitGraphWithPadding;
      this.zoomBehavior.scaleExtent([
        scaleToFitGraphWithPadding,
        ZOOM_MAX_SCALE,
      ]);
    }
  };

  setInitialZoom(): void {
    const count = this.graph.nodes().length;

    // chosen by *feel* (graph fitting guesstimate)
    const scale = -0.02364554 + 1.913 / (1 + (count / 12.7211) ** 0.8156444);
    this.zoomBehavior.scaleBy(this.root, Math.max(0, scale));
  }

  precomputeAndStart(): void {
    this.forceSimulation.precomputeAndStart(
      () => this.initialZoomToFit && this.zoomByType(ZoomType.FIT),
    );
  }

  resize(
    isFullscreen: boolean,
    wheelZoomRequiresModKey: boolean | undefined,
  ): void {
    const size = this.measureSize();
    this.isFullscreen = isFullscreen || this.isFullscreen;
    this.wheelZoomRequiresModKey =
      wheelZoomRequiresModKey || this.wheelZoomRequiresModKey;

    this.rect
      .attr('x', () => -Math.floor(size.width / 2))
      .attr('y', () => -Math.floor(size.height / 2));

    this.root.attr(
      'viewBox',
      [
        -Math.floor(size.width / 2),
        -Math.floor(size.height / 2),
        size.width,
        size.height,
      ].join(' '),
    );
  }

  boundingBox(): DOMRect | undefined {
    return this.container.node()?.getBBox();
  }

  // init graph bind event
  initEventHandler(
    getNodeNeighbours: GetNodeNeighboursFn,
    onItemMouseOver: (item: VizItem, event?: Event) => void,
    onItemSelect: (item: VizItem, event?: Event) => void,
    onGraphModelChange: (stats: GraphStats) => void,
    onGraphInteraction: (item: VizItem, event: Event) => void,
  ) {
    const graphEventHandler = new GraphEventHandlerModel(
      this.graph,
      this,
      getNodeNeighbours,
      onItemMouseOver,
      onItemSelect,
      onGraphModelChange,
      onGraphInteraction,
    );
    graphEventHandler.bindEventHandlers();

    return graphEventHandler;
  }

  on = (event: string, callback: (...args: any[]) => void): this => {
    if (isNullish(this.callbacks[event])) {
      this.callbacks[event] = [];
    }

    this.callbacks[event]?.push(callback);
    return this;
  };

  trigger = (event: string, ...args: any[]): void => {
    const callbacksForEvent = this.callbacks[event] ?? [];
    // eslint-disable-next-line prefer-spread
    callbacksForEvent.forEach((callback) => callback.apply(null, args));
  };

  // 环形布局
  public cricularLayoutHandler() {
    // 关闭力模型布局
    this.forceSimulation && this.forceSimulation.stop();

    const size = this.measureSize();
    const padding_margin = 100;

    this.circularlayout = new CircularLayout({
      type: 'circular',
      center: [0, 0],
      width: size.width - padding_margin,
      height: size.height - padding_margin,
      startRadius: null,
      endRadius: null,
      clockwise: true,
      ordering: 'degree',
      // nodeSpacing: 20,
      // nodeSize: 25,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      nodes: this.graph.nodes(),
      edges: this.graph.relationships(),
    });

    this.circularlayout.execute();
    this.render();
  }

  // 力模型布局
  public forceSimulationHandler() {
    this.adjustZoomMinScaleExtentToFitGraph();
    this.forceSimulation = new ForceSimulation(this.render.bind(this));

    // drag事件
    this.container
      .select('g.layer.nodes')
      .selectAll<SVGGElement, NodeModel>('g.node')
      .call(nodeForceDragEventHandlers, this.forceSimulation.simulation);

    this.forceSimulation.updateNodes(this.graph);
    this.forceSimulation.updateRelationships(this.graph);
    this.precomputeAndStart();
  }

  // 网格布局
  public gridLayoutHandler() {
    // 关闭力模型布局
    this.forceSimulation && this.forceSimulation.stop();

    const size = this.measureSize();
    const padding_margin = 100;

    this.gridLayout = new GridLayout({
      type: 'grid',
      width: size.width - padding_margin,
      height: size.height - padding_margin,
      begin: [0, 0],
      nodes: this.graph.nodes(),
      edges: this.graph.relationships(),
    });

    this.gridLayout.execute();
    this.render();
  }

  // 下载图片
  public downloadImage(
    dom: Element,
    fileName?: string,
    options?: DownloadImageOptions,
  ) {
    svgToImageDownload(dom, fileName, options);
  }

  // 根据出入度更新图谱
  public updateGraphWithDegree() {
    const nodes = this.graph.nodes();
    nodes.forEach((item) => {
      item.degree = item.relationshipCount(this.graph);
    });

    this.updateNodes();
    this.updateRelationships();
    this.execLayoutController();
  }

  // 重置出入度更新图谱
  public updateGraphWithResetDegree() {
    const nodes = this.graph.nodes();
    nodes.forEach((item) => {
      item.degree = 0;
    });

    this.updateNodes();
    this.updateRelationships();
    this.execLayoutController();
  }

  // 销毁画布
  public destroy() {
    this.root.selectChildren().remove();
  }
}
