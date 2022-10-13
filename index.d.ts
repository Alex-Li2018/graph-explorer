declare type MeasureSizeFn = () => {
  width: number;
  height: number;
};
export declare class GraphVisualization {
  private measureSize;
  isFullscreen: boolean;
  wheelZoomRequiresModKey?: boolean | undefined;
  private readonly root;
  private baseGroup;
  private rect;
  private container;
  private zoomBehavior;
  private zoomMinScaleExtent;
  private draw;
  private isZoomClick;
  constructor(
    element: SVGElement,
    measureSize: MeasureSizeFn,
    onDisplayZoomWheelInfoMessage: () => void,
    isFullscreen: boolean,
    wheelZoomRequiresModKey?: boolean | undefined,
  );
  private updateNodes;
  private updateRelationships;
  private getZoomScaleFactorToFitWholeGraph;
  private adjustZoomMinScaleExtentToFitGraph;
  init(): void;
  setInitialZoom(): void;
  precomputeAndStart(): void;
  boundingBox(): DOMRect | undefined;
  resize(isFullscreen: boolean, wheelZoomRequiresModKey: boolean): void;
}
export {};
