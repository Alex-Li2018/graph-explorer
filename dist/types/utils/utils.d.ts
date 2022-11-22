import { RelationshipModel } from '../models/Relationship';
import { IndexMap, Degree } from '../types';
export declare const isArray: (arg: any) => arg is any[];
export declare const isFunction: (val: unknown) => val is Function;
export declare const isNumber: (val: unknown) => val is number;
export declare const isNaN: (num: unknown) => boolean;
export declare const toNumber: (val: any) => any;
export declare const isString: (val: unknown) => val is string;
export declare function isNullish(x: unknown): x is null | undefined;
export declare function optionalToString(value: any): any;
export declare const selectorStringToArray: (selector: string) => string[];
export declare const selectorArrayToString: (selectors: any) => any;
export declare const getFuncByUnknownType: (defaultValue: number, value?: number | number[] | {
    width: number;
    height: number;
} | ((d?: any) => number) | undefined, resultIsNumber?: boolean) => (d?: any) => number | number[];
export declare const getDegree: (n: number, nodeIdxMap: IndexMap, edges: RelationshipModel[] | null) => Degree[];
export declare const getEdgeTerminal: (RelationshipModel: RelationshipModel, type: 'source' | 'target') => string;
