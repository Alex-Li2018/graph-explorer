import { RelationshipCaptionLayout } from '../Relationship';
declare type Point = {
  x: number;
  y: number;
};
export declare class ArcArrow {
  deflection: number;
  midShaftPoint: Point;
  outline: (shortCaptionLength: number) => string;
  overlay: (minWidth: number) => string;
  shaftLength: number;
  constructor(
    startRadius: number,
    endRadius: number,
    endCentre: number,
    deflection: number,
    arrowWidth: number,
    headWidth: number,
    headLength: number,
    captionLayout: RelationshipCaptionLayout,
  );
}
export {};
