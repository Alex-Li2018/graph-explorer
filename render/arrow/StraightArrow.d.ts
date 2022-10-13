import { RelationshipCaptionLayout } from '../Relationship';
export declare class StraightArrow {
    length: number;
    midShaftPoint: {
        x: number;
        y: number;
    };
    outline: (shortCaptionLength: number) => string;
    overlay: (minWidth: number) => string;
    shaftLength: number;
    deflection: number;
    constructor(startRadius: number, endRadius: number, centreDistance: number, shaftWidth: number, headWidth: number, headHeight: number, captionLayout: RelationshipCaptionLayout);
}
