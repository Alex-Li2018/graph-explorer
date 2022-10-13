import { GraphModel } from './render/Graph';
import { GraphStyleModel } from './render/GraphStyle';
import { ForceSimulation } from './force/ForceSimulation';
import { ZoomLimitsReached, ZoomType } from './types';
declare type MeasureSizeFn = () => {
    width: number;
    height: number;
};
export declare class Visualization {
    private measureSize;
    private graph;
    style: GraphStyleModel;
    isFullscreen: boolean;
    wheelZoomRequiresModKey?: boolean | undefined;
    private initialZoomToFit?;
    private readonly root;
    private baseGroup;
    private rect;
    private container;
    private geometry;
    private zoomBehavior;
    private zoomMinScaleExtent;
    private callbacks;
    forceSimulation: ForceSimulation;
    private draw;
    private isZoomClick;
    constructor(element: SVGElement, measureSize: MeasureSizeFn, onZoomEvent: (limitsReached: ZoomLimitsReached) => void, onDisplayZoomWheelInfoMessage: () => void, graph: GraphModel, style: GraphStyleModel, isFullscreen: boolean, wheelZoomRequiresModKey?: boolean | undefined, initialZoomToFit?: boolean | undefined);
    private render;
    private updateNodes;
    private updateRelationships;
    zoomByType: (zoomType: ZoomType) => void;
    private zoomToFitViewport;
    private getZoomScaleFactorToFitWholeGraph;
    private adjustZoomMinScaleExtentToFitGraph;
    on: (event: string, callback: (...args: any[]) => void) => this;
    trigger: (event: string, ...args: any[]) => void;
    init(): void;
    setInitialZoom(): void;
    precomputeAndStart(): void;
    update(options: {
        updateNodes: boolean;
        updateRelationships: boolean;
        restartSimulation?: boolean;
    }): void;
    boundingBox(): DOMRect | undefined;
    resize(isFullscreen: boolean, wheelZoomRequiresModKey: boolean): void;
}
export {};
