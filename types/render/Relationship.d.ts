import { VizItemProperty } from '../../types';
import { ArcArrow } from './arrow/ArcArrow';
import { LoopArrow } from './arrow/LoopArrow';
import { StraightArrow } from './arrow/StraightArrow';
import { NodeModel } from './Node';
export declare type RelationshipCaptionLayout = 'internal' | 'external';
export declare class RelationshipModel {
  id: string;
  propertyList: VizItemProperty[];
  propertyMap: Record<string, string>;
  source: NodeModel;
  target: NodeModel;
  type: string;
  isNode: boolean;
  isRelationship: boolean;
  naturalAngle: number;
  caption: string;
  captionLength: number;
  captionHeight: number;
  captionLayout: RelationshipCaptionLayout;
  shortCaption: string | undefined;
  shortCaptionLength: number | undefined;
  selected: boolean;
  centreDistance: number;
  internal: boolean | undefined;
  arrow: ArcArrow | LoopArrow | StraightArrow | undefined;
  constructor(
    id: string,
    source: NodeModel,
    target: NodeModel,
    type: string,
    properties: Record<string, string>,
    propertyTypes: Record<string, string>,
  );
  toJSON(): Record<string, string>;
  isLoop(): boolean;
}
