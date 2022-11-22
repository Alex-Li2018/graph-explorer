import { NodeModel } from '../models/Node';
import { RelationshipModel } from '../models/Relationship';
import { PointTuple, CircularLayoutOptions } from '../types';
export declare class CircularLayout {
    /** 布局中心 */
    center: PointTuple | undefined;
    /** 固定半径，若设置了 radius，则 startRadius 与 endRadius 不起效 */
    radius: number | null;
    /** 节点间距，若设置 nodeSpacing，则 radius 将被自动计算，即设置 radius 不生效 */
    nodeSpacing: ((d?: unknown) => number) | number | undefined;
    /** 节点大小，配合 nodeSpacing，一起用于计算 radius。若不配置，节点大小默认为 30 */
    nodeSize: number | undefined;
    /** 起始半径 */
    startRadius: number | null;
    /** 终止半径 */
    endRadius: number | null;
    /** 起始角度 */
    startAngle: number;
    /** 终止角度 */
    endAngle: number;
    /** 是否顺时针 */
    clockwise: boolean;
    /** 节点在环上分成段数（几个段将均匀分布），在 endRadius - startRadius != 0 时生效 */
    divisions: number;
    /** 节点在环上排序的依据，可选: 'topology', 'degree', 'null' */
    ordering: 'topology' | 'topology-directed' | 'degree' | null;
    /** how many 2*pi from first to last nodes */
    angleRatio: number;
    nodes: NodeModel[];
    edges: RelationshipModel[];
    private degrees;
    width: number;
    height: number;
    onLayoutEnd: (() => void) | undefined;
    constructor(options?: CircularLayoutOptions);
    updateConfig(cfg: any): void;
    getDefaultConfig(): {
        radius: null;
        startRadius: null;
        endRadius: null;
        startAngle: number;
        endAngle: number;
        clockwise: boolean;
        divisions: number;
        ordering: null;
        angleRatio: number;
    };
    /**
     * 执行布局
     */
    execute(): {
        nodes: NodeModel[];
        edges: RelationshipModel[];
    } | undefined;
    /**
     * 根据节点的拓扑结构排序
     * @return {array} orderedNodes 排序后的结果
     */
    /**
     * 根据节点度数大小排序
     * @return {array} orderedNodes 排序后的结果
     */
    degreeOrdering(): NodeModel[];
    getType(): string;
}
