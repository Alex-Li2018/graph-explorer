/**
 * this algorithm refers to <cytoscape.js> - https://github.com/cytoscape/cytoscape.js/
 */
import { NodeModel } from '../models/Node';
import { RelationshipModel } from '../models/Relationship';
import { PointTuple, GridLayoutOptions } from '../types';
interface Size {
    width: number;
    height: number;
}
export interface OutNode extends NodeModel {
    x: number;
    y: number;
    fx: number;
    fy: number;
    comboId?: string;
    layer?: number;
    _order?: number;
    layout?: boolean;
    size?: number | number[] | undefined;
}
declare type INode = OutNode & {
    degree: number;
    size: number | PointTuple | Size;
};
/**
 * 网格布局
 */
export declare class GridLayout {
    /** 布局起始点 */
    begin: PointTuple;
    /** prevents node overlap(重叠), may overflow boundingBox if not enough space */
    preventOverlap: boolean;
    /** extra spacing around nodes when preventOverlap: true */
    preventOverlapPadding: number;
    /** uses all available space on false, uses minimal space on true */
    condense: boolean;
    /** force num of rows in the grid */
    rows: number | undefined;
    /** force num of columns in the grid */
    cols: number | undefined;
    /** the spacing between two nodes */
    nodeSpacing: ((d?: unknown) => number) | number | undefined;
    /** returns { row, col } for element */
    position: ((node: INode) => {
        row?: number;
        col?: number;
    }) | undefined;
    /** a sorting function to order the nodes; e.g. function(a, b){ return a.datapublic ('weight') - b.data('weight') } */
    sortBy: string;
    nodeSize: number | number[] | {
        width: number;
        height: number;
    } | undefined;
    nodes: INode[];
    edges: RelationshipModel[];
    width: number;
    height: number;
    private cells;
    private row;
    private col;
    private splits;
    private columns;
    private cellWidth;
    private cellHeight;
    private cellUsed;
    private id2manPos;
    /** 迭代结束的回调函数 */
    onLayoutEnd: () => void;
    constructor(options?: GridLayoutOptions);
    updateConfig(cfg: any): void;
    getDefaultCfg(): {
        begin: number[];
        preventOverlap: boolean;
        preventOverlapPadding: number;
        condense: boolean;
        rows: undefined;
        cols: undefined;
        position: undefined;
        sortBy: string;
        nodeSize: number;
    };
    /**
     * 执行布局
     */
    execute(): {
        nodes: INode[];
        edges: RelationshipModel[];
    };
    private small;
    private large;
    private used;
    private use;
    private moveToNextCell;
    private getPos;
    getType(): string;
}
export {};
