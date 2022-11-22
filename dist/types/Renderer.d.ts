import { BaseType, Selection } from 'd3-selection';
import GraphVisualization from './index';
declare type RendererEventHandler<Datum> = (selection: Selection<SVGGElement, Datum, BaseType, unknown>, style: GraphVisualization) => void;
export default class Renderer<Datum> {
    onGraphChange: RendererEventHandler<Datum>;
    onTick: RendererEventHandler<Datum>;
    name: string;
    constructor({ onGraphChange, onTick, name, }: {
        onGraphChange?: RendererEventHandler<Datum>;
        onTick?: RendererEventHandler<Datum>;
        name: string;
    });
}
export {};
