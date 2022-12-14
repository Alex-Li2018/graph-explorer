import { NodeModel } from './models/Node';
import { RelationshipModel } from './models/Relationship';
export declare const MAX_PRECOMPUTED_TICKS = 300;
export declare const EXTRA_TICKS_PER_RENDER = 10;
export declare const VELOCITY_DECAY = 0.4;
export declare const DEFAULT_ALPHA = 1;
export declare const DEFAULT_ALPHA_TARGET = 0;
export declare const DEFAULT_ALPHA_MIN = 0.05;
export declare const DRAGGING_ALPHA = 0.8;
export declare const DRAGGING_ALPHA_TARGET = 0.09;
export declare const LINK_DISTANCE = 45;
export declare const FORCE_LINK_DISTANCE: (relationship: RelationshipModel) => number;
export declare const FORCE_COLLIDE_RADIUS: (node: NodeModel) => number;
export declare const FORCE_CHARGE = -400;
export declare const FORCE_CENTER_X = 0.03;
export declare const FORCE_CENTER_Y = 0.03;
export declare const ZOOM_MIN_SCALE = 0.1;
export declare const ZOOM_MAX_SCALE = 2;
export declare const ZOOM_FIT_PADDING_PERCENT = 0.05;
