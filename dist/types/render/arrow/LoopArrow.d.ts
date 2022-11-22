declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    toString(): string;
}
export declare class LoopArrow {
    midShaftPoint: Point;
    outline: () => string;
    overlay: (minWidth: number) => string;
    shaftLength: number;
    constructor(nodeRadius: number, straightLength: number, spreadDegrees: number, shaftWidth: number, headWidth: number, headLength: number, captionHeight: number);
}
export {};
